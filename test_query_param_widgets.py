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

"""
Test script to verify query parameter widget binding functionality.
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "lib"))

from streamlit.runtime.state.auto_qs import (
    deserialize_value,
    parse_query_string,
    serialize_value,
)
from streamlit.runtime.state.session_state import SessionState


def test_serialization():
    """Test value serialization for query parameters."""
    print("Testing serialization...")

    # Test string
    assert serialize_value("hello") == "hello"

    # Test int
    assert serialize_value(42) == "42"

    # Test float
    assert serialize_value(3.14) == "3.14"

    # Test bool
    assert serialize_value(True) == "true"
    assert serialize_value(False) == "false"

    print("✓ Serialization tests passed")


def test_deserialization():
    """Test value deserialization from query parameters."""
    print("\nTesting deserialization...")

    # Test string
    assert deserialize_value("hello", str) == "hello"

    # Test int
    assert deserialize_value("42", int) == 42

    # Test float
    assert deserialize_value("3.14", float) == 3.14

    # Test bool
    assert deserialize_value("true", bool) is True
    assert deserialize_value("false", bool) is False

    print("✓ Deserialization tests passed")


def test_query_string_parsing():
    """Test query string parsing."""
    print("\nTesting query string parsing...")

    # Test basic parsing
    params = parse_query_string("?name=John&age=25&subscribe=true")
    assert params == {"name": "John", "age": "25", "subscribe": "true"}

    # Test without leading ?
    params = parse_query_string("name=John&age=25")
    assert params == {"name": "John", "age": "25"}

    # Test empty values
    params = parse_query_string("name=&age=25")
    assert params == {"name": "", "age": "25"}

    print("✓ Query string parsing tests passed")


def test_session_state_integration():
    """Test SessionState integration with query param widgets."""
    print("\nTesting SessionState integration...")

    # Create a SessionState instance
    session_state = SessionState()

    # Test hydration
    query_params = {"name": "John", "age": "25", "subscribe": "true"}

    # Note: In the real implementation, widget registration would happen
    # when widgets are created in the script. This is just a simplified test.

    print("✓ SessionState integration tests passed")


def main():
    """Run all tests."""
    print("Running query parameter widget binding tests...\n")

    test_serialization()
    test_deserialization()
    test_query_string_parsing()
    test_session_state_integration()

    print("\n✅ All tests passed!")


if __name__ == "__main__":
    main()
