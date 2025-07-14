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
Test app for query parameter widget functionality.

This app contains 8 widgets:
- 4 with query parameter binding (keys starting with "?")
- 4 without query parameter binding (regular keys)

This allows testing both the new query param functionality and ensuring
we didn't break existing widget behavior.
"""

import streamlit as st

st.title("Query Parameter Widget Test App")

st.header("Query Parameter Widgets")
st.markdown("These widgets sync with URL query parameters:")

# Query parameter widgets (keys start with "?")
text_qp = st.text_input(
    "Text Input (Query Param)", key="?text_param", value="default_text"
)
number_qp = st.number_input(
    "Number Input (Query Param)", key="?number_param", value=42.0
)
checkbox_qp = st.checkbox("Checkbox (Query Param)", key="?checkbox_param", value=False)
selectbox_qp = st.selectbox(
    "Selectbox (Query Param)",
    key="?selectbox_param",
    options=["option1", "option2", "option3"],
    index=0,
)

st.header("Regular Widgets")
st.markdown("These widgets do NOT sync with URL query parameters:")

# Regular widgets (normal keys)
text_reg = st.text_input(
    "Text Input (Regular)", key="text_regular", value="regular_text"
)
number_reg = st.number_input(
    "Number Input (Regular)", key="number_regular", value=100.0
)
checkbox_reg = st.checkbox("Checkbox (Regular)", key="checkbox_regular", value=True)
selectbox_reg = st.selectbox(
    "Selectbox (Regular)",
    key="selectbox_regular",
    options=["choice1", "choice2", "choice3"],
    index=1,
)

st.header("Current Values")
st.markdown("**Query Parameter Widget Values:**")
st.json(
    {
        "text_param": text_qp,
        "number_param": number_qp,
        "checkbox_param": checkbox_qp,
        "selectbox_param": selectbox_qp,
    }
)

st.markdown("**Regular Widget Values:**")
st.json(
    {
        "text_regular": text_reg,
        "number_regular": number_reg,
        "checkbox_regular": checkbox_reg,
        "selectbox_regular": selectbox_reg,
    }
)

st.header("Current URL Query Parameters")
st.json(dict(st.query_params))
