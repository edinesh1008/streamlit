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

import json
import os

import pytest
from playwright.sync_api import Page, expect

from e2e_playwright.conftest import ImageCompareFunction, wait_for_app_loaded
from e2e_playwright.shared.app_utils import (
    expand_sidebar,
    expect_no_skeletons,
    reset_hovering,
)
from e2e_playwright.shared.theme_utils import apply_theme_via_window


@pytest.fixture(scope="module")
@pytest.mark.early
def configure_custom_chart_colors():
    """Configure custom chart theme colors."""
    os.environ["STREAMLIT_THEME_CHART_CATEGORICAL_COLORS"] = json.dumps(
        [
            "#7fc97f",
            "#beaed4",
            "#fdc086",
            "#ffff99",
            "#386cb0",
            "#f0027f",
            "#bf5b17",
            "#666666",
            "#7fc97f",
            "#beaed4",
        ]
    )
    os.environ["STREAMLIT_THEME_CHART_SEQUENTIAL_COLORS"] = json.dumps(
        [
            "#bad0e4",
            "#a8c2dd",
            "#9ab0d4",
            "#919cc9",
            "#8d85be",
            "#8b6db2",
            "#8a55a6",
            "#873c99",
            "#822287",
            "#6a00a8",
        ]
    )
    yield
    del os.environ["STREAMLIT_THEME_CHART_CATEGORICAL_COLORS"]
    del os.environ["STREAMLIT_THEME_CHART_SEQUENTIAL_COLORS"]


@pytest.mark.usefixtures("configure_custom_chart_colors")
def test_custom_chart_colors(app: Page, assert_snapshot: ImageCompareFunction):
    """Test that custom chart colors are correctly applied to charts."""
    # Set bigger viewport to better show the charts
    app.set_viewport_size({"width": 1280, "height": 1000})
    # Make sure that all elements are rendered and no skeletons are shown:
    expect_no_skeletons(app, timeout=25000)
    # Reset hovering to avoid flakiness from plotly toolbar
    reset_hovering(app)
    # Add some additional timeout to ensure that charts can load without
    # creating flakiness:
    app.wait_for_timeout(10000)

    assert_snapshot(app, name="custom_chart_colors", image_threshold=0.0003)


@pytest.mark.usefixtures("configure_custom_chart_colors")
def test_custom_chart_colors_sidebar(app: Page, assert_snapshot: ImageCompareFunction):
    """Test that custom chart colors are correctly applied to charts in sidebar."""
    # Set bigger viewport to better show the charts
    app.set_viewport_size({"width": 1280, "height": 1000})
    # Make sure that all elements are rendered and no skeletons are shown:
    expect_no_skeletons(app, timeout=25000)
    # Reset hovering to avoid flakiness from plotly toolbar
    reset_hovering(app)
    # Add some additional timeout to ensure that charts can load without
    # creating flakiness:
    app.wait_for_timeout(10000)

    expand_sidebar(app)
    sidebar_content = app.get_by_test_id("stSidebarContent")
    expect(sidebar_content).to_be_visible()
    assert_snapshot(sidebar_content, name="custom_chart_colors-sidebar")


def test_sequential_custom_colors_under_10(
    app: Page, assert_snapshot: ImageCompareFunction
):
    """Test that when less than 10 sequential custom colors are provided, they are repeated."""
    # Apply custom theme using window injection
    apply_theme_via_window(
        app,
        base="light",
        chartSequentialColors=[
            "#482575",
            "#414487",
            "#35608d",
            "#2a788e",
            "#21918d",
            "#22a884",
            "#43bf71",
            "#7ad151",
        ],
    )
    # Reload to apply the theme
    app.reload()
    # Set bigger viewport to better show the charts
    app.set_viewport_size({"width": 1280, "height": 1000})
    wait_for_app_loaded(app)

    # Make sure that all elements are rendered and no skeletons are shown:
    expect_no_skeletons(app, timeout=25000)
    # Reset hovering to avoid flakiness from plotly toolbar
    reset_hovering(app)
    # Add some additional timeout to ensure that charts can load without
    # creating flakiness:
    app.wait_for_timeout(10000)

    area_chart_sequential = app.get_by_test_id("stVegaLiteChart").nth(3)
    expect(area_chart_sequential).to_be_visible()
    assert_snapshot(
        area_chart_sequential, name="custom_chart_colors-sequential_under_10"
    )


def test_sequential_custom_colors_over_10(
    app: Page, assert_snapshot: ImageCompareFunction
):
    """Test that when 11 sequential custom colors are provided, only the first 10 are used."""
    # Apply custom theme using window injection
    apply_theme_via_window(
        app,
        base="light",
        chartSequentialColors=[
            "#482575",
            "#414487",
            "#35608d",
            "#2a788e",
            "#21918d",
            "#22a884",
            "#43bf71",
            "#7ad151",
            "#bcdf27",
            "#000000",
            "#7fc97f",
        ],
    )

    # Reload to apply the theme
    app.reload()
    # Set bigger viewport to better show the charts
    app.set_viewport_size({"width": 1280, "height": 1000})
    wait_for_app_loaded(app)

    # Make sure that all elements are rendered and no skeletons are shown:
    expect_no_skeletons(app, timeout=25000)
    # Reset hovering to avoid flakiness from plotly toolbar
    reset_hovering(app)
    # Add some additional timeout to ensure that charts can load without
    # creating flakiness:
    app.wait_for_timeout(10000)

    area_chart_sequential = app.get_by_test_id("stVegaLiteChart").nth(3)
    expect(area_chart_sequential).to_be_visible()
    assert_snapshot(
        area_chart_sequential, name="custom_chart_colors-sequential_over_10"
    )
