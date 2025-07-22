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

"""
E2E tests for query parameter widget functionality.

These tests verify:
1. Query param widgets hydrate initial values from URL parameters
2. Query param widgets update URL when values change
3. Regular widgets work normally (no regression)
4. URL parameters are preserved/managed correctly
"""

from __future__ import annotations

import pytest
from playwright.sync_api import Page, expect


def test_query_param_widgets_initial_load_without_params(app: Page):
    """Test that query param widgets use default values when no URL params provided."""
    # Check that query param widgets show default values
    expect(app.get_by_test_id("stTextInput").first.locator("input")).to_have_value(
        "default_text"
    )
    expect(app.get_by_test_id("stNumberInput").first.locator("input")).to_have_value(
        "42.00"
    )
    expect(app.get_by_test_id("stCheckbox").first.locator("input")).not_to_be_checked()
    expect(app.get_by_test_id("stSelectbox").first).to_contain_text("option1")

    # Check that regular widgets also show their default values
    expect(app.get_by_test_id("stTextInput").nth(1).locator("input")).to_have_value(
        "regular_text"
    )
    expect(app.get_by_test_id("stNumberInput").nth(1).locator("input")).to_have_value(
        "100.00"
    )
    expect(app.get_by_test_id("stCheckbox").nth(1).locator("input")).to_be_checked()
    expect(app.get_by_test_id("stSelectbox").nth(1)).to_contain_text("choice2")


def test_query_param_widgets_populate_url_on_load(app: Page):
    """Test that query param widgets populate the URL with their values on initial load."""
    # Wait for app to load
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()

    # Give time for widgets to mount and register
    app.wait_for_timeout(1000)

    # Check that URL contains all query param widget values
    current_url = app.url
    assert "text_param=default_text" in current_url
    assert "number_param=42" in current_url
    assert "checkbox_param=false" in current_url
    assert "selectbox_param=option1" in current_url

    # Verify regular widget values are NOT in the URL
    assert "text_regular" not in current_url
    assert "number_regular" not in current_url
    assert "checkbox_regular" not in current_url
    assert "selectbox_regular" not in current_url


# Test data for query parameter hydration
hydration_test_params = [
    {
        "text_param": "hydrated_text",
        "number_param": "99.50",  # Match actual display format
        "checkbox_param": "true",
        "selectbox_param": "option2",
    },
    {
        "text_param": "another_value",
        "number_param": "0.00",  # Match actual display format
        "checkbox_param": "false",
        "selectbox_param": "option3",
    },
]


@pytest.mark.parametrize("app_with_query_params", hydration_test_params, indirect=True)
def test_query_param_widgets_hydration(
    app_with_query_params: tuple[Page, dict[str, str]],
):
    """Test that query param widgets hydrate initial values from URL parameters."""
    page, params = app_with_query_params

    # Wait for app to load
    expect(page.get_by_test_id("stTextInput").first).to_be_visible()

    # Verify query param widgets are hydrated with URL parameter values
    expect(page.get_by_test_id("stTextInput").first.locator("input")).to_have_value(
        params["text_param"]
    )
    expect(page.get_by_test_id("stNumberInput").first.locator("input")).to_have_value(
        params["number_param"]
    )

    checkbox = page.get_by_test_id("stCheckbox").first.locator("input")
    if params["checkbox_param"] == "true":
        expect(checkbox).to_be_checked()
    else:
        expect(checkbox).not_to_be_checked()

    expect(page.get_by_test_id("stSelectbox").first).to_contain_text(
        params["selectbox_param"]
    )

    # Verify regular widgets still use their default values (not affected by URL params)
    expect(page.get_by_test_id("stTextInput").nth(1).locator("input")).to_have_value(
        "regular_text"
    )
    expect(page.get_by_test_id("stNumberInput").nth(1).locator("input")).to_have_value(
        "100.00"
    )
    expect(page.get_by_test_id("stCheckbox").nth(1).locator("input")).to_be_checked()
    expect(page.get_by_test_id("stSelectbox").nth(1)).to_contain_text("choice2")


def test_query_param_widgets_url_updates(app: Page):
    """Test that changing query param widget values updates the URL."""
    # Wait for app to load
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()

    # Change text input value
    text_input = app.get_by_test_id("stTextInput").first.locator("input")
    text_input.clear()
    text_input.fill("new_text_value")
    text_input.blur()

    # Wait for app to update and check URL contains the new parameter
    app.wait_for_timeout(1000)  # Allow time for URL update
    assert "text_param=new_text_value" in app.url

    # Change number input value
    number_input = app.get_by_test_id("stNumberInput").first.locator("input")
    number_input.clear()
    number_input.fill("123.45")
    number_input.blur()

    app.wait_for_timeout(1000)
    assert "number_param=123.45" in app.url

    # Change checkbox value
    checkbox_element = app.get_by_test_id("stCheckbox").first
    checkbox_element.scroll_into_view_if_needed()
    checkbox_input = checkbox_element.locator("input")
    if not checkbox_input.is_checked():
        checkbox_element.locator("label").first.click()

    app.wait_for_timeout(1000)
    assert "checkbox_param=true" in app.url


def test_regular_widgets_no_url_updates(app: Page):
    """Test that regular widgets do not update the URL when changed."""
    # Wait for app to load
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()

    # Change regular text input value
    text_input = app.get_by_test_id("stTextInput").nth(1).locator("input")
    text_input.clear()
    text_input.fill("changed_regular_text")
    text_input.blur()

    app.wait_for_timeout(1000)

    # Change regular number input value
    number_input = app.get_by_test_id("stNumberInput").nth(1).locator("input")
    number_input.clear()
    number_input.fill("999")
    number_input.blur()

    app.wait_for_timeout(1000)

    # Change regular checkbox value
    checkbox_element = app.get_by_test_id("stCheckbox").nth(1)
    checkbox_element.scroll_into_view_if_needed()
    checkbox_input = checkbox_element.locator("input")
    if checkbox_input.is_checked():
        checkbox_element.locator("label").first.click()

    app.wait_for_timeout(1000)

    # URL should not contain parameters for regular widgets
    current_url = app.url
    assert "text_regular" not in current_url
    assert "number_regular" not in current_url
    assert "checkbox_regular" not in current_url
    assert "selectbox_regular" not in current_url


def test_mixed_query_params_preserved(app: Page):
    """Test that existing non-widget query parameters are preserved when widget values change."""
    # Navigate to app with some existing query parameters
    base_url = app.url.split("?")[0]  # Get base URL without query params
    app.goto(base_url + "?existing_param=keep_me&another=value")

    # Wait for app to load
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()

    # Change a query param widget value
    text_input = app.get_by_test_id("stTextInput").first.locator("input")
    text_input.clear()
    text_input.fill("test_preserve")
    text_input.blur()

    app.wait_for_timeout(1000)

    # URL should contain both the new widget param and the existing params
    current_url = app.url
    assert "text_param=test_preserve" in current_url
    assert "existing_param=keep_me" in current_url
    assert "another=value" in current_url


def test_selectbox_query_param_updates(app: Page):
    """Test selectbox query param widget URL updates."""
    # Wait for app to load
    expect(app.get_by_test_id("stSelectbox").first).to_be_visible()

    # Click on the first selectbox (query param one) to open dropdown
    selectbox = app.get_by_test_id("stSelectbox").first
    selectbox.click()

    # Wait for dropdown to appear and select "option3"
    option = app.get_by_text("option3")
    expect(option).to_be_visible()
    option.click()

    app.wait_for_timeout(1000)

    # URL should contain the new selectbox parameter
    assert "selectbox_param=option3" in app.url

    # Verify the selectbox shows the selected value
    expect(selectbox).to_contain_text("option3")


def test_multiple_query_param_changes(app: Page):
    """Test that multiple query param widget changes are all reflected in URL."""
    # Wait for app to load
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()

    # Change multiple widget values
    text_input = app.get_by_test_id("stTextInput").first.locator("input")
    text_input.clear()
    text_input.fill("multi_test")
    text_input.blur()

    number_input = app.get_by_test_id("stNumberInput").first.locator("input")
    number_input.clear()
    number_input.fill("777")
    number_input.blur()

    checkbox_element = app.get_by_test_id("stCheckbox").first
    checkbox_element.scroll_into_view_if_needed()
    checkbox_input = checkbox_element.locator("input")
    if not checkbox_input.is_checked():
        checkbox_element.locator("label").first.click()

    app.wait_for_timeout(1500)  # Allow time for all updates

    # URL should contain all the updated parameters
    current_url = app.url
    assert "text_param=multi_test" in current_url
    assert "number_param=777" in current_url
    assert "checkbox_param=true" in current_url


def test_widget_state_displayed_correctly(app: Page):
    """Test that the app correctly displays current widget states in JSON format."""
    # Wait for app to load
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()

    # Change some values
    text_input = app.get_by_test_id("stTextInput").first.locator("input")
    text_input.clear()
    text_input.fill("json_test")
    text_input.blur()

    checkbox_element = app.get_by_test_id("stCheckbox").first
    checkbox_element.scroll_into_view_if_needed()
    checkbox_input = checkbox_element.locator("input")
    if not checkbox_input.is_checked():
        checkbox_element.locator("label").first.click()

    app.wait_for_timeout(1000)

    # Check that the JSON display shows the updated values
    json_elements = app.get_by_test_id("stJson")
    expect(json_elements.first).to_contain_text("json_test")
    expect(json_elements.first).to_contain_text("true")  # checkbox value


def test_manual_navigation_hydration(app: Page):
    """Test hydration behavior that mimics manual navigation."""
    # First, wait for the app to load completely
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()

    # Navigate to a new URL with query parameters (similar to manual testing)
    base_url = app.url.split("?")[0]  # Get base URL without query params
    app.goto(
        base_url
        + "?text_param=manual_test&number_param=123.45&checkbox_param=true&selectbox_param=option3"
    )

    # Wait for the app to reload and settle
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()
    app.wait_for_timeout(2000)  # Give more time for hydration

    # Debug: Check actual values
    text_input = app.get_by_test_id("stTextInput").first.locator("input")
    number_input = app.get_by_test_id("stNumberInput").first.locator("input")
    checkbox = app.get_by_test_id("stCheckbox").first.locator("input")
    selectbox = app.get_by_test_id("stSelectbox").first

    # This should pass if hydration is working for manual navigation
    expect(text_input).to_have_value("manual_test")
    expect(number_input).to_have_value("123.45")
    expect(checkbox).to_be_checked()
    expect(selectbox).to_contain_text("option3")


def test_specific_widget_hydration_issue(app: Page):
    """Test that specifically checks if only number inputs are hydrating correctly."""
    # First, wait for the app to load completely
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()

    # Navigate to a new URL with query parameters that should all hydrate
    base_url = app.url.split("?")[0]  # Get base URL without query params
    app.goto(
        base_url
        + "?text_param=failing_text&number_param=999.99&checkbox_param=false&selectbox_param=option2"
    )

    # Wait for the app to reload and settle
    expect(app.get_by_test_id("stTextInput").first).to_be_visible()
    app.wait_for_timeout(2000)  # Give more time for hydration

    # Debug: Check actual values
    text_input = app.get_by_test_id("stTextInput").first.locator("input")
    number_input = app.get_by_test_id("stNumberInput").first.locator("input")
    checkbox = app.get_by_test_id("stCheckbox").first.locator("input")
    selectbox = app.get_by_test_id("stSelectbox").first

    # Check that all widgets are properly hydrated
    expect(number_input).to_have_value("999.99")
    # This should make the test fail if the issue exists
    expect(text_input).to_have_value("failing_text")
    expect(checkbox).not_to_be_checked()
    expect(selectbox).to_contain_text("option2")
