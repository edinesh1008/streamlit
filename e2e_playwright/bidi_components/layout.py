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

from typing import TYPE_CHECKING, Literal, cast

import streamlit as st

if TYPE_CHECKING:
    from streamlit.components.v2.bidi_component import BidiComponentResult


st.header("Layout CCv2 Component")

# Controls to dynamically change the component size using Advanced Layouts API
st.subheader("Controls")
col1, col2 = st.columns(2)
with col1:
    width_mode = st.selectbox("Width", options=["px", "stretch", "content"], index=1)
    width: int | str
    if width_mode == "px":
        width = st.number_input("Width (px)", min_value=1, max_value=2000, value=300)
    else:
        width = width_mode
with col2:
    height_mode = st.selectbox("Height", options=["px", "stretch", "content"], index=2)
    height: int | str
    if height_mode == "px":
        height = st.number_input("Height (px)", min_value=1, max_value=2000, value=200)
    else:
        height = height_mode

# Content controls to observe content-based sizing
show_text: bool = st.checkbox("Show text content", value=True)
text: str = st.text_area(
    "Text content",
    value="This is some content inside the box.\nToggle me to see content sizing.",
)


def box(
    *,
    key: str | None = None,
    width: int | str | None = None,
    height: int | str | None = None,
    show_text: bool = True,
    text: str = "",
) -> BidiComponentResult:
    component = st.components.v2.component(
        name="box",
        js="""
        export default function(component) {
            const { parentElement, data } = component

            // Reuse existing .box element if present to avoid duplicates
            let box = parentElement.querySelector('.box')
            if (!box) {
              box = document.createElement('div')
              box.classList.add('box')
              parentElement.appendChild(box)
            }

            // Toggle a content node to affect content-based sizing
            const shouldShow = !!(data && data.showText)
            let content = box.querySelector('.content')
            if (shouldShow) {
              if (!content) {
                content = document.createElement('div')
                content.classList.add('content')
                box.appendChild(content)
              }
              content.textContent = (data && typeof data.text === 'string') ? data.text : ''
            } else if (content) {
              content.remove()
            }

            return () => {
                parentElement.removeChild(box)
            }
        }
        """,
        css="""
        .box {
            background-color: var(--st-secondary-background-color);
            outline: 1px solid var(--st-border-color);
        }
        """,
    )

    return component(
        isolate_styles=True,
        key=key,
        width=width or "stretch",
        height=height or "content",
        data={
            "showText": show_text,
            "text": text,
        },
    )


box(key="box", width=width, height=height, show_text=show_text, text=text)


# Container demos
st.subheader("Container demos")

cont_col1, cont_col2 = st.columns(2)
with cont_col1:
    container_horizontal = st.checkbox("Horizontal container", value=True)
    horizontal_alignment: Literal["left", "center", "right", "distribute"] = cast(
        "Literal['left', 'center', 'right', 'distribute']",
        st.selectbox(
            "Horizontal alignment",
            ["left", "center", "right", "distribute"],
            index=0,
        ),
    )
    gap_choice = st.selectbox("Gap", ["small", "medium", "large", "none"], index=0)
    container_border = st.checkbox("Show border", value=True)
with cont_col2:
    vertical_alignment: Literal["top", "center", "bottom", "distribute"] = cast(
        "Literal['top', 'center', 'bottom', 'distribute']",
        st.selectbox(
            "Vertical alignment",
            ["top", "center", "bottom", "distribute"],
            index=0,
        ),
    )
    cont_width_mode = st.selectbox("Container width", ["px", "stretch"], index=1)
    container_width: int | Literal["stretch"]
    if cont_width_mode == "px":
        container_width = st.number_input(
            "Container width (px)", min_value=200, max_value=2000, value=800
        )
    else:
        container_width = "stretch"
    cont_height_mode = st.selectbox(
        "Container height", ["px", "content", "stretch"], index=1
    )
    container_height: int | Literal["content", "stretch"]
    if cont_height_mode == "px":
        container_height = st.number_input(
            "Container height (px)", min_value=100, max_value=1200, value=300
        )
    else:
        container_height = cast("Literal['content', 'stretch']", cont_height_mode)

gap_val: Literal["small", "medium", "large"] | None = (
    None
    if gap_choice == "none"
    else cast('Literal["small", "medium", "large"]', gap_choice)
)

with st.container(
    border=container_border,
    horizontal=container_horizontal,
    horizontal_alignment=horizontal_alignment,
    vertical_alignment=vertical_alignment,
    gap=gap_val,
    width=container_width,
    height=container_height,
):
    st.caption("Other content before boxes")
    st.button("A button", key="demo_cta")

    # A few boxes with different sizing to observe layout interactions
    box(key="c_box1", width="content", height="content", show_text=show_text, text=text)
    box(key="c_box2", width=150, height=150, show_text=False, text=text)
    box(key="c_box3", width="stretch", height=120, show_text=True, text="Short text")
    box(
        key="c_box4",
        width=220,
        height="content",
        show_text=True,
        text=(text[:120] + "…"),
    )

    st.caption("Other content after boxes")
