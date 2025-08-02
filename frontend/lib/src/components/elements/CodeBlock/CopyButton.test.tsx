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

import React from "react"

import { screen, waitFor } from "@testing-library/react"
import Clipboard from "clipboard"

import { render } from "~lib/test_util"

import CopyButton from "./CopyButton"

vi.mock("clipboard")

describe("CopyButton element", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders without crashing", () => {
    render(<CopyButton text="test" />)
    expect(screen.getByTestId("stCodeCopyButton")).toBeInTheDocument()
  })

  it("has correct title attribute", () => {
    render(<CopyButton text="test" />)
    expect(screen.getByTestId("stCodeCopyButton")).toHaveAttribute(
      "title",
      "Copy to clipboard"
    )
  })

  it("has correct clipboard text attribute", () => {
    render(<CopyButton text="test" />)
    expect(screen.getByTestId("stCodeCopyButton")).toHaveAttribute(
      "data-clipboard-text",
      "test"
    )
  })

  it("initializes clipboard library on mount", () => {
    render(<CopyButton text="test" />)

    expect(Clipboard).toHaveBeenCalled()
  })

  it("destroys clipboard library on unmount", () => {
    const { unmount } = render(<CopyButton text="test" />)

    unmount()

    // @ts-expect-error
    const mockClipboard = Clipboard.mock.instances[0]
    const mockDestroy = mockClipboard.destroy

    expect(mockDestroy).toHaveBeenCalled()
  })

  it("shows success message when clipboard operation succeeds", async () => {
    // Mock clipboard to capture success callback
    let successCallback: (() => void) | undefined
    const mockClipboard = {
      on: vi.fn((event: string, callback: () => void) => {
        if (event === "success") {
          successCallback = callback
        }
      }),
      destroy: vi.fn(),
    }

    // @ts-expect-error
    Clipboard.mockImplementation(() => mockClipboard)

    render(<CopyButton text="test" />)

    // Verify the success callback was registered
    expect(mockClipboard.on).toHaveBeenCalledWith(
      "success",
      expect.any(Function)
    )

    // Simulate clipboard.js firing success event
    successCallback?.()

    // Verify success message appears
    await waitFor(() => {
      expect(screen.getByText("Copied")).toBeInTheDocument()
    })
  })
})
