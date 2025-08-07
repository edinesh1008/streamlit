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

from playwright.sync_api import FilePayload, Page, expect

from e2e_playwright.conftest import wait_for_app_run


def test_disabled_file_uploader_prevents_file_deletion(app: Page):
    """Test that disabled file uploader prevents users from deleting files."""
    
    # First, upload a file when the uploader is enabled
    file_name = "test_file.txt"
    file_content = b"test content"
    
    with app.expect_file_chooser() as fc_info:
        app.get_by_test_id("stFileUploaderDropzone").first.click()
    
    file_chooser = fc_info.value
    file_chooser.set_files(
        files=[
            FilePayload(name=file_name, mimeType="text/plain", buffer=file_content)
        ]
    )
    wait_for_app_run(app)
    
    # Verify the file was uploaded successfully
    expect(app.get_by_test_id("stFileUploaderFileName")).to_have_text(
        file_name, use_inner_text=True
    )
    expect(app.get_by_text("File uploaded: True")).to_be_visible()
    
    # Verify delete button is initially enabled (not disabled)
    delete_button = app.get_by_test_id("stFileUploaderDeleteBtn").first.locator("button")
    expect(delete_button).not_to_be_disabled()
    
    # Click the "Disable" button to disable the file uploader
    app.get_by_role("button", name="Disable").click()
    wait_for_app_run(app)
    
    # Verify the file is still there
    expect(app.get_by_test_id("stFileUploaderFileName")).to_have_text(
        file_name, use_inner_text=True
    )
    expect(app.get_by_text("File uploaded: True")).to_be_visible()
    
    # Now verify that the delete button is disabled
    delete_button = app.get_by_test_id("stFileUploaderDeleteBtn").first.locator("button")
    expect(delete_button).to_be_disabled()
    
    # Try to click the disabled delete button (should not work)
    initial_rerun_count_text = app.get_by_text("Script rerun").inner_text()
    initial_rerun_count = int(initial_rerun_count_text.split()[2])
    
    # Clicking a disabled button should not trigger any action
    delete_button.click(force=True)  # force=True needed for disabled buttons
    
    # Wait a bit and verify the file is still there and rerun count hasn't changed
    wait_for_app_run(app, wait_delay=500)
    expect(app.get_by_test_id("stFileUploaderFileName")).to_have_text(
        file_name, use_inner_text=True
    )
    expect(app.get_by_text("File uploaded: True")).to_be_visible()
    
    # The rerun count should be the same (meaning no rerun was triggered)
    current_rerun_count_text = app.get_by_text("Script rerun").inner_text()
    current_rerun_count = int(current_rerun_count_text.split()[2])
    expect(current_rerun_count).to_equal(initial_rerun_count)
    
    # Now re-enable the file uploader and verify delete button works again
    app.get_by_role("button", name="Enable").click()
    wait_for_app_run(app)
    
    # Verify delete button is enabled again
    delete_button = app.get_by_test_id("stFileUploaderDeleteBtn").first.locator("button")
    expect(delete_button).not_to_be_disabled()
    
    # Now clicking delete should work
    delete_button.click()
    wait_for_app_run(app)
    
    # Verify the file was deleted
    expect(app.get_by_text("File uploaded: False")).to_be_visible()