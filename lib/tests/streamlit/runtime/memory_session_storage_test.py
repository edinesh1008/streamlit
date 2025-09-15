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

import time
import unittest
from unittest.mock import MagicMock, Mock

from cachetools import TTLCache

from streamlit.runtime.memory_session_storage import MemorySessionStorage


class MemorySessionStorageTest(unittest.TestCase):
    """Test MemorySessionStorage.

    These tests are intentionally extremely simple to ensure that we don't just end up
    testing cachetools.TTLCache. We try to just verify that we've wrapped TTLCache
    correctly, and in particular we avoid testing cache expiry functionality.
    """

    def test_uses_ttl_cache(self):
        """Verify that the backing cache of a MemorySessionStorage is a TTLCache.

        We do this because we're intentionally avoiding writing tests around cache
        expiry because the cachetools library should do this for us. In the case
        that the backing cache for a MemorySessionStorage ever changes, we'll likely be
        responsible for adding our own tests.
        """
        store = MemorySessionStorage()
        assert isinstance(store._cache._cache, TTLCache)

    def test_get(self):
        """Test basic get functionality."""
        store = MemorySessionStorage()
        store._cache["foo"] = "bar"

        assert store.get("foo") == "bar"
        assert store.get("baz") is None

    def test_save(self):
        """Test basic save functionality."""
        store = MemorySessionStorage()
        session_info = MagicMock()
        session_info.session.id = "foo"

        store.save(session_info)
        assert store.get("foo") == session_info

    def test_delete(self):
        """Test basic delete functionality."""
        store = MemorySessionStorage()
        store._cache["foo"] = "bar"

        store.delete("foo")
        assert store.get("foo") is None

    def test_list(self):
        """Test basic list functionality."""
        store = MemorySessionStorage()
        store._cache["foo"] = "bar"
        store._cache["baz"] = "qux"

        assert store.list() == ["bar", "qux"]

    def test_ttl_cleanup_calls_shutdown(self):
        """Test that expired sessions have shutdown() called."""
        # Create mock session that tracks shutdown calls
        mock_session = Mock()
        mock_session.id = "test_session"
        shutdown_called = False

        def track_shutdown():
            nonlocal shutdown_called
            shutdown_called = True

        mock_session.shutdown = track_shutdown

        session_info = Mock()
        session_info.session = mock_session

        # Create storage with very short TTL for testing
        storage = MemorySessionStorage(maxsize=10, ttl_seconds=1)

        # Store session
        storage.save(session_info)

        # Verify session is stored and shutdown not yet called
        assert storage.get("test_session") is not None
        assert shutdown_called is False

        # Wait for TTL expiry
        time.sleep(1.2)

        # Access to trigger cleanup
        result = storage.get("test_session")

        # Verify cleanup
        assert result is None
        assert shutdown_called is True

    def test_explicit_delete_calls_shutdown(self):
        """Test that explicitly deleted sessions have shutdown() called."""
        mock_session = Mock()
        mock_session.id = "test_session"
        shutdown_called = False

        def track_shutdown():
            nonlocal shutdown_called
            shutdown_called = True

        mock_session.shutdown = track_shutdown

        session_info = Mock()
        session_info.session = mock_session

        storage = MemorySessionStorage()
        storage.save(session_info)

        # Verify session is stored
        assert storage.get("test_session") is not None
        assert shutdown_called is False

        # Explicitly delete
        storage.delete("test_session")

        # Verify shutdown was called and session removed
        assert shutdown_called is True
        assert storage.get("test_session") is None

    def test_multiple_sessions_cleanup(self):
        """Test cleanup of multiple expired sessions."""
        storage = MemorySessionStorage(maxsize=10, ttl_seconds=1)

        # Create multiple mock sessions
        sessions = []
        for i in range(3):
            mock_session = Mock()
            mock_session.id = f"session_{i}"

            # Each session needs its own shutdown tracking
            shutdown_called_tracker = {"called": False}

            def make_tracker(tracker):
                def tracker_func():
                    tracker["called"] = True

                return tracker_func

            mock_session.shutdown = make_tracker(shutdown_called_tracker)

            session_info = Mock()
            session_info.session = mock_session

            sessions.append((mock_session, session_info, shutdown_called_tracker))
            storage.save(session_info)

        # Verify all sessions are stored
        for mock_session, _, tracker in sessions:
            assert storage.get(mock_session.id) is not None
            assert tracker["called"] is False

        # Wait for expiry
        time.sleep(1.2)

        # Trigger cleanup by accessing storage
        remaining = storage.list()
        assert len(remaining) == 0

    def test_cleanup_exception_handling(self):
        """Test that exceptions in cleanup callbacks don't break the system."""
        mock_session = Mock()
        mock_session.id = "exception_session"

        def failing_shutdown():
            raise Exception("Simulated shutdown failure")

        mock_session.shutdown = failing_shutdown

        session_info = Mock()
        session_info.session = mock_session

        storage = MemorySessionStorage(maxsize=5, ttl_seconds=1)
        storage.save(session_info)

        # Wait for TTL expiry
        time.sleep(1.2)

        # This should not crash despite the exception
        result = storage.get("exception_session")

        # Session should be removed despite exception
        assert result is None

    def test_concurrent_storage_operations(self):
        """Test that storage maintains consistency under concurrent operations."""
        storage = MemorySessionStorage(maxsize=5, ttl_seconds=2)

        # Create sessions with staggered timing
        sessions = []
        for i in range(3):
            mock_session = Mock()
            mock_session.id = f"concurrent_session_{i}"
            mock_session.shutdown = Mock()

            session_info = Mock()
            session_info.session = mock_session

            sessions.append((mock_session, session_info))
            storage.save(session_info)

            # Stagger creation times
            time.sleep(0.3)

        # Check initial state
        initial_count = len(storage.list())
        assert initial_count == 3

        # Wait for partial expiry
        time.sleep(1.0)
        mid_count = len(storage.list())

        # Wait for full expiry
        time.sleep(2.0)
        final_count = len(storage.list())

        # Verify logical state transitions
        assert initial_count >= mid_count
        assert mid_count >= final_count
        assert final_count == 0
