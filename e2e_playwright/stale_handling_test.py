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

from playwright.sync_api import Page, expect

from e2e_playwright.shared.app_utils import (
    click_checkbox,
    get_button,
)


def test_stale_element_handling(app: Page):
    """Test that elements don't incorrectly get marked as stale after reruns."""
    # Check the checkbox to enable the transient spinner functionality
    # This automatically waits for the app to run
    click_checkbox(app, "Transient Spinner")

    # Verify that there is a single "Some text" message
    expect(app.get_by_text("Some text")).to_have_count(1)

    # Click the rerun button but don't wait for rerun:
    button_element = get_button(app, "Rerun")
    button_element.click()

    expect(app.get_by_text("Has rerun")).to_be_visible()

    # The key test: verify that there is still a single "Some text" message
    # In the previous issue, two messages would be shown with one of them being stale.
    expect(app.get_by_text("Some text")).not_to_have_count(2)


def test_expected_stale_element(app: Page):
    """Test that elements are correctly marked as stale after reruns."""
    # Check the checkbox to enable the expected stale element test:
    click_checkbox(app, "Expected stale elemenet")

    expect(app.get_by_text("First text")).to_be_visible()
    expect(app.get_by_text("Second text")).to_be_visible()
    expect(app.get_by_text("Third text")).to_be_visible()

    # Click the rerun button but don't wait for rerun:
    button_element = get_button(app, "Rerun")
    button_element.click()

    expect(app.get_by_text("Clicked button")).to_be_visible()
    # The second text was overwritten by the Clicked button text.
    # This is expected behaviour currently.
    expect(app.get_by_text("Second text")).not_to_be_visible()
    # The third text should be marked as stale (atleast until the rerun has finished)
    expect(
        app.get_by_test_id("stElementContainer").filter(has_text="Third text")
    ).to_have_attribute("data-stale", "true")
