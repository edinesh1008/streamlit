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

import streamlit as st

st.session_state["disable"] = st.session_state.get("disable", False)
st.session_state["counter"] = st.session_state.get("counter", 0) + 1

st.info(f"Script rerun {st.session_state['counter']} times")

files = st.file_uploader(label="Upload a file", disabled=st.session_state["disable"], type=["txt"])

st.info(f"File uploaded: {files is not None}")

button = st.button("Enable" if st.session_state["disable"] else "Disable")
if button:
    st.session_state["disable"] = not st.session_state["disable"]
    st.rerun()