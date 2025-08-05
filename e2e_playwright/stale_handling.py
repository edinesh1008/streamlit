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

import time

import streamlit as st

if st.checkbox("Transient Spinner", value=False):
    placeholder = st.empty()

    # Related issues:
    # https://github.com/streamlit/streamlit/issues/9239
    # https://github.com/streamlit/streamlit/issues/9239

    if "has_ran" not in st.session_state:
        with st.spinner("Spinner"):
            time.sleep(2)
            st.write("Some text")

        st.session_state.has_ran = True

    else:
        st.write("Some text")
        placeholder.write("Has rerun")
        time.sleep(4)

        del st.session_state.has_ran

    st.button("Rerun")

if st.checkbox("Expected stale elemenet", value=False):
    st.write("First text")

    if st.button("Rerun"):
        st.write("Clicked button")
        time.sleep(4)

    st.write("Second text")
    st.write("Third text")
