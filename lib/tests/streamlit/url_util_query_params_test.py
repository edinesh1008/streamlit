"""
Unit tests for the new URL utility functions added for query params support.
"""

import pytest

from streamlit.url_util import (
    build_query_string,
    normalize_query_params,
    parse_page_and_query_params,
)


class TestQueryParamsUtilities:
    """Test the new query params utility functions."""

    def test_parse_page_and_query_params_no_params(self):
        """Test parsing page string without query params."""
        page, params = parse_page_and_query_params("pages/test.py")
        assert page == "pages/test.py"
        assert params == {}

    def test_parse_page_and_query_params_with_params(self):
        """Test parsing page string with query params."""
        page, params = parse_page_and_query_params("pages/test.py?key=value&other=123")
        assert page == "pages/test.py"
        assert params == {"key": "value", "other": "123"}

    def test_parse_page_and_query_params_empty_values(self):
        """Test parsing page string with empty parameter values."""
        page, params = parse_page_and_query_params("test.py?empty=&zero=0&missing")
        assert page == "test.py"
        assert params == {"empty": "", "zero": "0", "missing": ""}

    def test_parse_page_and_query_params_multiple_values(self):
        """Test parsing page string with multiple values for same key (should use last)."""
        page, params = parse_page_and_query_params("test.py?key=first&key=second&key=last")
        assert page == "test.py"
        assert params == {"key": "last"}  # Should use last value like Tornado

    def test_normalize_query_params_none(self):
        """Test normalize_query_params with None input."""
        result = normalize_query_params(None)
        assert result == {}

    def test_normalize_query_params_empty(self):
        """Test normalize_query_params with empty dict."""
        result = normalize_query_params({})
        assert result == {}

    def test_normalize_query_params_strings(self):
        """Test normalize_query_params with string values."""
        result = normalize_query_params({"key1": "value1", "key2": "value2"})
        assert result == {"key1": "value1", "key2": "value2"}

    def test_normalize_query_params_iterables(self):
        """Test normalize_query_params with iterable values."""
        result = normalize_query_params({
            "single": "value",
            "list": ["first", "second", "last"],
            "tuple": ("a", "b", "c"),
            "empty": [],
        })
        assert result == {
            "single": "value",
            "list": "last",  # Should use last value
            "tuple": "c",    # Should use last value
            "empty": "",     # Empty iterable should become empty string
        }

    def test_normalize_query_params_mixed_types(self):
        """Test normalize_query_params with mixed value types."""
        result = normalize_query_params({
            "string": "value",
            "number": 42,
            "boolean": True,
            "list": [1, 2, 3],
        })
        assert result == {
            "string": "value",
            "number": "42",   # Should be converted to string
            "boolean": "True", # Should be converted to string
            "list": "3",      # Should use last value and convert to string
        }

    def test_build_query_string_empty(self):
        """Test build_query_string with empty dict."""
        result = build_query_string({})
        assert result == ""

    def test_build_query_string_single(self):
        """Test build_query_string with single parameter."""
        result = build_query_string({"key": "value"})
        assert result == "key=value"

    def test_build_query_string_multiple(self):
        """Test build_query_string with multiple parameters."""
        result = build_query_string({"key1": "value1", "key2": "value2"})
        # Order might vary, so check both possible orders
        assert result in ["key1=value1&key2=value2", "key2=value2&key1=value1"]

    def test_build_query_string_special_chars(self):
        """Test build_query_string with special characters (URL encoding)."""
        result = build_query_string({"key": "value with spaces", "special": "a&b=c"})
        assert "key=value+with+spaces" in result or "key=value%20with%20spaces" in result
        assert "special=a%26b%3Dc" in result

    def test_build_query_string_empty_values(self):
        """Test build_query_string with empty values."""
        result = build_query_string({"empty": "", "zero": "0"})
        assert "empty=" in result
        assert "zero=0" in result