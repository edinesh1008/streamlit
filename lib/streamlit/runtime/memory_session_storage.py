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

import threading
from typing import Callable

from cachetools import TTLCache

from streamlit.logger import get_logger
from streamlit.runtime.session_manager import SessionInfo, SessionStorage

_LOGGER = get_logger(__name__)


class CleanupTTLCache:
    """TTL cache that calls cleanup callbacks when items expire.

    This implementation solves the memory leak by detecting when items
    are removed by TTLCache and calling cleanup callbacks for them.
    The key insight is to store items separately so we can access them
    even after TTLCache has removed them.
    """

    def __init__(
        self,
        maxsize: int,
        ttl: float,
        cleanup_callback: Callable[[str, SessionInfo], None] | None = None,
    ):
        self._cache: TTLCache[str, SessionInfo] = TTLCache(maxsize=maxsize, ttl=ttl)
        self._cleanup_callback = cleanup_callback
        self._lock = threading.RLock()
        # Store original items so we can clean them up even after TTLCache removes them
        self._stored_items: dict[str, SessionInfo] = {}

    def get(self, key: str) -> SessionInfo | None:
        with self._lock:
            # First check if item exists in TTLCache
            result = self._cache.get(key)

            # If item is gone from cache but we had it stored, it expired - clean it up
            if result is None and key in self._stored_items:
                if self._cleanup_callback:
                    try:
                        self._cleanup_callback(key, self._stored_items[key])
                        _LOGGER.debug("Cleaned up expired session: %s", key)
                    except Exception as e:
                        _LOGGER.warning(
                            "Error during session cleanup for %s: %s", key, e
                        )

                # Remove from our storage
                del self._stored_items[key]

            return result

    def __setitem__(self, key: str, value: SessionInfo) -> None:
        with self._lock:
            self._cache[key] = value
            self._stored_items[key] = value

    def __delitem__(self, key: str) -> None:
        with self._lock:
            # Call cleanup callback before removing
            if key in self._stored_items and self._cleanup_callback:
                try:
                    self._cleanup_callback(key, self._stored_items[key])
                    _LOGGER.debug("Cleaned up explicitly deleted session: %s", key)
                except Exception as e:
                    _LOGGER.warning("Error during session cleanup for %s: %s", key, e)

            # Remove from both caches
            if key in self._cache:
                del self._cache[key]
            if key in self._stored_items:
                del self._stored_items[key]

    def __contains__(self, key: str) -> bool:
        with self._lock:
            # This will trigger cleanup via get() if item expired
            return self.get(key) is not None

    def values(self) -> list[SessionInfo]:
        with self._lock:
            # Check all stored items to trigger cleanup of any that expired
            keys_to_check = list(self._stored_items.keys())
            for key in keys_to_check:
                self.get(key)  # This will clean up if expired

            # Return remaining values
            return list(self._cache.values())


class MemorySessionStorage(SessionStorage):
    """A SessionStorage that stores sessions in memory with proper TTL cleanup.

    This fixes the memory leak issue by ensuring that when sessions expire
    from the TTL cache, their shutdown() method is called to properly clean
    up session state and other resources.

    At most maxsize sessions are stored with a TTL of ttl seconds. When sessions
    expire or are evicted, their shutdown() method is called to prevent memory leaks.
    """

    # NOTE: The defaults for maxsize and ttl are chosen arbitrarily for now. These
    # numbers are reasonable as the main problems we're trying to solve at the moment are
    # caused by transient disconnects that are usually just short network blips. In the
    # future, we may want to increase both to support use cases such as saving state for
    # much longer periods of time. For example, we may want session state to persist if
    # a user closes their laptop lid and comes back to an app hours later.
    def __init__(
        self,
        maxsize: int = 128,
        ttl_seconds: int = 2 * 60,  # 2 minutes
    ) -> None:
        """Instantiate a new MemorySessionStorage with cleanup callbacks.

        Parameters
        ----------
        maxsize
            The maximum number of sessions we allow to be stored in this
            MemorySessionStorage. If an entry needs to be removed because we have
            exceeded this number, either
            - an expired entry is removed, or
            - the least recently used entry is removed (if no entries have expired).

        ttl_seconds
            The time in seconds for an entry added to a MemorySessionStorage to live.
            After this amount of time has passed for a given entry, it becomes
            inaccessible and will be removed. IMPORTANTLY: The session's shutdown()
            method will be called to properly clean up resources.
        """

        self._cache = CleanupTTLCache(
            maxsize=maxsize,
            ttl=ttl_seconds,
            cleanup_callback=self._cleanup_expired_session,
        )

        _LOGGER.debug(
            "MemorySessionStorage initialized with TTL cleanup (maxsize=%s, ttl=%ss)",
            maxsize,
            ttl_seconds,
        )

    def _cleanup_expired_session(
        self, session_id: str, session_info: SessionInfo
    ) -> None:
        """Called when a session expires from the cache.

        This is the critical fix - we call shutdown() to properly clean up
        session state, uploaded files, and other resources.
        """
        _LOGGER.debug("Cleaning up expired session: %s", session_id)
        try:
            # THIS IS THE FIX - call shutdown to clear session state and resources
            session_info.session.shutdown()
            _LOGGER.debug("Successfully cleaned up session: %s", session_id)
        except Exception as e:
            _LOGGER.warning("Error shutting down session %s: %s", session_id, e)

    def get(self, session_id: str) -> SessionInfo | None:
        return self._cache.get(session_id)

    def save(self, session_info: SessionInfo) -> None:
        self._cache[session_info.session.id] = session_info

    def delete(self, session_id: str) -> None:
        if session_id in self._cache:
            del self._cache[session_id]

    def list(self) -> list[SessionInfo]:
        return self._cache.values()
