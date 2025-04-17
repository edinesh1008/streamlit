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
import React, { memo, ReactElement, useEffect, useRef, useState } from "react"

import { IFrame as IFrameProto } from "@streamlit/protobuf"
import { IframeSizer } from "@streamlit/utils"

import { isNullOrUndefined, notNullOrUndefined } from "~lib/util/utils"
import {
  DEFAULT_IFRAME_FEATURE_POLICY,
  DEFAULT_IFRAME_SANDBOX_POLICY,
} from "~lib/util/IFrameUtil"
import { assertNever } from "~lib/util/assertNever"

import { StyledIframe } from "./styled-components"

type IframeHeightMode = "content" | "pixels"

/**
 * Return a string property from an element. If the string is
 * null or empty, return undefined instead.
 */
function getNonEmptyString(
  value: string | null | undefined
): string | undefined {
  return isNullOrUndefined(value) || value === "" ? undefined : value
}

/**
 * Custom hook to manage the dynamic height of an iframe using IframeSizer.
 */
function useIframeHeight({
  srcDoc,
  initialHeight,
  iframeRef,
}: {
  srcDoc: string | undefined
  initialHeight: number
  iframeRef: React.RefObject<HTMLIFrameElement>
}): number | string | undefined {
  const [currentHeight, setCurrentHeight] = useState<number | string>(
    initialHeight
  )

  /**
   * -0.1 indicates "content"
   * @see #iframeV1Height
   */
  const iframeHeightMode: IframeHeightMode =
    parseFloat(initialHeight.toFixed(1)) === -0.1 ? "content" : "pixels"

  useEffect(() => {
    if (!srcDoc || iframeHeightMode === "pixels") {
      setCurrentHeight(initialHeight)
      return undefined
    }

    const iframeElement = iframeRef.current
    if (!iframeElement) {
      return undefined
    }

    let sizer: IframeSizer | undefined
    let stopWatching: (() => void) | undefined

    const handleLoad = (): void => {
      const contentBody = iframeElement.contentDocument?.body
      if (!contentBody) {
        // Cannot find body inside iframe
        return
      }

      sizer = new IframeSizer({
        setHeightCallback: (height: number) => {
          switch (iframeHeightMode) {
            case "content":
              // Set the state only if the height has actually changed
              // to avoid potential loops if the height setting itself causes a resize.
              setCurrentHeight(current =>
                current !== height ? height : current
              )
              break
            default:
              assertNever(iframeHeightMode)
          }
        },
      })

      // Start watching the iframe's body for size changes
      stopWatching = sizer.watchFrameHeight(contentBody)

      // Initial height check after setup
      sizer.setFrameHeight(undefined, contentBody)
    }

    // We need to wait for the iframe to load its content before we can access
    // the contentDocument and its body.
    iframeElement.addEventListener("load", handleLoad)

    return () => {
      iframeElement.removeEventListener("load", handleLoad)
      stopWatching?.()
    }
  }, [srcDoc, initialHeight, iframeRef, iframeHeightMode])

  return currentHeight
}

export interface IFrameProps {
  element: IFrameProto
}

function IFrame({ element }: Readonly<IFrameProps>): ReactElement {
  const { height: initialHeight } = element
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Either 'src' or 'srcDoc' will be set in our element. If 'src'
  // is set, we're loading a remote URL in the iframe.
  const src = getNonEmptyString(element.src)
  const srcDoc = notNullOrUndefined(src)
    ? undefined
    : getNonEmptyString(element.srcdoc)

  const finalHeight = useIframeHeight({ srcDoc, initialHeight, iframeRef })

  return (
    <StyledIframe
      className="stIFrame"
      data-testid="stIFrame"
      allow={DEFAULT_IFRAME_FEATURE_POLICY}
      disableScrolling={!element.scrolling}
      src={src}
      srcDoc={srcDoc}
      height={finalHeight}
      scrolling={element.scrolling ? "auto" : "no"}
      sandbox={DEFAULT_IFRAME_SANDBOX_POLICY}
      title="st.iframe"
      ref={iframeRef}
    />
  )
}

export default memo(IFrame)
