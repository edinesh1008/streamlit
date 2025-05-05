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

import numpy as np
import pandas as pd

import streamlit as st

cells = st.grid(outer_border=True, inner_borders=True, num_cells=6, num_cols=2)

cells[0][0].write("Hello")
cells[0][1].write("World")
cells[1][0].write("Hello")
cells[1][1].write("World")
cells[2][0].write("Hello")
cells[2][1].write("World")

cells_two = st.grid(outer_border=True, inner_borders=True, num_cells=4, num_cols=2)

with cells_two[0][0]:
    st.write("Hello")
    st.write("Hello")
with cells_two[0][1]:
    st.write("World")
    st.write("World")
with cells_two[1][0]:
    st.write("Hello")
    st.write("Hello")
with cells_two[1][1]:
    st.write("World")
    st.write("World")

st.header("Grid with Images")
# Create a 2x2 grid with images
image_grid = st.grid(num_cells=4, num_cols=2, outer_border=True)

# Add different images to each cell
image_grid[0][0].image("https://static.streamlit.io/examples/cat.jpg", caption="Cat")
image_grid[0][1].image("https://static.streamlit.io/examples/dog.jpg", caption="Dog")
image_grid[1][0].image("https://static.streamlit.io/examples/owl.jpg", caption="Owl")
image_grid[1][1].image(
    "https://static.streamlit.io/examples/balloon.jpg", caption="Balloon"
)

st.header("Grid with Charts")
# Create a 2x2 grid with different chart types
chart_grid = st.grid(num_cells=4, num_cols=2, outer_border=True, inner_borders=True)

# Sample data
chart_data = pd.DataFrame(np.random.randn(20, 3), columns=["A", "B", "C"])
bar_data = pd.DataFrame({"Category": ["A", "B", "C", "D"], "Values": [3, 7, 2, 9]})

# Add charts to each cell
with chart_grid[0][0]:
    st.subheader("Line Chart")
    st.line_chart(chart_data)

with chart_grid[0][1]:
    st.subheader("Bar Chart")
    st.bar_chart(bar_data.set_index("Category"))

with chart_grid[1][0]:
    st.subheader("Area Chart")
    st.area_chart(chart_data)

with chart_grid[1][1]:
    st.subheader("Scatter Chart")
    st.scatter_chart(chart_data)
