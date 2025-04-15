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
import React, { memo, ReactElement, useEffect, useMemo, useRef } from "react"

import { IFrameComponent, iframeResizer } from "iframe-resizer"
// We are intentionally importing the raw text of the iframeResizer.contentWindow.min.js
// file because it's a raw text file and not a module.
// eslint-disable-next-line import/extensions
import iframeResizerContentWindowMinJsText from "iframe-resizer/js/iframeResizer.contentWindow.min.js?raw"

import { IFrame as IFrameProto } from "@streamlit/protobuf"

import { isNullOrUndefined, notNullOrUndefined } from "~lib/util/utils"
import {
  DEFAULT_IFRAME_FEATURE_POLICY,
  DEFAULT_IFRAME_SANDBOX_POLICY,
} from "~lib/util/IFrameUtil"

import { StyledIframe } from "./styled-components"

/**
 * Return a string property from an element. If the string is
 * null or empty, return undefined instead.
 */
function getNonEmptyString(
  value: string | null | undefined
): string | undefined {
  return isNullOrUndefined(value) || value === "" ? undefined : value
}

export interface IFrameProps {
  element: IFrameProto
}

function IFrame({ element }: Readonly<IFrameProps>): ReactElement {
  const { height } = element
  // Either 'src' or 'srcDoc' will be set in our element. If 'src'
  // is set, we're loading a remote URL in the iframe.
  const src = getNonEmptyString(element.src)
  const srcDoc = notNullOrUndefined(src)
    ? undefined
    : getNonEmptyString(element.srcdoc)

  /**
   * -1.0 indicates auto height
   * @see #iframeV1AutoHeight
   */
  const isAutoHeight = height === -1.0

  const srcDocWithResizeHandler = useMemo(() => {
    if (!srcDoc) {
      return undefined
    }

    if (isAutoHeight) {
      return `${srcDoc}<script>${iframeResizerContentWindowMinJsText}</script>`
    }

    return srcDoc
  }, [srcDoc, isAutoHeight])

  const ref = useRef<IFrameComponent>(null)

  useEffect(() => {
    const iframeRef = ref.current

    if (iframeRef) {
      iframeResizer(
        {
          log: true,
          // Use the current page's origin for security checks
          checkOrigin: [window.location.origin],
        },
        iframeRef
      )
    }

    return () => {
      if (!iframeRef) {
        return
      }

      const { iFrameResizer } = iframeRef

      if (iFrameResizer) {
        iFrameResizer.removeListeners()
      }
    }
  }, [])

  return (
    <>
      <StyledIframe
        className="stIFrame"
        data-testid="stIFrame"
        allow={DEFAULT_IFRAME_FEATURE_POLICY}
        disableScrolling={!element.scrolling}
        src={src}
        srcDoc={srcDocWithResizeHandler}
        height={height}
        scrolling={element.scrolling ? "auto" : "no"}
        sandbox={DEFAULT_IFRAME_SANDBOX_POLICY}
        title="st.iframe"
        ref={ref}
      />
    </>
  )
}

export default memo(IFrame)
