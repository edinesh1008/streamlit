/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef } from "react"

let renderCount = 0

export function StrictModeVerifier(): null {
  const isFirstRender = useRef(true)

  // In StrictMode, this effect will run twice on mount
  useEffect(() => {
    renderCount++

    // Only log on the very first render of the app
    if (isFirstRender.current) {
      isFirstRender.current = false

      // Log with a unique marker that we can grep for in CI logs
      // eslint-disable-next-line no-console
      console.log(
        `🔍 STRICT_MODE_VERIFICATION: Component rendered ${renderCount} time(s). ` +
          `StrictMode is ${renderCount > 1 ? "ACTIVE ✅" : "NOT ACTIVE ❌"}`
      )

      // Also add a data attribute to the DOM for e2e tests to check
      const marker = document.createElement("div")
      marker.setAttribute("data-testid", "strict-mode-marker")
      marker.setAttribute("data-strict-mode-active", String(renderCount > 1))
      marker.style.display = "none"
      document.body.appendChild(marker)
    }
  }, [])

  return null
}
