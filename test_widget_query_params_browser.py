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
Browser test for query parameter widget binding using Playwright.
"""

import time
from urllib.parse import urlencode

from playwright.sync_api import sync_playwright


def test_query_param_widgets():
    """Test that widgets with ?-prefixed keys are hydrated from URL query params."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Build URL with query parameters
        base_url = "http://localhost:8501"
        query_params = {
            "name": "Alice",
            "age": "30",
            "subscribe": "true",
            "color": "blue",
        }
        url = f"{base_url}?{urlencode(query_params)}"

        print(f"Navigating to: {url}")
        page.goto(url)

        # Wait for the app to load
        page.wait_for_load_state("networkidle")
        time.sleep(3)  # Give widgets time to render

        # Check text input value
        name_input = page.locator('input[aria-label="Enter your name"]').first
        actual_name = name_input.input_value()
        print(f"Name input value: {actual_name}")
        assert actual_name == "Alice", f"Expected 'Alice', got '{actual_name}'"

        # Check number input value
        age_input = page.locator('input[aria-label="Enter your age"]').first
        actual_age = age_input.input_value()
        print(f"Age input value: {actual_age}")
        assert actual_age == "30", f"Expected '30', got '{actual_age}'"

        # Check checkbox state
        checkbox = page.locator('input[type="checkbox"]').first
        is_checked = checkbox.is_checked()
        print(f"Checkbox is checked: {is_checked}")
        assert is_checked is True, "Expected checkbox to be checked"

        # Check selectbox value
        selectbox_text = page.locator(
            '[data-testid="stSelectbox"] div[data-baseweb="select"] span'
        ).first.text_content()
        print(f"Selectbox value: {selectbox_text}")
        assert selectbox_text == "blue", f"Expected 'blue', got '{selectbox_text}'"

        print("\n✅ Widget hydration from URL query params works!")

        # Test URL update on widget change
        print("\nTesting URL update on widget change...")

        # Change the text input
        name_input.fill("Bob")
        name_input.press("Enter")
        time.sleep(1)

        # Check if URL was updated
        current_url = page.url
        print(f"URL after name change: {current_url}")
        assert "name=Bob" in current_url, "URL should contain name=Bob"

        # Change the number input
        age_input.fill("25")
        age_input.press("Enter")
        time.sleep(1)

        current_url = page.url
        print(f"URL after age change: {current_url}")
        assert "age=25" in current_url, "URL should contain age=25"

        print("\n✅ URL updates when widget values change!")

        browser.close()


if __name__ == "__main__":
    test_query_param_widgets()
