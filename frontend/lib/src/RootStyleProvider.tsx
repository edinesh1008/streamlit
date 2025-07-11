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

import React, { ReactElement, useEffect } from "react"

import { BaseProvider } from "baseui"
import createCache from "@emotion/cache"
import {
  CacheProvider,
  ThemeProvider as EmotionThemeProvider,
  Global,
} from "@emotion/react"

import { globalStyles, ThemeConfig } from "./theme"

export interface RootStyleProviderProps {
  theme: ThemeConfig
  children: React.ReactNode
}

const nonce = document.currentScript?.nonce || ""
const cache = createCache({
  // The key field is required but only matters if there's more than one
  // emotion cache in use. This will probably never be true for us, so we just
  // set it arbitrarily.
  key: "st-emotion-cache",
  ...(nonce && { nonce }),
})

/**
 * React hook to detect the scrollbar width and set it as a CSS custom property (--scrollbar-width).
 */
const useScrollbarWidth = (): void => {
  useEffect(() => {
    const detectScrollbarWidth = () => {
      // Create a temporary div to measure scrollbar width
      const outer = document.createElement("div")

      outer.style.position = "absolute"
      outer.style.top = "-9999px"
      outer.style.left = "-9999px"
      outer.style.visibility = "hidden"
      outer.style.overflow = "scroll"
      outer.style.width = "100px"
      outer.style.height = "100px"
      outer.style.border = "none"
      outer.style.margin = "0"
      outer.style.padding = "0"

      document.body.appendChild(outer)

      const inner = document.createElement("div")
      inner.style.width = "100%"
      inner.style.height = "200px" // Force scrollbar
      outer.appendChild(inner)

      // Force reflow
      outer.offsetHeight

      // Calculate the scrollbar width
      // eslint-disable-next-line streamlit-custom/no-force-reflow-access -- Existing usage
      const calculatedWidth = outer.offsetWidth - inner.offsetWidth

      // Remove the temporary divs
      document.body.removeChild(outer)

      // Store the scrollbar width in a CSS custom property
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${calculatedWidth}px`
      )

      return calculatedWidth
    }

    // Check if layout is ready for measurement
    const isLayoutReady = () => {
      return (
        window.innerWidth > 0 &&
        window.innerHeight > 0 &&
        document.body.offsetWidth > 0
      )
    }

    // Wait for layout to be ready before detecting scrollbar width
    const runDetection = () => {
      if (isLayoutReady()) {
        detectScrollbarWidth()
      } else {
        const waitForLayout = () => {
          const checkLayout = () => {
            if (isLayoutReady()) {
              detectScrollbarWidth()
            } else {
              setTimeout(checkLayout, 100) // Check every 100ms
            }
          }
          checkLayout()
        }

        // Wait for window load first
        if (document.readyState !== "complete") {
          window.addEventListener("load", waitForLayout, { once: true })
        } else {
          waitForLayout()
        }
      }
    }

    // Start the detection process
    runDetection()

    // Listen for zoom changes and re-detect scrollbar width
    let lastDevicePixelRatio = window.devicePixelRatio
    let lastInnerWidth = window.innerWidth
    let lastInnerHeight = window.innerHeight

    const handleZoomChange = () => {
      const currentDevicePixelRatio = window.devicePixelRatio
      const currentInnerWidth = window.innerWidth
      const currentInnerHeight = window.innerHeight

      // Detect zoom by checking if devicePixelRatio changed
      // or if window dimensions changed significantly without corresponding outer window changes
      const devicePixelRatioChanged =
        Math.abs(currentDevicePixelRatio - lastDevicePixelRatio) > 0.1
      const dimensionsChanged =
        Math.abs(currentInnerWidth - lastInnerWidth) > 50 ||
        Math.abs(currentInnerHeight - lastInnerHeight) > 50

      if (devicePixelRatioChanged || dimensionsChanged) {
        // Update tracking variables
        lastDevicePixelRatio = currentDevicePixelRatio
        lastInnerWidth = currentInnerWidth
        lastInnerHeight = currentInnerHeight

        // Re-run detection after a short delay to let the zoom settle
        setTimeout(() => {
          if (isLayoutReady()) {
            detectScrollbarWidth()
          }
        }, 100)
      }
    }

    // Add resize listener for zoom detection
    window.addEventListener("resize", handleZoomChange)

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleZoomChange)
    }
  }, []) // Run this only once.
}

export function RootStyleProvider(
  props: RootStyleProviderProps
): ReactElement {
  const { children, theme } = props

  // Inject the --scrollbar-width variable into :root
  useScrollbarWidth()

  return (
    <BaseProvider
      theme={theme.basewebTheme}
      // This zIndex is required for modals/dialog. However,
      // it would be good to do some investigation
      // and find a better way to configure the zIndex
      // for the modals/dialogs.
      zIndex={theme.emotion.zIndices.popup}
    >
      <CacheProvider value={cache}>
        <EmotionThemeProvider theme={theme.emotion}>
          <Global styles={globalStyles} />
          {children}
        </EmotionThemeProvider>
      </CacheProvider>
    </BaseProvider>
  )
}
