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

import math
from typing import Any, cast

import numpy as np
import pandas as pd
import pydeck as pdk

import streamlit as st

# Empty chart.

st.pydeck_chart()

# Basic chart.

np.random.seed(12345)

df = pd.DataFrame(
    cast("Any", np.random.randn(1000, 2) / [50, 50]) + [37.76, -122.4],
    columns=["lat", "lon"],
)

st.pydeck_chart(
    pdk.Deck(
        map_style="mapbox://styles/mapbox/light-v9",
        initial_view_state=pdk.ViewState(
            latitude=37.76,
            longitude=-122.4,
            zoom=11,
            pitch=50,
        ),
        layers=[
            pdk.Layer(
                "HexagonLayer",
                data=df,
                get_position="[lon, lat]",
                radius=200,
                elevation_scale=4,
                elevation_range=[0, 1000],
                pickable=True,
                extruded=True,
            ),
            pdk.Layer(
                "ScatterplotLayer",
                data=df,
                get_position="[lon, lat]",
                get_color="[200, 30, 0, 160]",
                get_radius=200,
            ),
        ],
    )
)

# Chart w/ invalid JSON - issue #5799.
data = pd.DataFrame({"lng": [-109.037673], "lat": [36.994672], "weight": [math.nan]})
layer = pdk.Layer(
    "ScatterplotLayer", data=data, get_position=["lng", "lat"], radius_min_pixels=4
)
deck = pdk.Deck(
    layers=[layer],
    map_style=pdk.map_styles.CARTO_LIGHT,
    tooltip={"text": "weight: {weight}"},
)
st.pydeck_chart(deck, use_container_width=True)

H3_HEX_DATA = [
    {"hex": "88283082b9fffff", "count": 10},
    {"hex": "88283082d7fffff", "count": 50},
    {"hex": "88283082a9fffff", "count": 100},
]
df = pd.DataFrame(H3_HEX_DATA)

st.pydeck_chart(
    pdk.Deck(
        map_style="mapbox://styles/mapbox/outdoors-v12",
        tooltip={"text": "Count: {count}"},
        initial_view_state=pdk.ViewState(
            latitude=37.7749295, longitude=-122.4194155, zoom=12, bearing=0, pitch=30
        ),
        layers=[
            pdk.Layer(
                "H3HexagonLayer",
                df,
                pickable=True,
                stroked=True,
                filled=True,
                get_hexagon="hex",
                get_fill_color="[0, 255, 0]",
                get_line_color=[255, 255, 255],
                line_width_min_pixels=2,
            ),
        ],
    )
)

st.pydeck_chart(
    pdk.Deck(
        initial_view_state=pdk.ViewState(
            latitude=37.76,
            longitude=-122.4,
            zoom=11,
            pitch=50,
        ),
        layers=[
            pdk.Layer(
                "HexagonLayer",
                data=df,
                get_position="[lon, lat]",
                radius=200,
                elevation_scale=4,
                elevation_range=[0, 1000],
                pickable=True,
                extruded=True,
            ),
            pdk.Layer(
                "ScatterplotLayer",
                data=df,
                get_position="[lon, lat]",
                get_color="[200, 30, 0, 160]",
                get_radius=200,
            ),
        ],
    )
)

st.pydeck_chart(
    pdk.Deck(
        map_style="mapbox://styles/mapbox/outdoors-v12",
        initial_view_state=pdk.ViewState(
            latitude=37.7749295, longitude=-122.4194155, zoom=12, bearing=0, pitch=30
        ),
        layers=[
            pdk.Layer(
                "H3HexagonLayer",
                df,
                pickable=True,
                stroked=True,
                filled=True,
                get_hexagon="hex",
                get_fill_color="[0, 255, 0]",
                get_line_color=[255, 255, 255],
                line_width_min_pixels=2,
            ),
        ],
    ),
    width=200,
    height=250,
    use_container_width=False,
)


# Simple GlobeView with static data
# @see https://github.com/streamlit/streamlit/issues/9933


def get_cities_data():
    return pd.DataFrame(
        {
            "name": ["New York", "London", "Tokyo"],
            "latitude": [40.7128, 51.5074, 35.6762],
            "longitude": [-74.0060, -0.1278, 139.6503],
            "population": [8.4, 8.9, 13.9],
        }
    )


def get_continents_geojson():
    # A very basic continental outline without relying on external requests for
    # speed and determinism.
    CONTINENTS = [
        {
            "coordinates": [[-130, 30], [-60, 30], [-60, 70], [-130, 70], [-130, 30]],
        },
        {
            "coordinates": [[-80, -60], [-30, -60], [-30, 10], [-80, 10], [-80, -60]],
        },
        {
            "coordinates": [[-10, 35], [40, 35], [40, 70], [-10, 70], [-10, 35]],
        },
        {
            "coordinates": [[-20, -40], [50, -40], [50, 35], [-20, 35], [-20, -40]],
        },
        {
            "coordinates": [[40, 0], [145, 0], [145, 70], [40, 70], [40, 0]],
        },
        {
            "coordinates": [[110, -45], [155, -45], [155, -10], [110, -10], [110, -45]],
        },
    ]

    # Convert to GeoJSON format
    continent_features = []
    for continent in CONTINENTS:
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[lon, lat] for lon, lat in continent["coordinates"]]],
            },
        }
        continent_features.append(feature)

    return {"type": "FeatureCollection", "features": continent_features}


st.pydeck_chart(
    pdk.Deck(
        views=[pdk.View(type="_GlobeView")],
        initial_view_state=pdk.ViewState(latitude=20, longitude=0, zoom=1, min_zoom=1),
        layers=[
            pdk.Layer(
                "GeoJsonLayer",
                data=get_continents_geojson(),
                stroked=True,
                filled=True,
                extruded=False,
                get_fill_color=[200, 200, 200, 200],  # Light gray with transparency
                get_line_color=[100, 100, 100],
                get_line_width=2,
                pickable=True,
            ),
            pdk.Layer(
                "ColumnLayer",
                data=get_cities_data(),
                get_position=["longitude", "latitude"],
                get_elevation="population",  # Height based on population
                elevation_scale=100000,
                radius=100000,  # Larger radius to be visible on globe
                get_fill_color=[255, 140, 0],  # Orange color for visibility
                pickable=True,
                auto_highlight=True,
            ),
        ],
        map_provider=None,  # type: ignore
        parameters={"cull": True},  # Required for opaque globe
    )
)
