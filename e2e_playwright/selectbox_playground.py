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

from __future__ import annotations

import json
from typing import Any, Callable

import streamlit as st

st.set_page_config(layout="wide")

st.title("Selectbox Playground")

with st.sidebar:
    st.header("Selectbox Parameters")

    label = st.text_input("label", "Selectbox label")
    help_text = st.text_area("help", "Tooltip with *markdown*.")

    placeholder = st.text_input("placeholder", "Choose an option")
    if not placeholder:
        placeholder = None  # type: ignore

    disabled = st.checkbox("disabled", False)
    label_visibility = st.radio(
        "label_visibility", ["visible", "hidden", "collapsed"], index=0
    )
    accept_new_options = st.checkbox("accept_new_options", False)

    st.subheader("Options")
    options_type = st.radio(
        "Options type",
        [
            "List of strings",
            "List of numbers",
            "List of mixed types",
            "List of tuples",
            "JSON",
        ],
    )

    options: list[str | int | float | bool | None | tuple[str, int] | list[str]] = []

    if options_type == "List of strings":
        options = ["Apple", "Banana", "Orange", "Strawberry"]
    elif options_type == "List of numbers":
        options = [1, 2, 3, 4]
    elif options_type == "List of mixed types":
        options = ["Text", 123, None, True, 3.14]
    elif options_type == "List of tuples":
        options = [("A", 1), ("B", 2), ("C", 3)]
    elif options_type == "JSON":
        json_input = st.text_area(
            "Enter JSON options", '["JSON1", "JSON2", {"key": "value"}]'
        )
        try:
            options = json.loads(json_input)
        except json.JSONDecodeError:
            st.error("Invalid JSON")
            options = []

    st.write("Current options:", options)

    st.subheader("Index & Default Value")

    index: int | None = None
    use_index = st.radio("Use index?", ["Yes", "No (use placeholder)"], index=0)
    if use_index == "Yes":
        max_index = len(options) - 1 if options else 0
        index = st.number_input(
            "index", min_value=0, max_value=max_index, value=0, step=1
        )

    st.subheader("Format Function")
    format_func_choice = st.radio(
        "format_func",
        [
            "str (default)",
            "Uppercase",
            "Type prefixed",
            "Custom for tuples",
        ],
    )

    def get_format_func(choice: str) -> Callable[[Any], str]:
        if choice == "Uppercase":
            return lambda x: str(x).upper()
        if choice == "Type prefixed":
            return lambda x: f"{type(x).__name__}: {x}"
        if choice == "Custom for tuples":
            return lambda x: x[0] if isinstance(x, tuple) and len(x) > 0 else str(x)
        return str

    format_func = get_format_func(format_func_choice)


def on_change_callback():
    st.session_state.selectbox_changed = True
    st.toast(f"Value changed to: {st.session_state.my_selectbox}")


if "selectbox_changed" not in st.session_state:
    st.session_state.selectbox_changed = False

col1, col2 = st.columns(2)

with col1:
    st.subheader("Selectbox Widget")
    selected_option = st.selectbox(  # type: ignore
        label=label,
        options=options,
        index=index,
        format_func=format_func,
        key="my_selectbox",
        help=help_text,
        on_change=on_change_callback,
        placeholder=placeholder,
        disabled=disabled,
        label_visibility=label_visibility,
        accept_new_options=accept_new_options,
    )

with col2:
    st.subheader("Selected Value")
    st.write(selected_option)

    st.subheader("Return type")
    st.write(type(selected_option).__name__)

    if st.session_state.selectbox_changed:
        st.success("`on_change` callback was triggered!")
        st.session_state.selectbox_changed = False

st.subheader("Session State")
st.json(st.session_state)
