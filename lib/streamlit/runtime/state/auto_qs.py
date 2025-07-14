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
        NotImplementedError: If the value type is not supported
    """
    if isinstance(value, str):
        return value
    if isinstance(value, bool):
        # Handle bool before int since bool is a subclass of int
        return "true" if value else "false"
    if isinstance(value, int) or isinstance(value, float):
        return str(value)
    raise NotImplementedError(
        f"Query parameter serialization not supported for type {type(value).__name__}. "
        f"Supported types: str, int, float, bool"
    )


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
        NotImplementedError: If the target type is not supported or deserialization fails
    """
    if target_type is str:
        return value_str
    if target_type is bool:
        if value_str.lower() == "true":
            return True
        if value_str.lower() == "false":
            return False
        raise NotImplementedError(
            f"Cannot deserialize '{value_str}' to bool. Expected 'true' or 'false'."
        )
    if target_type is int:
        try:
            return int(value_str)
        except ValueError:
            raise NotImplementedError(f"Cannot deserialize '{value_str}' to int.")
    elif target_type is float:
        try:
            return float(value_str)
        except ValueError:
            raise NotImplementedError(f"Cannot deserialize '{value_str}' to float.")
    else:
        raise NotImplementedError(
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
    """
    # Remove leading '?' if present
    query_string = query_string.removeprefix("?")

    # Parse the query string
    params = parse.parse_qs(query_string, keep_blank_values=True)

    # Convert to simple dict (take last value if multiple)
    result = {}
    for key, values in params.items():
        if values:
            result[key] = values[-1]
        else:
            result[key] = ""

    return result
