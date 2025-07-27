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

"""Tests for Windows signal handling fix."""

from __future__ import annotations

import asyncio
import signal
import unittest
from unittest.mock import Mock, patch

from streamlit.web.bootstrap import _set_up_signal_handler, _windows_signal_wakeup_task


class TestWindowsSignalHandling(unittest.IsolatedAsyncioTestCase):
    """Test Windows-specific signal handling improvements."""

    async def test_windows_signal_wakeup_task(self):
        """Test that the Windows signal wakeup task runs and can be cancelled."""
        task = asyncio.create_task(_windows_signal_wakeup_task())

        # Let it run for a short period to verify it's working
        await asyncio.sleep(0.1)

        # Cancel the task
        task.cancel()

        # Verify it can be cancelled cleanly
        try:
            await task
            self.fail("Expected asyncio.CancelledError to be raised")
        except asyncio.CancelledError:
            pass  # This is expected

    def test_signal_handler_setup(self):
        """Test that signal handlers are set up correctly."""
        # Create a mock server
        mock_server = Mock()
        mock_server.stop = Mock()

        # Set up signal handlers
        _set_up_signal_handler(mock_server)

        # Verify that signal handlers were installed by checking they're not default
        current_sigint_handler = signal.signal(
            signal.SIGINT, signal.default_int_handler
        )
        assert current_sigint_handler != signal.default_int_handler

        # Restore the original handler for cleanup
        signal.signal(signal.SIGINT, current_sigint_handler)

    async def test_windows_signal_handling_integration(self):
        """Test the integration of Windows signal handling with a mock server."""
        mock_server = Mock()
        mock_server.stop = Mock()

        # Mock the server.stopped Future to complete when stop() is called
        stopped_future = asyncio.Future()
        mock_server.stopped = stopped_future

        def stop_server():
            if not stopped_future.done():
                stopped_future.set_result(None)

        mock_server.stop.side_effect = stop_server

        # Simulate the Windows signal handling scenario
        with patch("streamlit.web.bootstrap.sys.platform", "win32"):
            wakeup_task = asyncio.create_task(_windows_signal_wakeup_task())

            # Let the wakeup task run briefly
            await asyncio.sleep(0.1)

            # Simulate a signal by calling stop
            mock_server.stop()

            # Wait for the server to stop
            await mock_server.stopped

            # Clean up the wakeup task
            wakeup_task.cancel()
            try:
                await wakeup_task
            except asyncio.CancelledError:
                pass

        # Verify stop was called
        mock_server.stop.assert_called_once()

    def test_signal_handler_calls_server_stop(self):
        """Test that the signal handler correctly calls server.stop()."""
        mock_server = Mock()
        mock_server.stop = Mock()

        # Set up signal handlers
        _set_up_signal_handler(mock_server)

        # Get the current SIGINT handler
        current_handler = signal.signal(signal.SIGINT, signal.default_int_handler)

        # Call the signal handler directly (simulating a signal)
        current_handler(signal.SIGINT, None)

        # Verify server.stop() was called
        mock_server.stop.assert_called_once()

        # Restore default handler
        signal.signal(signal.SIGINT, signal.default_int_handler)
