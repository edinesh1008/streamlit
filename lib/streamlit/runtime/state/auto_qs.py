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

"""Query parameter auto-binding serialization/deserialization utilities."""

from __future__ import annotations

import math
from typing import Any
from urllib import parse


def serialize_value(value: Any) -> str:
    """Serialize a Python value to a URL query parameter string.

    Supports: str, int, float, bool

    Args:
        value: The value to serialize

    Returns
    -------
        String representation suitable for URL query parameters

    Raises
    ------
        ValueError: If the value type is not supported or serialization fails
    """
    if value is None:
        return ""

    if isinstance(value, str):
        # URL encode the string to handle special characters
        return parse.quote(value, safe="")
    if isinstance(value, bool):
        # Handle bool before int since bool is a subclass of int
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        # Validate numeric values
        if isinstance(value, float) and math.isnan(value):
            raise ValueError("Cannot serialize NaN value to query parameter")
        return str(value)

    raise ValueError(
        f"Query parameter serialization not supported for type {type(value).__name__}. "
        f"Supported types: str, int, float, bool"
    )


def _raise_nan_error() -> None:
    """Raise ValueError for NaN values."""
    raise ValueError("NaN values are not supported")


def deserialize_value(value_str: str, target_type: type[Any]) -> Any:
    """Deserialize a URL query parameter string to a Python value.

    Args:
        value_str: The string value from the URL
        target_type: The expected Python type

    Returns
    -------
        The deserialized value

    Raises
    ------
        ValueError: If the target type is not supported or deserialization fails
    """
    if not value_str:
        return None

    if target_type is str:
        # URL decode the string to handle special characters
        return parse.unquote(value_str)
    if target_type is bool:
        lower_value = value_str.lower()
        if lower_value == "true":
            return True
        if lower_value == "false":
            return False
        raise ValueError(
            f"Cannot deserialize '{value_str}' to bool. Expected 'true' or 'false'."
        )
    if target_type is int:
        try:
            return int(value_str)
        except ValueError as e:
            raise ValueError(f"Cannot deserialize '{value_str}' to int: {e}")
    elif target_type is float:
        try:
            value = float(value_str)
            if math.isnan(value):
                _raise_nan_error()
            return value
        except ValueError as e:
            raise ValueError(f"Cannot deserialize '{value_str}' to float: {e}")
    else:
        raise ValueError(
            f"Query parameter deserialization not supported for type {target_type.__name__}. "
            f"Supported types: str, int, float, bool"
        )


def parse_query_string(query_string: str) -> dict[str, str]:
    """Parse a URL query string into a dictionary.

    Args:
        query_string: The query string (with or without leading '?')

    Returns
    -------
        Dictionary mapping parameter names to their string values

    Raises
    ------
        ValueError: If the query string is malformed
    """
    if not query_string:
        return {}

    # Remove leading '?' if present
    query_string = query_string[1:] if query_string.startswith('?') else query_string

    try:
        # Parse the query string
        params = parse.parse_qs(
            query_string, keep_blank_values=True, strict_parsing=True
        )

        # Convert to simple dict (take last value if multiple)
        result = {}
        for key, values in params.items():
            # Validate parameter names
            if not key or len(key) > 100:  # Reasonable limit
                continue
            if values:
                result[key] = values[-1]
            else:
                result[key] = ""

        return result
    except ValueError as e:
        raise ValueError(f"Malformed query string: {e}")
