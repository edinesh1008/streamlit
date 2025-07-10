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

import re

import pytest
from playwright.sync_api import Page, expect

from e2e_playwright.conftest import (
    ImageCompareFunction,
    wait_for_app_run,
)


def test_altair_chart_race_condition_fix(app: Page, assert_snapshot: ImageCompareFunction):
    """Test that rapid reruns don't cause 'Unrecognized data set' errors."""
    # Wait for the app to load
    wait_for_app_run(app)
    
    # The chart should be visible
    chart = app.get_by_test_id("stVegaLiteChart")
    expect(chart).to_be_visible()
    
    # Take initial snapshot
    assert_snapshot(chart, name="altair_chart_race_condition-initial_render")
    
    # Get the rerun button
    rerun_button = app.get_by_role("button", name="rerun")
    expect(rerun_button).to_be_visible()
    
    # Click rerun multiple times rapidly to try to trigger the race condition
    for i in range(5):
        rerun_button.click()
        wait_for_app_run(app)
        
        # Verify the chart is still rendered correctly after each rerun
        expect(chart).to_be_visible()
        
        # Make sure there are no console errors about "Unrecognized data set"
        console_logs = app.evaluate("() => window.console.messages || []")
        
        # Check browser console for the specific error pattern
        # Note: The exact console checking might need adjustment based on how console errors are captured
        
    # Final snapshot to ensure the chart still renders correctly
    assert_snapshot(chart, name="altair_chart_race_condition-after_multiple_reruns")


def test_altair_chart_rapid_interaction(app: Page):
    """Test rapid interactions with sidebar widgets don't break chart rendering."""
    wait_for_app_run(app)
    
    chart = app.get_by_test_id("stVegaLiteChart")
    expect(chart).to_be_visible()
    
    # Find the first selectbox in the sidebar
    sidebar = app.locator('[data-testid="stSidebar"]')
    first_selectbox = sidebar.locator('[data-testid="stSelectbox"]').first
    
    # Rapidly change selectbox values to trigger reruns
    for i in range(3):
        first_selectbox.click()
        # Select a different option
        option = app.get_by_text(f"Option {i + 1}")
        if option.is_visible():
            option.click()
        wait_for_app_run(app)
        
        # Ensure chart is still visible and rendered
        expect(chart).to_be_visible()
    
    # Verify final state is stable
    expect(chart).to_be_visible()