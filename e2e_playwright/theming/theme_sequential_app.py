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


import altair as alt
import numpy as np
import pandas as pd

import streamlit as st


def run_chart_tester_app():
    st.set_page_config(initial_sidebar_state="collapsed", layout="wide")

    st.header("Custom Themed :blue[App]")

    def page1():
        pass

    def page2():
        pass

    st.navigation(
        [
            st.Page(page1, title="Page 1", icon=":material/home:"),
            st.Page(page2, title="Page 2", icon=":material/settings:"),
        ]
    )

    col1, col2, col3 = st.columns(3)

    with col1:
        st.write("**st.area_chart**")
        stacked_data = []
        categories = [
            "Category A",
            "Category B",
            "Category C",
            "Category D",
            "Category E",
        ]
        time_points = np.arange(20)

        for i, category in enumerate(categories):
            for t in time_points:
                stacked_data.append(
                    {
                        "time": t,
                        "value": 5
                        + 3 * np.sin(t * 0.3 + i * 0.5)
                        + np.random.normal(0, 0.5),
                        "category": category,
                        "category_num": i,
                    }
                )

        st.area_chart(
            pd.DataFrame(stacked_data),
            x="time",
            y="value",
            color="category_num",
            use_container_width=True,
        )

        st.write("**st.bar_chart**")
        bar_data_numeric = pd.DataFrame(
            {
                "product": [
                    "Product A",
                    "Product B",
                    "Product C",
                    "Product D",
                    "Product E",
                ],
                "sales": [100, 150, 120, 180, 90],
                "priority_level": [
                    1,
                    2,
                    3,
                    4,
                    5,
                ],  # Integer sequence for sequential colors
            }
        )

        st.bar_chart(
            bar_data_numeric,
            x="product",
            y="sales",
            color="priority_level",
            use_container_width=True,
        )

    with col2:
        st.write("**st.line_chart**")
        time_series_data = []
        time_points = np.arange(25)

        # Create multiple time series with different numeric IDs
        for sensor_id in [1, 2, 3, 4, 5]:
            for t in time_points:
                time_series_data.append(
                    {
                        "time": t,
                        "temperature": 5 * np.sin(t * 0.2 + sensor_id * 0.5)
                        + np.random.normal(0, 0.3),
                        "sensor_id": sensor_id,  # Numeric IDs should trigger sequential colors
                        "sensor_priority": sensor_id * 0.5,  # Floating point priorities
                    }
                )

        st.line_chart(
            pd.DataFrame(time_series_data),
            x="time",
            y="temperature",
            color="sensor_id",
            use_container_width=True,
        )

        st.write("**st.scatter_chart**")
        np.random.seed(42)  # For reproducible results
        n_points = 100

        scatter_continuous = pd.DataFrame(
            {
                "x_pos": np.random.normal(0, 2, n_points),
                "y_pos": np.random.normal(0, 2, n_points),
                "temperature": np.linspace(-10, 40, n_points)
                + np.random.normal(0, 2, n_points),  # Continuous temperature
            }
        )

        st.scatter_chart(
            scatter_continuous,
            x="x_pos",
            y="y_pos",
            color="temperature",
            use_container_width=True,
        )

    with col3:
        st.write("**st.altair_chart**")
        # Create explicit sequential data for color mapping
        time_data = pd.DataFrame(
            {
                "time_step": np.arange(50),
                "value_x": np.cumsum(np.random.normal(0, 1, 50)),
                "value_y": np.cumsum(np.random.normal(0, 1, 50)),
                "intensity": np.arange(50),  # This will drive the sequential color
            }
        )

        altair_chart = (
            alt.Chart(time_data)
            .mark_circle(size=100)
            .encode(
                x=alt.X("value_x:Q", title="X Position"),
                y=alt.Y("value_y:Q", title="Y Position"),
                color=alt.Color(
                    "intensity:Q", title="Time Step", legend=alt.Legend(orient="bottom")
                ),  # No explicit scheme - should use theme
            )
        )
        st.altair_chart(altair_chart, use_container_width=True)

        st.write("**st.vega_lite_chart**")
        # Create heatmap-style sequential data
        time_points = np.arange(30)
        heatmap_data = pd.DataFrame(
            {
                "time": time_points,
                "temperature": 20 + 15 * np.sin(time_points * 0.2) + time_points * 0.3,
                "day_of_month": (time_points % 30) + 1,
            }
        )

        vega_spec = {
            "mark": {"type": "rect", "tooltip": True},
            "encoding": {
                "x": {"field": "day_of_month", "type": "ordinal", "title": "Day"},
                "y": {"field": "time", "type": "ordinal", "title": "Time Period"},
                "color": {
                    "field": "temperature",
                    "type": "quantitative",
                    "title": "Temperature",
                    "legend": {"orient": "bottom"},
                },
            },
            "width": 400,
            "height": 350,
        }
        st.vega_lite_chart(heatmap_data, vega_spec, use_container_width=True)
