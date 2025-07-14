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
Demo script showcasing the query parameter widget binding prototype.

This demonstrates how widgets with keys starting with '?' are automatically
synchronized with URL query parameters.
"""

import streamlit as st

st.title("Query Parameter Widget Binding Demo")

st.markdown("""
This demo shows how widgets can be bound to URL query parameters using the `?` prefix in their keys.

Try changing the widget values below and notice how the URL updates automatically!
""")

# Basic widgets with query parameter binding
st.header("Basic Widgets")

col1, col2 = st.columns(2)

if "?foo" in st.session_state:
    st.write(st.session_state["?foo"])
else:
    st.session_state["?foo"] = "test"

with col1:
    # Text input bound to ?name parameter
    name = st.text_input(
        "Name",
        value="John Doe",
        key="?name",
        help="This widget is bound to the 'name' query parameter",
    )

    # Number input bound to ?age parameter
    age = st.number_input(
        "Age",
        min_value=0,
        max_value=120,
        value=25,
        key="?age",
        help="This widget is bound to the 'age' query parameter",
    )

with col2:
    # Checkbox bound to ?subscribe parameter
    subscribe = st.checkbox(
        "Subscribe to newsletter",
        value=False,
        key="?subscribe",
        help="This widget is bound to the 'subscribe' query parameter",
    )

    # Selectbox bound to ?color parameter
    color = st.selectbox(
        "Favorite color",
        options=["red", "green", "blue", "yellow"],
        index=0,
        key="?color",
        help="This widget is bound to the 'color' query parameter",
    )

st.divider()

# Display current values
st.header("Current Values")
st.write(f"**Name:** {name}")
st.write(f"**Age:** {age}")
st.write(f"**Subscribe:** {subscribe}")
st.write(f"**Color:** {color}")

st.divider()

# Show the current URL
st.header("URL State")
st.info("""
The URL query parameters are automatically updated when you change the widget values.
You can also bookmark or share the URL to restore the widget states.
""")

# Display current query parameters
st.code(f"""
Current query parameters:
- name: {st.session_state.get("name", "Not set")}
- age: {st.session_state.get("age", "Not set")}
- subscribe: {st.session_state.get("subscribe", "Not set")}
- color: {st.session_state.get("color", "Not set")}
""")

st.divider()

# Regular widgets (not bound to query params)
st.header("Regular Widgets (Not Bound to URL)")
st.write("These widgets use regular keys and are not synchronized with the URL:")

regular_text = st.text_input("Regular text input", key="regular_text")
regular_number = st.number_input("Regular number", key="regular_number")

st.write(f"Regular text: {regular_text}")
st.write(f"Regular number: {regular_number}")
