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

import os
import tempfile
import wave

from playwright.sync_api import FrameLocator, Locator, Page, Route, expect

from e2e_playwright.conftest import IframedPage, ImageCompareFunction, wait_for_app_run
from e2e_playwright.shared.app_utils import (
    check_top_level_class,
    click_button,
    click_form_button,
    get_element_by_key,
)


def test_audio_input_renders(app: Page):
    """Test that audio input renders correctly."""
    audio_inputs = app.get_by_test_id("stAudioInput")
    expect(audio_inputs).to_have_count(11)

    # Check first input with help tooltip
    first_input = audio_inputs.first
    expect(first_input).to_be_visible()
    first_input.hover()
    expect(app.get_by_test_id("stTooltipIcon")).to_be_visible()


def test_custom_css_class(app: Page):
    """Test that custom CSS class is applied via key."""
    audio_input = get_element_by_key(app, "the_audio_input")
    expect(audio_input).to_be_visible()
    check_top_level_class(app, "stAudioInput")


def test_audio_input_snapshots(app: Page, assert_snapshot: ImageCompareFunction):
    """Test visual snapshots for audio input states."""
    # Default state
    audio_input = app.get_by_test_id("stAudioInput").first
    assert_snapshot(audio_input, name="st_audio_input-default")

    # Disabled state
    disabled_input = app.get_by_test_id("stAudioInput").nth(3)
    assert_snapshot(disabled_input, name="st_audio_input-disabled")

    # Hidden label
    hidden_label = app.get_by_test_id("stAudioInput").nth(4)
    assert_snapshot(hidden_label, name="st_audio_input-hidden_label")


def test_audio_input_recording(app: Page):
    """Test basic recording functionality."""
    audio_input = app.get_by_test_id("stAudioInput").first
    record_button = audio_input.get_by_role("button", name="Record")

    # Start recording
    expect(record_button).to_be_visible()
    record_button.click()

    # Record for 1.5 seconds
    app.wait_for_timeout(1500)

    # Stop recording
    stop_button = audio_input.get_by_role("button", name="Stop recording")
    stop_button.click()
    wait_for_app_run(app)

    # Verify recording was created
    expect(app.get_by_text("Audio Input 1: True")).to_be_visible()
    expect(audio_input.get_by_test_id("stAudioInputWaveSurfer")).to_be_visible()

    # Verify WAV analysis
    expect(app.get_by_text("Channels:")).to_be_visible()
    expect(app.get_by_text("Frame Rate (Sample Rate):")).to_be_visible()
    expect(app.get_by_text("Duration:")).to_be_visible()


def test_audio_input_clear(app: Page):
    """Test clearing a recording."""
    audio_input = app.get_by_test_id("stAudioInput").first

    # Record something first
    audio_input.get_by_role("button", name="Record").click()
    app.wait_for_timeout(1000)
    audio_input.get_by_role("button", name="Stop recording").click()
    wait_for_app_run(app)

    # Clear the recording
    audio_input.hover()
    clear_button = audio_input.get_by_role("button", name="Clear recording")
    clear_button.click()
    wait_for_app_run(app)

    # Verify cleared
    expect(app.get_by_text("Audio Input 1: False")).to_be_visible()
    expect(audio_input.get_by_test_id("stAudioInputWaveSurfer")).not_to_be_visible()


def test_audio_input_callback(app: Page):
    """Test on_change callback."""
    expect(app.get_by_text("Audio Input Changed: False")).to_be_visible()

    audio_input = app.get_by_test_id("stAudioInput").nth(5)
    audio_input.get_by_role("button", name="Record").click()
    app.wait_for_timeout(1000)
    audio_input.get_by_role("button", name="Stop recording").click()
    wait_for_app_run(app)

    expect(app.get_by_text("Audio Input Changed: True")).to_be_visible()


def test_audio_input_remount(app: Page):
    """Test value persistence across remount."""
    expect(app.get_by_text("audio_input-after-sleep: False")).to_be_visible()

    audio_input = app.get_by_test_id("stAudioInput").nth(6)
    audio_input.scroll_into_view_if_needed()
    audio_input.get_by_role("button", name="Record").click()
    app.wait_for_timeout(1000)
    audio_input.get_by_role("button", name="Stop recording").click()
    wait_for_app_run(app)

    expect(app.get_by_text("audio_input-after-sleep: True")).to_be_visible()

    # Trigger remount
    click_button(app, "Create some elements to unmount component")
    wait_for_app_run(app)

    # Value should persist
    expect(app.get_by_text("audio_input-after-sleep: True")).to_be_visible()


def test_audio_input_form(app: Page):
    """Test audio input in forms."""
    form_input = app.get_by_test_id("stAudioInput").nth(1)

    # Record audio in form
    form_input.get_by_role("button", name="Record").click()
    app.wait_for_timeout(1000)
    form_input.get_by_role("button", name="Stop recording").click()

    # Verify recording is visible in form
    expect(form_input.get_by_test_id("stAudioInputWaveSurfer")).to_be_visible()

    # Submit form (should clear due to clear_on_submit=True)
    click_form_button(app, "Submit")
    wait_for_app_run(app)

    # Form should be cleared after submit
    expect(form_input.get_by_test_id("stAudioInputWaveSurfer")).not_to_be_visible()


def test_audio_input_fragment(app: Page):
    """Test audio input in fragments."""
    expect(app.get_by_text("Audio Input in Fragment: None")).to_be_visible()
    expect(app.get_by_text("Runs: 1")).to_be_visible()

    fragment_input = app.get_by_test_id("stAudioInput").nth(2)
    fragment_input.get_by_role("button", name="Record").click()
    app.wait_for_timeout(1000)
    fragment_input.get_by_role("button", name="Stop recording").click()
    wait_for_app_run(app)

    # Fragment should update without full rerun
    expect(app.get_by_text("Audio Input in Fragment:")).not_to_have_text("None")
    expect(app.get_by_text("Runs: 1")).to_be_visible()


def test_audio_input_disabled(app: Page):
    """Test disabled audio input."""
    disabled_input = app.get_by_test_id("stAudioInput").nth(3)
    record_button = disabled_input.get_by_role("button", name="Record")
    expect(record_button).to_be_disabled()


def _test_download_audio_file(app: Page, locator: FrameLocator | Locator):
    """Helper function to test audio file download in both regular and iframe contexts."""
    audio_input = locator.get_by_test_id("stAudioInput").nth(1)
    audio_input.get_by_role("button", name="Record").click()
    app.wait_for_timeout(1500)

    # Stop recording
    audio_input.get_by_role("button", name="Stop recording").click()

    # For iframe context, we can't use wait_for_app_run, so just wait
    if isinstance(locator, FrameLocator):
        app.wait_for_timeout(2000)
    else:
        wait_for_app_run(app)

    with app.expect_download() as download_info:
        download_button = audio_input.get_by_role("button", name="Download as WAV")
        download_button.click()

    download = download_info.value
    file_name = download.suggested_filename

    assert file_name == "recording.wav"


def test_audio_input_file_download(app: Page):
    """Test that the audio input file can be downloaded."""
    app.context.grant_permissions(["microphone"])
    _test_download_audio_file(app, app.locator("body"))


def test_audio_input_file_download_in_iframe(iframed_app: IframedPage):
    """Test that the audio input file can be downloaded within an iframe."""
    page: Page = iframed_app.page
    page.context.grant_permissions(["microphone"])
    frame_locator: FrameLocator = iframed_app.open_app(None)
    _test_download_audio_file(page, frame_locator)


def test_audio_input_sample_rates(app: Page):
    """Test different sample rate configurations."""
    # Test 48 kHz recording
    high_quality_input = app.get_by_test_id("stAudioInput").nth(8)
    high_quality_input.scroll_into_view_if_needed()
    high_quality_input.get_by_role("button", name="Record").click()
    app.wait_for_timeout(2000)
    high_quality_input.get_by_role("button", name="Stop recording").click()
    wait_for_app_run(app)

    expect(app.get_by_text("48 kHz recorded")).to_be_visible()

    # Download and verify sample rate
    with app.expect_download() as download_info:
        high_quality_input.get_by_role("button", name="Download as WAV").click()

    download = download_info.value
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
        tmp_file_path = tmp_file.name
        download.save_as(tmp_file_path)

        with wave.open(tmp_file_path, "rb") as wav_file:
            assert wav_file.getframerate() == 48000

        os.unlink(tmp_file_path)


def test_audio_input_widths(app: Page, assert_snapshot: ImageCompareFunction):
    """Test width configurations."""
    # Width stretch
    width_stretch = app.get_by_test_id("stAudioInput").nth(10)
    width_stretch.scroll_into_view_if_needed()
    assert_snapshot(width_stretch, name="st_audio_input-width_stretch")

    # Fixed width
    width_fixed = app.get_by_test_id("stAudioInput").nth(11)
    width_fixed.scroll_into_view_if_needed()
    assert_snapshot(width_fixed, name="st_audio_input-width_300px")


def test_audio_input_error_state(app: Page):
    """Test error state handling."""
    audio_input = app.get_by_test_id("stAudioInput").first

    # Mock permission denied
    def handle_route(route: Route):
        if "getUserMedia" in str(route.request):
            route.abort("failed")
        else:
            route.continue_()

    app.route("**/*", handle_route)

    audio_input.get_by_role("button", name="Record").click()
    app.wait_for_timeout(1500)
    audio_input.get_by_role("button", name="Stop recording").click()

    expect(
        audio_input.get_by_text("An error has occurred, please try again.")
    ).to_be_visible()