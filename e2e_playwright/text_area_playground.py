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

import streamlit as st

st.set_page_config(layout="wide")

st.title("Text Area Playground")

with st.sidebar:
    st.header("Text Area Parameters")

    label = st.text_input("label", "Text area label")
    initial_value = st.text_area("initial value", "Initial value")
    help_text = st.text_area("help", "Tooltip with *markdown*.")
    placeholder: str | None = st.text_input("placeholder", "Enter text here...")
    if not placeholder:
        placeholder = None

    max_chars = st.number_input(
        "max_chars", min_value=0, value=None, step=1, placeholder="No limit"
    )

    disabled = st.checkbox("disabled", False)
    label_visibility = st.radio(
        "label_visibility", ["visible", "hidden", "collapsed"], index=0
    )

    st.subheader("Height")
    height_option = st.selectbox(
        "height", ["None", "int", "content", "stretch"], index=0
    )
    height: int | str | None = None
    if height_option == "int":
        height = st.number_input("height value (px)", min_value=68, value=200, step=10)
    elif height_option != "None":
        height = height_option

    st.subheader("Width")
    width_option = st.radio("width", ["stretch", "int"], index=0)
    width: int | str
    if width_option == "int":
        width = st.number_input("width value (px)", min_value=100, value=400, step=10)
    else:
        width = "stretch"


def on_change_callback():
    st.session_state.text_area_changed = True
    st.toast(f"Value changed to: {st.session_state.my_text_area}")


if "text_area_changed" not in st.session_state:
    st.session_state.text_area_changed = False

col1, col2 = st.columns(2)

with col1:
    st.subheader("Text Area Widget")
    text_output = st.text_area(  # type: ignore
        label=label,
        value=initial_value,
        height=height,
        max_chars=max_chars,
        key="my_text_area",
        help=help_text,
        on_change=on_change_callback,
        placeholder=placeholder,
        disabled=disabled,
        label_visibility=label_visibility,
        width=width,
    )

with col2:
    st.subheader("Returned Value")
    st.write(text_output)

    st.subheader("Return type")
    st.write(type(text_output).__name__)

    if st.session_state.text_area_changed:
        st.success("`on_change` callback was triggered!")
        st.session_state.text_area_changed = False

st.subheader("Session State")
st.json(st.session_state)
