# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for query parameter auto-binding utilities."""

import pytest

from streamlit.runtime.state.auto_qs import (
    deserialize_value,
    parse_query_string,
    serialize_value,
    validate_param_name,
    validate_param_value,
)


class TestValidation:
    """Test validation functions for security and correctness."""

    def test_validate_param_name_valid(self):
        """Test valid parameter names."""
        validate_param_name("valid_name")
        validate_param_name("valid-name")
        validate_param_name("validname123")
        validate_param_name("a")

    def test_validate_param_name_invalid(self):
        """Test invalid parameter names."""
        with pytest.raises(ValueError, match="Parameter name cannot be empty"):
            validate_param_name("")

        with pytest.raises(ValueError, match="Parameter name too long"):
            validate_param_name("a" * 101)

        with pytest.raises(ValueError, match="Invalid parameter name"):
            validate_param_name("invalid name")  # space

        with pytest.raises(ValueError, match="Invalid parameter name"):
            validate_param_name("invalid.name")  # dot

        with pytest.raises(ValueError, match="Invalid parameter name"):
            validate_param_name("invalid@name")  # special char

    def test_validate_param_value_valid(self):
        """Test valid parameter values."""
        validate_param_value("")
        validate_param_value("valid value")
        validate_param_value("x" * 2000)  # max length

    def test_validate_param_value_invalid(self):
        """Test invalid parameter values."""
        with pytest.raises(ValueError, match="Parameter value too long"):
            validate_param_value("x" * 2001)


class TestSerialization:
    """Test value serialization functions."""

    def test_serialize_value_string(self):
        """Test string serialization."""
        assert serialize_value("hello") == "hello"
        assert serialize_value("hello world") == "hello%20world"
        assert serialize_value("") == ""

    def test_serialize_value_bool(self):
        """Test boolean serialization."""
        assert serialize_value(True) == "true"
        assert serialize_value(False) == "false"

    def test_serialize_value_int(self):
        """Test integer serialization."""
        assert serialize_value(42) == "42"
        assert serialize_value(-10) == "-10"
        assert serialize_value(0) == "0"

    def test_serialize_value_float(self):
        """Test float serialization."""
        assert serialize_value(3.14) == "3.14"
        assert serialize_value(-2.5) == "-2.5"
        assert serialize_value(0.0) == "0.0"

    def test_serialize_value_none(self):
        """Test None serialization."""
        assert serialize_value(None) == ""

    def test_serialize_value_invalid_type(self):
        """Test serialization of unsupported types."""
        with pytest.raises(ValueError, match="not supported for type"):
            serialize_value([1, 2, 3])

        with pytest.raises(ValueError, match="not supported for type"):
            serialize_value({"key": "value"})

    def test_serialize_value_string_too_long(self):
        """Test serialization of overly long strings."""
        with pytest.raises(ValueError, match="String value too long"):
            serialize_value("x" * 2001)


class TestDeserialization:
    """Test value deserialization functions."""

    def test_deserialize_value_string(self):
        """Test string deserialization."""
        assert deserialize_value("hello", str) == "hello"
        assert deserialize_value("hello%20world", str) == "hello world"
        assert deserialize_value("", str) is None

    def test_deserialize_value_bool(self):
        """Test boolean deserialization."""
        assert deserialize_value("true", bool) is True
        assert deserialize_value("false", bool) is False
        assert deserialize_value("TRUE", bool) is True
        assert deserialize_value("FALSE", bool) is False

    def test_deserialize_value_bool_invalid(self):
        """Test invalid boolean deserialization."""
        with pytest.raises(ValueError, match="Cannot deserialize"):
            deserialize_value("maybe", bool)

    def test_deserialize_value_int(self):
        """Test integer deserialization."""
        assert deserialize_value("42", int) == 42
        assert deserialize_value("-10", int) == -10
        assert deserialize_value("0", int) == 0

    def test_deserialize_value_int_invalid(self):
        """Test invalid integer deserialization."""
        with pytest.raises(ValueError, match="Cannot deserialize"):
            deserialize_value("not_a_number", int)

    def test_deserialize_value_float(self):
        """Test float deserialization."""
        assert deserialize_value("3.14", float) == 3.14
        assert deserialize_value("-2.5", float) == -2.5
        assert deserialize_value("0.0", float) == 0.0

    def test_deserialize_value_float_invalid(self):
        """Test invalid float deserialization."""
        with pytest.raises(ValueError, match="Cannot deserialize"):
            deserialize_value("not_a_number", float)

    def test_deserialize_value_empty(self):
        """Test deserialization of empty values."""
        assert deserialize_value("", str) is None
        assert deserialize_value("", int) is None
        assert deserialize_value("", float) is None
        assert deserialize_value("", bool) is None

    def test_deserialize_value_invalid_type(self):
        """Test deserialization with unsupported types."""
        with pytest.raises(ValueError, match="not supported for type"):
            deserialize_value("value", list)


class TestQueryStringParsing:
    """Test query string parsing functions."""

    def test_parse_query_string_basic(self):
        """Test basic query string parsing."""
        result = parse_query_string("name=John&age=30")
        assert result == {"name": "John", "age": "30"}

    def test_parse_query_string_with_question_mark(self):
        """Test query string parsing with leading question mark."""
        result = parse_query_string("?name=John&age=30")
        assert result == {"name": "John", "age": "30"}

    def test_parse_query_string_empty(self):
        """Test empty query string parsing."""
        assert parse_query_string("") == {}
        assert parse_query_string("?") == {}

    def test_parse_query_string_url_encoded(self):
        """Test query string parsing with URL encoding."""
        result = parse_query_string("name=John%20Doe&message=Hello%20World")
        assert result == {"name": "John Doe", "message": "Hello World"}

    def test_parse_query_string_multiple_values(self):
        """Test query string parsing with multiple values (last one wins)."""
        result = parse_query_string("name=John&name=Jane")
        assert result == {"name": "Jane"}

    def test_parse_query_string_too_long(self):
        """Test query string that's too long."""
        long_query = "a=1&" * 5000  # Very long query string
        with pytest.raises(ValueError, match="Query string too long"):
            parse_query_string(long_query)

    def test_parse_query_string_too_many_params(self):
        """Test query string with too many parameters."""
        many_params = "&".join(f"param{i}=value{i}" for i in range(100))
        with pytest.raises(ValueError, match="Too many query parameters"):
            parse_query_string(many_params)

    def test_parse_query_string_invalid_param_name(self):
        """Test query string with invalid parameter names (should be skipped)."""
        result = parse_query_string("valid_name=ok&invalid name=bad&another_valid=good")
        assert result == {"valid_name": "ok", "another_valid": "good"}

    def test_parse_query_string_invalid_param_value(self):
        """Test query string with invalid parameter values (should be skipped)."""
        long_value = "x" * 2001
        result = parse_query_string(f"valid=ok&toolong={long_value}")
        assert result == {"valid": "ok"}
