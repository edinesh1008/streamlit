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

"""Test script to verify query parameter widget binding functionality."""

from streamlit.runtime.state.auto_qs import (
    deserialize_value,
    parse_query_string,
    serialize_value,
)
from streamlit.runtime.state.session_state import SessionState


def test_serialize_string_value() -> None:
    """Test that string values are serialized correctly."""
    result = serialize_value("hello")
    assert result == "hello"


def test_serialize_int_value() -> None:
    """Test that integer values are serialized correctly."""
    result = serialize_value(42)
    assert result == "42"


def test_serialize_float_value() -> None:
    """Test that float values are serialized correctly."""
    result = serialize_value(3.14)
    assert result == "3.14"


def test_serialize_bool_true() -> None:
    """Test that boolean True is serialized correctly."""
    result = serialize_value(True)
    assert result == "true"


def test_serialize_bool_false() -> None:
    """Test that boolean False is serialized correctly."""
    result = serialize_value(False)
    assert result == "false"


def test_deserialize_string_value() -> None:
    """Test that string values are deserialized correctly."""
    result = deserialize_value("hello", str)
    assert result == "hello"


def test_deserialize_int_value() -> None:
    """Test that integer values are deserialized correctly."""
    result = deserialize_value("42", int)
    assert result == 42


def test_deserialize_float_value() -> None:
    """Test that float values are deserialized correctly."""
    result = deserialize_value("3.14", float)
    assert result == 3.14


def test_deserialize_bool_true() -> None:
    """Test that boolean True is deserialized correctly."""
    result = deserialize_value("true", bool)
    assert result is True


def test_deserialize_bool_false() -> None:
    """Test that boolean False is deserialized correctly."""
    result = deserialize_value("false", bool)
    assert result is False


def test_parse_query_string_with_question_mark() -> None:
    """Test parsing query string with leading question mark."""
    result = parse_query_string("?name=John&age=25&subscribe=true")
    expected = {"name": "John", "age": "25", "subscribe": "true"}
    assert result == expected


def test_parse_query_string_without_question_mark() -> None:
    """Test parsing query string without leading question mark."""
    result = parse_query_string("name=John&age=25")
    expected = {"name": "John", "age": "25"}
    assert result == expected


def test_parse_query_string_with_empty_values() -> None:
    """Test parsing query string with empty parameter values."""
    result = parse_query_string("name=&age=25")
    expected = {"name": "", "age": "25"}
    assert result == expected


def test_session_state_can_be_created() -> None:
    """Test that SessionState can be instantiated."""
    session_state = SessionState()
    assert session_state is not None


if __name__ == "__main__":
    # Run all test functions
    test_functions = [
        test_serialize_string_value,
        test_serialize_int_value,
        test_serialize_float_value,
        test_serialize_bool_true,
        test_serialize_bool_false,
        test_deserialize_string_value,
        test_deserialize_int_value,
        test_deserialize_float_value,
        test_deserialize_bool_true,
        test_deserialize_bool_false,
        test_parse_query_string_with_question_mark,
        test_parse_query_string_without_question_mark,
        test_parse_query_string_with_empty_values,
        test_session_state_can_be_created,
    ]

    for test_func in test_functions:
        try:
            test_func()
        except Exception as e:
            raise AssertionError(f"Test {test_func.__name__} failed: {e}") from e
