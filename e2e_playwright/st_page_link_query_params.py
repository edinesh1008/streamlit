"""
Streamlit app for testing query params functionality.
"""

import streamlit as st

st.title("Query Params Test App")

# Display current query params for debugging
st.sidebar.write("Current query params:", dict(st.query_params))

# Test page_link with external URL and query_params parameter
st.header("External Links with Query Params")

st.page_link(
    "https://httpbin.org/get",
    label="External with query_params",
    query_params={"source": "streamlit", "test": "page_link"},
    icon="🌐"
)

# Test page_link with query params in URL
st.page_link(
    "https://httpbin.org/get?url_param=true&existing=value",
    label="External with URL params",
    icon="🔗"
)

# Test page_link with both (precedence test)
st.page_link(
    "https://httpbin.org/get?override=old&keep=this",
    label="Both methods (precedence test)",
    query_params={"override": "new", "add": "extra"},
    icon="⚡"
)

# Test internal page navigation with query params
st.header("Internal Navigation with Query Params")

col1, col2, col3 = st.columns(3)

with col1:
    if st.button("Set query params", key="set_params"):
        st.switch_page(__file__, query_params={"test": "internal", "value": "123"})

with col2:
    if st.button("URL params", key="url_params"):
        st.switch_page(f"{__file__}?method=url&count=456")

with col3:
    if st.button("Clear params", key="clear_params"):
        st.switch_page(__file__)

# Display current query parameters
if st.query_params:
    st.success("Current query parameters:")
    for key, value in st.query_params.items():
        st.write(f"- {key}: {value}")
else:
    st.info("No query parameters set")

# Test different value types
st.header("Query Param Value Types")

st.page_link(
    "https://httpbin.org/get",
    label="Test iterable values",
    query_params={
        "string": "simple_value",
        "list": ["first", "second", "last"],  # Should use "last"
        "empty_list": [],  # Should become empty string
        "number": 42,  # Should be converted to string
    },
    icon="🔢"
)