import pandas as pd

import streamlit as st

dt = pd.DataFrame({"a": [1, 2], "b": [2, 3]})

if "dt" not in st.session_state:
    st.session_state["dt"] = dt

st.session_state["dt"] = st.data_editor(
    st.session_state["dt"].copy(True), num_rows="dynamic", key="my_df"
)

st.write(st.session_state["dt"])
