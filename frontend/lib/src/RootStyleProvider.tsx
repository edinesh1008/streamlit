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
      console.log("🔍 [SCROLLBAR DEBUG] Starting scrollbar width detection")
      console.log(
        "🔍 [SCROLLBAR DEBUG] Document ready state:",
        document.readyState
      )
      console.log("🔍 [SCROLLBAR DEBUG] User agent:", navigator.userAgent)
      console.log("🔍 [SCROLLBAR DEBUG] Window dimensions:", {
        width: window.innerWidth,
        height: window.innerHeight,
      })

      // Alternative detection methods for cloud environments
      const alternatives = [
        // Method 1: Use document.body as container
        () => {
          console.log(
            "🔍 [SCROLLBAR DEBUG] Trying Method 1: document.body container"
          )
          const container = document.body
          console.log(
            "🔍 [SCROLLBAR DEBUG] Method 1 - Container dimensions:",
            {
              offsetWidth: container.offsetWidth,
              offsetHeight: container.offsetHeight,
              clientWidth: container.clientWidth,
              clientHeight: container.clientHeight,
            }
          )

          const outer = document.createElement("div")

          outer.style.position = "absolute"
          outer.style.top = "-9999px" // Move far off-screen instead of hidden
          outer.style.left = "-9999px"
          outer.style.overflow = "scroll"
          outer.style.width = "100px"
          outer.style.height = "100px"
          outer.style.border = "none"
          outer.style.margin = "0"
          outer.style.padding = "0"

          container.appendChild(outer)
          console.log(
            "🔍 [SCROLLBAR DEBUG] Method 1 - After appending outer:",
            {
              inDOM: container.contains(outer),
              offsetWidth: outer.offsetWidth,
              offsetHeight: outer.offsetHeight,
              clientWidth: outer.clientWidth,
              clientHeight: outer.clientHeight,
            }
          )

          const inner = document.createElement("div")
          inner.style.width = "100%"
          inner.style.height = "200px" // Force scrollbar
          outer.appendChild(inner)

          // Force reflow
          outer.offsetHeight
          console.log(
            "🔍 [SCROLLBAR DEBUG] Method 1 - After adding inner and reflow:",
            {
              outerOffsetWidth: outer.offsetWidth,
              outerClientWidth: outer.clientWidth,
              outerScrollWidth: outer.scrollWidth,
              innerOffsetWidth: inner.offsetWidth,
              innerClientWidth: inner.clientWidth,
              innerScrollWidth: inner.scrollWidth,
              hasScrollbar: outer.scrollHeight > outer.clientHeight,
            }
          )

          const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
          console.log("🔍 [SCROLLBAR DEBUG] Method 1 result:", scrollbarWidth)

          container.removeChild(outer)
          return scrollbarWidth
        },

        // Method 2: Use CSS to measure viewport
        () => {
          console.log(
            "🔍 [SCROLLBAR DEBUG] Trying Method 2: CSS viewport measurement"
          )
          const outer = document.createElement("div")

          outer.style.position = "fixed"
          outer.style.top = "0"
          outer.style.left = "0"
          outer.style.width = "100vw"
          outer.style.height = "100vh"
          outer.style.overflow = "scroll"
          outer.style.visibility = "hidden"
          outer.style.pointerEvents = "none"

          document.body.appendChild(outer)
          console.log(
            "🔍 [SCROLLBAR DEBUG] Method 2 - After appending outer:",
            {
              inDOM: document.body.contains(outer),
              offsetWidth: outer.offsetWidth,
              offsetHeight: outer.offsetHeight,
              clientWidth: outer.clientWidth,
              clientHeight: outer.clientHeight,
              scrollWidth: outer.scrollWidth,
              scrollHeight: outer.scrollHeight,
            }
          )

          const inner = document.createElement("div")
          inner.style.width = "100%"
          inner.style.height = "calc(100% + 1px)" // Force scrollbar
          outer.appendChild(inner)

          outer.offsetHeight // Force reflow
          console.log(
            "🔍 [SCROLLBAR DEBUG] Method 2 - After adding inner and reflow:",
            {
              outerOffsetWidth: outer.offsetWidth,
              outerClientWidth: outer.clientWidth,
              outerScrollWidth: outer.scrollWidth,
              outerScrollHeight: outer.scrollHeight,
              innerOffsetWidth: inner.offsetWidth,
              innerClientWidth: inner.clientWidth,
              innerScrollWidth: inner.scrollWidth,
              hasVerticalScrollbar: outer.scrollHeight > outer.clientHeight,
              hasHorizontalScrollbar: outer.scrollWidth > outer.clientWidth,
            }
          )

          const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
          console.log("🔍 [SCROLLBAR DEBUG] Method 2 result:", scrollbarWidth)

          document.body.removeChild(outer)
          return scrollbarWidth
        },

        // Method 3: Try different positioning strategies
        () => {
          console.log(
            "🔍 [SCROLLBAR DEBUG] Trying Method 3: Alternative positioning"
          )
          const outer = document.createElement("div")

          outer.style.position = "fixed"
          outer.style.top = "-1000px"
          outer.style.left = "-1000px"
          outer.style.width = "200px"
          outer.style.height = "200px"
          outer.style.overflow = "auto" // Try auto instead of scroll
          outer.style.visibility = "visible" // Try visible instead of hidden
          outer.style.opacity = "0" // Make invisible but still rendered

          document.body.appendChild(outer)

          const inner = document.createElement("div")
          inner.style.width = "100%"
          inner.style.height = "300px" // Force scrollbar
          outer.appendChild(inner)

          outer.offsetHeight // Force reflow
          console.log("🔍 [SCROLLBAR DEBUG] Method 3 - Dimensions:", {
            outerOffsetWidth: outer.offsetWidth,
            outerClientWidth: outer.clientWidth,
            innerOffsetWidth: inner.offsetWidth,
            hasScrollbar: outer.scrollHeight > outer.clientHeight,
          })

          const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
          console.log("🔍 [SCROLLBAR DEBUG] Method 3 result:", scrollbarWidth)

          document.body.removeChild(outer)
          return scrollbarWidth
        },

        // Method 4: Use a visible element with specific styling
        () => {
          console.log(
            "🔍 [SCROLLBAR DEBUG] Trying Method 4: Visible element with opacity"
          )
          const outer = document.createElement("div")

          outer.style.position = "absolute"
          outer.style.top = "0"
          outer.style.left = "0"
          outer.style.width = "100px"
          outer.style.height = "100px"
          outer.style.overflow = "scroll"
          outer.style.opacity = "0.01" // Almost invisible but still rendered
          outer.style.pointerEvents = "none"
          outer.style.zIndex = "-1"

          document.body.appendChild(outer)

          const inner = document.createElement("div")
          inner.style.width = "100%"
          inner.style.height = "150px" // Force scrollbar
          outer.appendChild(inner)

          outer.offsetHeight // Force reflow
          console.log("🔍 [SCROLLBAR DEBUG] Method 4 - Dimensions:", {
            outerOffsetWidth: outer.offsetWidth,
            outerClientWidth: outer.clientWidth,
            innerOffsetWidth: inner.offsetWidth,
            hasScrollbar: outer.scrollHeight > outer.clientHeight,
          })

          const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
          console.log("🔍 [SCROLLBAR DEBUG] Method 4 result:", scrollbarWidth)

          document.body.removeChild(outer)
          return scrollbarWidth
        },
      ]

      // Try each method until we get a non-zero result
      let calculatedWidth = 0
      let methodUsed = 0

      for (let i = 0; i < alternatives.length; i++) {
        try {
          calculatedWidth = alternatives[i]()
          if (calculatedWidth > 0) {
            methodUsed = i + 1
            console.log(
              `🔍 [SCROLLBAR DEBUG] Method ${methodUsed} successful with width:`,
              calculatedWidth
            )
            break
          }
        } catch (error) {
          console.log(`🔍 [SCROLLBAR DEBUG] Method ${i + 1} failed:`, error)
        }
      }

      // Fallback to original method if alternatives fail
      if (calculatedWidth === 0) {
        console.log(
          "🔍 [SCROLLBAR DEBUG] All alternative methods failed, using original method"
        )

        // Create a temporary div to measure scrollbar width
        const outer = document.createElement("div")
        console.log("🔍 [SCROLLBAR DEBUG] Created outer div element")

        outer.style.position = "absolute"
        outer.style.visibility = "hidden"
        outer.style.overflow = "scroll" // Triggers scrollbar
        outer.style.width = "50px" // Give it a fixed size to ensure overflow
        outer.style.height = "50px" // Give it a fixed size to ensure overflow
        console.log("🔍 [SCROLLBAR DEBUG] Applied styles to outer div:", {
          position: outer.style.position,
          visibility: outer.style.visibility,
          overflow: outer.style.overflow,
          width: outer.style.width,
          height: outer.style.height,
        })

        document.body.appendChild(outer)
        console.log("🔍 [SCROLLBAR DEBUG] Appended outer div to document body")
        console.log(
          "🔍 [SCROLLBAR DEBUG] Outer div in DOM:",
          document.body.contains(outer)
        )

        // Create an inner div to measure content width
        const inner = document.createElement("div")
        inner.style.width = "100%" // Inner div takes full width of outer's content area
        console.log(
          "🔍 [SCROLLBAR DEBUG] Created inner div with width:",
          inner.style.width
        )

        outer.appendChild(inner)
        console.log("🔍 [SCROLLBAR DEBUG] Appended inner div to outer div")

        // Force a reflow to ensure styles are applied
        outer.offsetHeight // Force reflow
        console.log("🔍 [SCROLLBAR DEBUG] Forced reflow on outer div")

        // Log dimensions before calculation
        console.log("🔍 [SCROLLBAR DEBUG] Outer div dimensions:", {
          offsetWidth: outer.offsetWidth,
          clientWidth: outer.clientWidth,
          scrollWidth: outer.scrollWidth,
          offsetHeight: outer.offsetHeight,
          clientHeight: outer.clientHeight,
          scrollHeight: outer.scrollHeight,
        })

        console.log("🔍 [SCROLLBAR DEBUG] Inner div dimensions:", {
          offsetWidth: inner.offsetWidth,
          clientWidth: inner.clientWidth,
          scrollWidth: inner.scrollWidth,
          offsetHeight: inner.offsetHeight,
          clientHeight: inner.clientHeight,
          scrollHeight: inner.scrollHeight,
        })

        // Calculate the scrollbar width
        // eslint-disable-next-line streamlit-custom/no-force-reflow-access -- Existing usage
        calculatedWidth = outer.offsetWidth - inner.offsetWidth
        console.log(
          "🔍 [SCROLLBAR DEBUG] Original method calculated scrollbar width:",
          calculatedWidth
        )
        console.log("🔍 [SCROLLBAR DEBUG] Calculation breakdown:", {
          outerOffsetWidth: outer.offsetWidth,
          innerOffsetWidth: inner.offsetWidth,
          difference: calculatedWidth,
        })

        // Check if scrollbars are actually visible
        const hasVerticalScrollbar = outer.scrollHeight > outer.clientHeight
        const hasHorizontalScrollbar = outer.scrollWidth > outer.clientWidth
        console.log("🔍 [SCROLLBAR DEBUG] Scrollbar visibility:", {
          hasVerticalScrollbar,
          hasHorizontalScrollbar,
          scrollHeight: outer.scrollHeight,
          clientHeight: outer.clientHeight,
          scrollWidth: outer.scrollWidth,
          clientWidth: outer.clientWidth,
        })

        // Remove the temporary divs
        outer.parentNode?.removeChild(outer)
        console.log("🔍 [SCROLLBAR DEBUG] Removed temporary divs from DOM")
      }

      // Final logging
      console.log(
        "🔍 [SCROLLBAR DEBUG] Final calculated width:",
        calculatedWidth
      )
      console.log(
        "🔍 [SCROLLBAR DEBUG] Method used:",
        methodUsed || "original"
      )

      // Store the scrollbar width in a CSS custom property(variable)
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${calculatedWidth}px`
      )
      console.log(
        "🔍 [SCROLLBAR DEBUG] Set CSS custom property --scrollbar-width to:",
        `${calculatedWidth}px`
      )

      // Verify the CSS property was set
      const setProperty =
        document.documentElement.style.getPropertyValue("--scrollbar-width")
      console.log(
        "🔍 [SCROLLBAR DEBUG] Verified CSS property value:",
        setProperty
      )

      // Additional environment checks
      console.log("🔍 [SCROLLBAR DEBUG] Environment checks:", {
        isCloudEnvironment: window.location.hostname !== "localhost",
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        documentElement: !!document.documentElement,
        bodyElement: !!document.body,
        computedStyle:
          typeof window.getComputedStyle === "function"
            ? "available"
            : "not available",
      })

      // Check system scrollbar preferences
      const mediaQueryList = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      )
      console.log("🔍 [SCROLLBAR DEBUG] System preferences:", {
        prefersReducedMotion: mediaQueryList.matches,
        devicePixelRatio: window.devicePixelRatio,
      })

      console.log("🔍 [SCROLLBAR DEBUG] Scrollbar width detection completed")
    }

    // Deterministic approach: wait for proper window state
    const runDetection = () => {
      // Check if window has proper dimensions
      if (window.innerWidth === 0 || window.innerHeight === 0) {
        console.log(
          "🔍 [SCROLLBAR DEBUG] Window dimensions are 0, waiting for proper sizing..."
        )

        // Wait for window load event (most reliable)
        if (document.readyState !== "complete") {
          console.log(
            "🔍 [SCROLLBAR DEBUG] Document not complete, waiting for window load..."
          )
          window.addEventListener(
            "load",
            () => {
              console.log(
                "🔍 [SCROLLBAR DEBUG] Window load event fired, retrying detection"
              )
              // Use requestAnimationFrame to ensure layout is complete
              requestAnimationFrame(() => {
                detectScrollbarWidth()
              })
            },
            { once: true }
          )
          return
        }

        // If document is complete but dimensions are still 0, wait for resize
        console.log(
          "🔍 [SCROLLBAR DEBUG] Document complete but dimensions 0, waiting for resize..."
        )
        const resizeHandler = () => {
          if (window.innerWidth > 0 && window.innerHeight > 0) {
            console.log(
              "🔍 [SCROLLBAR DEBUG] Window resized with proper dimensions, running detection"
            )
            window.removeEventListener("resize", resizeHandler)
            detectScrollbarWidth()
          }
        }
        window.addEventListener("resize", resizeHandler)

        // Fallback timeout in case resize never fires
        setTimeout(() => {
          console.log(
            "🔍 [SCROLLBAR DEBUG] Fallback timeout reached, forcing detection"
          )
          window.removeEventListener("resize", resizeHandler)
          detectScrollbarWidth()
        }, 2000)
      } else {
        // Window has proper dimensions, run detection immediately
        detectScrollbarWidth()
      }
    }

    // Start the detection process
    runDetection()
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
