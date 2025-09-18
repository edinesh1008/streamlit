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
            const shouldShow = !!data?.showText
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
            width: 100%;
            height: 100%;
            background-color: var(--st-red-background-color);
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


st.header("Custom Components x Advanced Layouts")
st.write(
    """
    This interactive app demonstrates how Streamlit Custom Components (CCv2) behave with
    Advanced Layouts (width/height, flex containers, and content sizing).

    Use the controls in each section to explore how layout parameters influence
    a simple custom component.
    """
)

# Controls to dynamically change the component size using Advanced Layouts API
st.subheader("1) Basic sizing: width and height on the component")
st.caption(
    "Set width/height via the component API. The component fills its container; "
    "the container size is determined by these controls."
)

st.markdown(
    """
    What this custom component renders:

    - A single `.box` element with a theme-aware background and outline.
    - Optionally, a `.content` node inside `.box` that holds your text. This
      represents the component's intrinsic content.
    """
)
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

basic_text: str = "This component has some content to demonstrate sizing."


box(key="box_basic", width=width, height=height, show_text=True, text=basic_text)


# Container demos
st.divider()

st.subheader("2) Content-driven height")
st.caption(
    "Toggle inner content to observe how height='content' adapts. With no content, "
    "content-height is minimal; with more content, the container grows. For fixed px "
    "height, overflow may scroll."
)

st.markdown(
    """
    With no inner content, the component's intrinsic size can be minimal. For
    example, `width="content"` with no content results in an effective width of ~0.
    That's expected: content-based sizing reflects what's inside. Use
    `width="stretch"` or a fixed pixel width when you want it to fill.
    """
)

# Dedicated content-sizing demo
cd_col1, cd_col2 = st.columns(2)
with cd_col1:
    cd_width_mode = st.selectbox(
        "Content demo: width",
        options=["content", "stretch", "px"],
        index=0,
    )
    cd_width: int | str
    if cd_width_mode == "px":
        cd_width = st.number_input(
            "Content demo: width (px)", min_value=1, max_value=1200, value=200
        )
    else:
        cd_width = cd_width_mode
with cd_col2:
    cd_height_mode = st.selectbox(
        "Content demo: height",
        options=["content", "px", "stretch"],
        index=0,
    )
    cd_height: int | str
    if cd_height_mode == "px":
        cd_height = st.number_input(
            "Content demo: height (px)", min_value=60, max_value=800, value=160
        )
    else:
        cd_height = cd_height_mode

cd_show_text = st.checkbox("Content demo: show text", value=True)
cd_text = st.text_area(
    "Content demo: text",
    value="Try adding or removing content to see sizing change.",
)

box(
    key="box_content_demo",
    width=cd_width,
    height=cd_height,
    show_text=cd_show_text,
    text=cd_text,
)
st.divider()

st.subheader("3) Containers and flex properties")
st.caption(
    "Place multiple components alongside other elements and adjust container flex "
    "settings (direction, alignment, gap) to see reflow."
)

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
    st.caption("Other content before boxes (inside container)")
    st.button("A button", key="demo_cta")

    # A few boxes with different sizing to observe layout interactions
    # Reference: content toggles in section 2 influence behavior below
    box(
        key="c_box1",
        width="content",
        height="content",
        show_text=cd_show_text,
        text=cd_text,
    )
    box(key="c_box2", width=150, height=150, show_text=False, text=cd_text)
    box(key="c_box3", width="stretch", height=120, show_text=True, text="Short text")
    box(
        key="c_box4",
        width=220,
        height="content",
        show_text=True,
        text=(cd_text[:120] + "…"),
    )

    st.caption("Other content after boxes (inside container)")


st.divider()

st.subheader("4) Columns grid demo")
st.caption(
    "Columns are horizontal flex containers. Try different sizes to see wrapping "
    "and alignment."
)
col_a, col_b, col_c = st.columns(3, gap="medium")
with col_a:
    st.write("Column A")
    box(key="col_box_a1", width="content", height="content", show_text=True, text="A")
    box(key="col_box_a2", width=160, height=120, show_text=False, text="")
with col_b:
    st.write("Column B")
    box(key="col_box_b1", width="stretch", height=100, show_text=True, text="B short")
with col_c:
    st.write("Column C")
    box(
        key="col_box_c1",
        width=220,
        height="content",
        show_text=True,
        text="C has more text to showcase content height",
    )

st.divider()

st.subheader("5) Edge cases")
explanation = {
    "No content + width=content": (
        "width=content, height=content, no inner content. Intrinsic size is ~0; "
        "use stretch or px when you need fill."
    ),
    "Unbreakable long word": (
        "A single unbreakable word increases intrinsic width; with width=content, the container "
        "may grow. Use wrapping strategies if needed."
    ),
    "Fixed height overflow": (
        "Fixed pixel height with more content than space. Container scrolls."
    ),
    "Stretch in fixed-height parent": (
        "Child set to height=stretch inside a fixed-height container expands to available space."
    ),
}

case = st.selectbox("Choose an edge case", list(explanation.keys()))
st.caption(explanation[case])

if case == "No content + width=content":
    box(
        key="edge_no_content",
        width="content",
        height="content",
        show_text=False,
        text="",
    )
elif case == "Unbreakable long word":
    long_word = "A" * 120
    box(
        key="edge_long_word",
        width="content",
        height="content",
        show_text=True,
        text=long_word,
    )
elif case == "Fixed height overflow":
    overflow_text = "Many lines of text to demonstrate vertical overflow.\n" * 10
    box(
        key="edge_fixed_h",
        width=260,
        height=120,
        show_text=True,
        text=overflow_text,
    )
elif case == "Stretch in fixed-height parent":
    with st.container(height=200, border=True):
        st.caption("Parent container is 200px tall; child is height=stretch")
        box(
            key="edge_stretch_parent",
            width="stretch",
            height="stretch",
            show_text=True,
            text="Child stretches to fill parent height.",
        )
