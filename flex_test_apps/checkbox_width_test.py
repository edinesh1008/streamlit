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

st.title("Checkbox, Toggle, Radio, and Color Picker Width and Scale Test")
st.write("""
This app demonstrates how the new `width` and `scale` parameters affect the appearance of checkbox, toggle, radio, and color picker widgets.
Compare the different width options: 'content' (default), 'stretch', and fixed pixel width, as well as different scale values.
""")

# Section 1: Checkbox with different width options
st.header("1. Checkboxes with Different Width Options")

st.write("Compare different width options:")
with st.container(border=True, direction="vertical", gap="large"):
    # Content width (default)
    st.checkbox("Default width='content'", key="cb_default")
    # Stretch width
    st.checkbox("Width='stretch'", width="stretch", key="cb_stretch")
    # Fixed pixel width
    st.checkbox("Width=300px", width=300, key="cb_300px")

# Section 2: Toggle with different width options
st.header("2. Toggles with Different Width Options")

st.write("Compare different width options:")
with st.container(border=True, direction="vertical", gap="large"):
    # Content width (default)
    st.toggle("Default width='content'", key="tg_default")
    # Stretch width
    st.toggle("Width='stretch'", width="stretch", key="tg_stretch")
    # Fixed pixel width
    st.toggle("Width=300px", width=300, key="tg_300px")

# Section 3: Different scale values
st.header("3. Widgets with Different Scale Values")

st.subheader("Checkboxes with Different Scales")
st.write("All scaled elements use width='stretch':")
with st.container(border=True, direction="horizontal", gap="large"):
    # Scale 1 (default)
    st.checkbox("Scale=1", scale=1, width="stretch", key="cb_scale1")
    # Scale 2
    st.checkbox("Scale=2", scale=2, width="stretch", key="cb_scale2")
    # Scale 3
    st.checkbox("Scale=3", scale=3, width="stretch", key="cb_scale3")

st.subheader("Toggles with Different Scales")
st.write("All scaled elements use width='stretch':")
with st.container(border=True, direction="horizontal", gap="large"):
    # Scale 1 (default)
    st.toggle("Scale=1", scale=1, width="stretch", key="tg_scale1")
    # Scale 2
    st.toggle("Scale=2", scale=2, width="stretch", key="tg_scale2")
    # Scale 3
    st.toggle("Scale=3", scale=3, width="stretch", key="tg_scale3")

# Section 4: Combinations of width and scale
st.header("4. Combinations of Width and Scale")

st.subheader("Checkboxes with Combined Options")
st.write("Various combinations of width and scale:")
with st.container(border=True, direction="horizontal", gap="large"):
    st.checkbox("Default width & scale", key="cb_default_combo")
    st.checkbox("Stretch width", width="stretch", key="cb_stretch_default_scale")
    st.checkbox(
        "Scale=2, width=stretch", scale=2, width="stretch", key="cb_scale2_stretch"
    )

with st.container(border=True, direction="horizontal", gap="large"):
    st.checkbox("300px width", width=300, key="cb_300px_default_scale")
    st.checkbox(
        "Scale=3, width=stretch", scale=3, width="stretch", key="cb_scale3_stretch"
    )

st.subheader("Toggles with Combined Options")
st.write("Various combinations of width and scale:")
with st.container(border=True, direction="horizontal", gap="large"):
    st.toggle("Default width & scale", key="tg_default_combo")
    st.toggle("Stretch width", width="stretch", key="tg_stretch_default_scale")
    st.toggle(
        "Scale=2, width=stretch", scale=2, width="stretch", key="tg_scale2_stretch"
    )

with st.container(border=True, direction="horizontal", gap="large"):
    st.toggle("300px width", width=300, key="tg_300px_default_scale")
    st.toggle(
        "Scale=3, width=stretch", scale=3, width="stretch", key="tg_scale3_stretch"
    )

# Section 5: Container examples
st.header("5. Container Examples")

st.subheader("Checkboxes and Toggles Together")
with st.container(border=True, direction="horizontal", gap="large"):
    st.checkbox("Default checkbox", key="cb_mixed1")
    st.toggle("Default toggle", key="tg_mixed1")
    st.checkbox("Stretch checkbox", width="stretch", key="cb_mixed2")
    st.toggle("Stretch toggle", width="stretch", key="tg_mixed2")

with st.container(border=True, direction="horizontal", gap="large"):
    st.checkbox("Scale=2 checkbox", scale=2, width="stretch", key="cb_mixed3")
    st.toggle("Scale=2 toggle", scale=2, width="stretch", key="tg_mixed3")
    st.checkbox("Fixed 200px checkbox", width=200, key="cb_mixed4")
    st.toggle("Fixed 200px toggle", width=200, key="tg_mixed4")

# Section 6: Long Label Tests
st.header("6. Tests with Long Labels")

st.subheader("Checkboxes with Long Labels")
st.write("Compare how different width options affect long labels:")
with st.container(border=True, direction="vertical", gap="large"):
    # Content width (default)
    st.checkbox(
        "This is a very long checkbox label that demonstrates how text wrapping works with the default content width setting. The label should wrap based on available space.",
        key="cb_long_default",
    )

    # Stretch width
    st.checkbox(
        "This is a very long checkbox label with width='stretch' that demonstrates how text wrapping works when the container is stretched. The wrapping behavior might differ from the default.",
        width="stretch",
        key="cb_long_stretch",
    )

    # Fixed pixel width
    st.checkbox(
        "This is a very long checkbox label with width=300px that demonstrates how text wrapping works when the container has a fixed width. The wrapping should be constrained to 300px.",
        width=300,
        key="cb_long_300px",
    )

st.write("Long labels with different scale values:")
with st.container(border=True, direction="horizontal", gap="large"):
    # Scale 1 (default)
    st.checkbox(
        "Scale=1: This checkbox has a long label and demonstrates the default scale with width='stretch'.",
        scale=1,
        width="stretch",
        key="cb_long_scale1",
    )

    # Scale 2
    st.checkbox(
        "Scale=2: This checkbox has a long label and demonstrates a larger scale with width='stretch'.",
        scale=2,
        width="stretch",
        key="cb_long_scale2",
    )

    # Scale 3
    st.checkbox(
        "Scale=3: This checkbox has a long label and demonstrates an even larger scale with width='stretch'.",
        scale=3,
        width="stretch",
        key="cb_long_scale3",
    )

st.subheader("Toggles with Long Labels")
st.write("Compare how different width options affect long labels:")
with st.container(border=True, direction="horizontal", gap="large", wrap=False):
    # Content width (default)
    st.toggle(
        "This is a very long toggle label that demonstrates how text wrapping works with the default content width setting. The label should wrap based on available space.",
        key="tg_long_default",
    )

    # Stretch width
    st.toggle(
        "This is a very long toggle label with width='stretch' that demonstrates how text wrapping works when the container is stretched. The wrapping behavior might differ from the default.",
        width="stretch",
        key="tg_long_stretch",
    )

    # Fixed pixel width
    st.toggle(
        "This is a very long toggle label with width=300px that demonstrates how text wrapping works when the container has a fixed width. The wrapping should be constrained to 300px.",
        width=300,
        key="tg_long_300px",
    )

st.write("Long labels with different scale values:")
with st.container(border=True, direction="horizontal", gap="large"):
    # Scale 1 (default)
    st.toggle(
        "Scale=1: This toggle has a long label and demonstrates the default scale with width='stretch'.",
        scale=1,
        width="stretch",
        key="tg_long_scale1",
    )

    # Scale 2
    st.toggle(
        "Scale=2: This toggle has a long label and demonstrates a larger scale with width='stretch'.",
        scale=2,
        width="stretch",
        key="tg_long_scale2",
    )

    # Scale 3
    st.toggle(
        "Scale=3: This toggle has a long label and demonstrates an even larger scale with width='stretch'.",
        scale=3,
        width="stretch",
        key="tg_long_scale3",
    )

# Section 7: Radio Button Tests
st.header("7. Radio Button Tests")

st.subheader("Radio with Different Width Options")
st.write("Compare different width options:")
with st.container(border=True, direction="vertical", gap="large"):
    # Content width (default)
    st.radio(
        "Default width='content'",
        options=["Option 1", "Option 2", "Option 3"],
        key="radio_default",
    )

    # Stretch width
    st.radio(
        "Width='stretch'",
        options=["Option 1", "Option 2", "Option 3"],
        width="stretch",
        key="radio_stretch",
    )

    # Fixed pixel width
    st.radio(
        "Width=300px",
        options=["Option 1", "Option 2", "Option 3"],
        width=300,
        key="radio_300px",
    )

st.subheader("Radio with Different Scale Values")
st.write("All scaled elements use width='stretch':")
with st.container(border=True, direction="horizontal", gap="small"):
    # Scale 1 (default)
    st.radio(
        "Scale=1",
        options=["Option 1", "Option 2"],
        scale=1,
        width="stretch",
        key="radio_scale1",
        horizontal=True,
    )

    # Scale 2
    st.radio(
        "Scale=2",
        options=["Option 1", "Option 2"],
        scale=2,
        width="stretch",
        key="radio_scale2",
        horizontal=True,
    )

    # Scale 3
    st.radio(
        "Scale=3",
        options=["Option 1", "Option 2"],
        scale=3,
        width="stretch",
        key="radio_scale3",
        horizontal=True,
    )

st.subheader("Radio with Horizontal Layout")
st.write("Horizontal layout with different width options:")
with st.container(border=True, direction="vertical", gap="large"):
    # Content width horizontal
    st.radio(
        "Default width='content' (horizontal)",
        options=["Option 1", "Option 2", "Option 3"],
        horizontal=True,
        key="radio_horizontal_default",
    )

    # Stretch width horizontal
    st.radio(
        "Width='stretch' (horizontal)",
        options=["Option 1", "Option 2", "Option 3"],
        horizontal=True,
        width="stretch",
        key="radio_horizontal_stretch",
    )

    # Fixed width horizontal
    st.radio(
        "Width=400px (horizontal)",
        options=["Option 1", "Option 2", "Option 3"],
        horizontal=True,
        width=400,
        key="radio_horizontal_400px",
    )

st.subheader("Radio with Long Labels")
st.write("Compare how different width options affect long labels:")
with st.container(border=True, direction="vertical", gap="large"):
    # Content width (default)
    st.radio(
        "This is a very long radio group label that demonstrates how text wrapping works with the default content width setting.",
        options=[
            "This is a long option that demonstrates wrapping",
            "Another long option that should wrap properly when needed",
            "A third option with enough text to force wrapping behavior",
        ],
        key="radio_long_default",
    )

    # Stretch width
    st.radio(
        "This is a very long radio group label with width='stretch'.",
        options=[
            "This is a long option that demonstrates wrapping with stretch",
            "Another long option that should wrap properly when stretched",
            "A third option with enough text to force wrapping behavior",
        ],
        width="stretch",
        key="radio_long_stretch",
    )

    # Fixed pixel width
    st.radio(
        "This is a very long radio group label with width=300px.",
        options=[
            "This is a long option that demonstrates wrapping with fixed width",
            "Another long option that should wrap when width is constrained",
            "A third option with enough text to force wrapping behavior",
        ],
        width=300,
        key="radio_long_300px",
    )

# Section 8: Interactive demo
st.header("8. Interactive Demo")

# Replace columns with regular layout
width_option = st.radio(
    "Select width option:",
    ["content", "stretch", "300"],
    horizontal=True,
    key="width_selector",
)

# Convert to appropriate type for width
if width_option == "300":
    width_value = 300
else:
    width_value = width_option

scale_value = st.slider("Scale value:", 1, 5, 1, key="scale_selector")

# Force width to stretch when scale > 1
if scale_value > 1 and width_value != "stretch":
    st.info("Setting width='stretch' since scale > 1")
    width_value = "stretch"

st.subheader("Interactive Demo Result")
with st.container(border=True, direction="horizontal", gap="large"):
    interactive_cb = st.checkbox(
        f"Checkbox (width='{width_option}', scale={scale_value})",
        width=width_value,
        scale=scale_value,
        key="interactive_cb",
    )

    interactive_tg = st.toggle(
        f"Toggle (width='{width_option}', scale={scale_value})",
        width=width_value,
        scale=scale_value,
        key="interactive_tg",
    )

    interactive_radio = st.radio(
        f"Radio (width='{width_option}', scale={scale_value})",
        options=["Option A", "Option B"],
        width=width_value,
        scale=scale_value,
        key="interactive_radio",
    )

    interactive_color = st.color_picker(
        f"Color (width='{width_option}', scale={scale_value})",
        value="#2ecc71",
        width=width_value,
        scale=scale_value,
        key="interactive_color",
    )

# Section 9: Color Picker Tests
st.header("9. Color Picker Tests")

st.subheader("Color Picker with Different Width Options")
st.write("Compare different width options:")
with st.container(border=True, direction="vertical", gap="large"):
    # Content width (default)
    st.color_picker(
        "Default width='content'", value="#1abc9c", key="color_picker_default"
    )

    # Stretch width
    st.color_picker(
        "Width='stretch'", value="#3498db", width="stretch", key="color_picker_stretch"
    )

    # Fixed pixel width
    st.color_picker("Width=300px", value="#9b59b6", width=300, key="color_picker_300px")

st.subheader("Color Picker with Different Scale Values")
st.write("All scaled elements use width='stretch':")
with st.container(border=True, direction="horizontal", gap="large"):
    # Scale 1 (default)
    st.color_picker(
        "Scale=1", value="#e74c3c", scale=1, width="stretch", key="color_picker_scale1"
    )

    # Scale 2
    st.color_picker(
        "Scale=2", value="#f1c40f", scale=2, width="stretch", key="color_picker_scale2"
    )

    # Scale 3
    st.color_picker(
        "Scale=3", value="#2ecc71", scale=3, width="stretch", key="color_picker_scale3"
    )

st.subheader("Color Picker with Long Labels")
st.write("Compare how different width options affect long labels:")
with st.container(border=True, direction="vertical", gap="large"):
    # Content width (default)
    st.color_picker(
        "This is a very long color picker label that demonstrates how text wrapping works with the default content width setting.",
        value="#e67e22",
        key="color_picker_long_default",
    )

    # Stretch width
    st.color_picker(
        "This is a very long color picker label with width='stretch'.",
        value="#16a085",
        width="stretch",
        key="color_picker_long_stretch",
    )

    # Fixed pixel width
    st.color_picker(
        "This is a very long color picker label with width=300px.",
        value="#8e44ad",
        width=300,
        key="color_picker_long_300px",
    )

# Update sidebar to include color pickers
st.sidebar.subheader("Color Pickers")
with st.sidebar.container(gap="small"):
    st.sidebar.color_picker("Default width", value="#3498db", key="sb_color_picker1")
    st.sidebar.color_picker(
        "Stretch width", value="#e74c3c", width="stretch", key="sb_color_picker2"
    )
    st.sidebar.color_picker(
        "200px width", value="#2ecc71", width=200, key="sb_color_picker3"
    )
    st.sidebar.color_picker(
        "Scale=2", value="#f1c40f", scale=2, width="stretch", key="sb_color_picker4"
    )

# Section 10: In a sidebar
st.sidebar.header("Sidebar Tests")
st.sidebar.subheader("Checkboxes")
with st.sidebar.container(gap="small"):
    st.sidebar.checkbox("Default width", key="sb_cb1")
    st.sidebar.checkbox("Stretch width", width="stretch", key="sb_cb2")
    st.sidebar.checkbox("200px width", width=200, key="sb_cb3")
    st.sidebar.checkbox("Scale=2", scale=2, width="stretch", key="sb_cb4")

st.sidebar.subheader("Toggles")
with st.sidebar.container(gap="small"):
    st.sidebar.toggle("Default width", key="sb_tg1")
    st.sidebar.toggle("Stretch width", width="stretch", key="sb_tg2")
    st.sidebar.toggle("200px width", width=200, key="sb_tg3")
    st.sidebar.toggle("Scale=2", scale=2, width="stretch", key="sb_tg4")

st.sidebar.subheader("Radio Buttons")
with st.sidebar.container(gap="small"):
    st.sidebar.radio("Default width", options=["Option 1", "Option 2"], key="sb_radio1")
    st.sidebar.radio(
        "Stretch width",
        options=["Option 1", "Option 2"],
        width="stretch",
        key="sb_radio2",
    )
    st.sidebar.radio(
        "200px width", options=["Option 1", "Option 2"], width=200, key="sb_radio3"
    )
    st.sidebar.radio(
        "Scale=2",
        options=["Option 1", "Option 2"],
        scale=2,
        width="stretch",
        key="sb_radio4",
    )
