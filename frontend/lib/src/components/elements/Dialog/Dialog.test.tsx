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

import { screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

import { Block as BlockProto } from "@streamlit/protobuf"

import { render } from "~lib/test_util"

import Dialog, { Props as DialogProps } from "./Dialog"

const getProps = (
  elementProps: Partial<BlockProto.Dialog> = {},
  props: Partial<DialogProps> = {}
): DialogProps => ({
  element: BlockProto.Dialog.create({
    title: "StreamlitDialog",
    isOpen: true,
    dismissible: true,
    ...elementProps,
  }),
  ...props,
})

describe("Dialog container", () => {
  it("renders without crashing", () => {
    const props = getProps()
    render(
      <Dialog {...props}>
        <div>test</div>
      </Dialog>
    )

    const dialogContainer = screen.getByTestId("stDialog")
    expect(dialogContainer).toBeInTheDocument()
    expect(dialogContainer).toHaveClass("stDialog")
  })

  it("should render the text when open", () => {
    const props = getProps()
    render(
      <Dialog {...props}>
        <div>test</div>
      </Dialog>
    )

    expect(screen.getByText("test")).toBeVisible()
  })

  it("should not render the text when closed", () => {
    const props = getProps({ isOpen: false })
    render(
      <Dialog {...props}>
        <div>test</div>
      </Dialog>
    )

    expect(screen.queryByText("test")).not.toBeInTheDocument()
  })

  it("should close when dismissible", async () => {
    const user = userEvent.setup()
    const props = getProps()
    render(
      <Dialog {...props}>
        <div>test</div>
      </Dialog>
    )

    expect(screen.getByText("test")).toBeVisible()
    await user.click(screen.getByLabelText("Close"))
    // dialog should be closed by clicking outside and, thus, the content should be gone
    expect(screen.queryByText("test")).not.toBeInTheDocument()
  })

  it("should not close when not dismissible", () => {
    const props = getProps({ dismissible: false })
    render(
      <Dialog {...props}>
        <div>test</div>
      </Dialog>
    )

    expect(screen.getByText("test")).toBeVisible()
    // close button - and hence dismiss - does not exist
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument()
  })

  it("should reopen dialog when deltaMsgReceivedAt changes even if isOpen hasn't changed", async () => {
    // Initial render with dialog open
    const initialProps = getProps()
    const { rerender } = render(
      <Dialog {...initialProps}>
        <div>test</div>
      </Dialog>
    )

    expect(screen.getByText("test")).toBeVisible()

    // User closes the dialog
    await userEvent.click(screen.getByLabelText("Close"))
    expect(screen.queryByText("test")).not.toBeInTheDocument()

    // New message arrives with same isOpen=true but different deltaMsgReceivedAt
    const newProps = getProps({}, { deltaMsgReceivedAt: Date.now() })
    rerender(
      <Dialog {...newProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be visible again
    expect(screen.getByText("test")).toBeVisible()
  })

  it("should reset dialog state when isOpen prop changes", () => {
    // Initial render with dialog closed
    const initialProps = getProps({ isOpen: false })
    const { rerender } = render(
      <Dialog {...initialProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be closed
    expect(screen.queryByText("test")).not.toBeInTheDocument()

    // Change isOpen to true
    const newProps = getProps({ isOpen: true })
    rerender(
      <Dialog {...newProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be visible
    expect(screen.getByText("test")).toBeVisible()
  })

  it("should maintain closed state when only title changes", async () => {
    // Initial render with dialog open
    const initialProps = getProps()
    const { rerender } = render(
      <Dialog {...initialProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be visible
    expect(screen.getByText("test")).toBeVisible()

    // User closes the dialog
    await userEvent.click(screen.getByLabelText("Close"))
    expect(screen.queryByText("test")).not.toBeInTheDocument()

    // Only title changes
    const newProps = getProps({ title: "New Title" })
    rerender(
      <Dialog {...newProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should remain closed
    expect(screen.queryByText("test")).not.toBeInTheDocument()
  })

  it("should handle null initialIsOpen correctly", () => {
    // Create props with undefined isOpen
    const element = BlockProto.Dialog.create({
      title: "StreamlitDialog",
      dismissible: true,
      isOpen: null,
    })
    const props = { element }

    render(
      <Dialog {...props}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be closed by default when isOpen is null
    expect(screen.queryByText("test")).not.toBeInTheDocument()
  })

  it("should handle multiple deltaMsgReceivedAt changes", async () => {
    // Initial render with dialog open
    const initialProps = getProps()
    const { rerender } = render(
      <Dialog {...initialProps}>
        <div>test</div>
      </Dialog>
    )

    expect(screen.getByText("test")).toBeVisible()

    // User closes the dialog
    await userEvent.click(screen.getByLabelText("Close"))
    expect(screen.queryByText("test")).not.toBeInTheDocument()

    // First message arrives
    const firstMsgProps = getProps({}, { deltaMsgReceivedAt: Date.now() })
    rerender(
      <Dialog {...firstMsgProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be visible again
    expect(screen.getByText("test")).toBeVisible()

    // User closes the dialog again
    await userEvent.click(screen.getByLabelText("Close"))
    expect(screen.queryByText("test")).not.toBeInTheDocument()

    // Second message arrives
    const secondMsgProps = getProps(
      {},
      { deltaMsgReceivedAt: Date.now() + 1000 }
    )
    rerender(
      <Dialog {...secondMsgProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be visible again
    expect(screen.getByText("test")).toBeVisible()
  })

  it("should handle isOpen changing from true to false", () => {
    // Initial render with dialog open
    const initialProps = getProps({ isOpen: true })
    const { rerender } = render(
      <Dialog {...initialProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be visible
    expect(screen.getByText("test")).toBeVisible()

    // Change isOpen to false
    const newProps = getProps({ isOpen: false })
    rerender(
      <Dialog {...newProps}>
        <div>test</div>
      </Dialog>
    )

    // Dialog should be closed
    expect(screen.queryByText("test")).not.toBeInTheDocument()
  })

  it("should update title when it changes while dialog is open", () => {
    // Initial render with dialog open and initial title
    const initialTitle = "Initial Title"
    const initialProps = getProps({ title: initialTitle })
    const { rerender } = render(
      <Dialog {...initialProps}>
        <div>test</div>
      </Dialog>
    )

    // Initial title should be visible
    expect(screen.getByText(initialTitle)).toBeVisible()

    // Change title while dialog remains open
    const newTitle = "Updated Title"
    const newProps = getProps({ title: newTitle })
    rerender(
      <Dialog {...newProps}>
        <div>test</div>
      </Dialog>
    )

    // New title should be visible
    expect(screen.getByText(newTitle)).toBeVisible()
    // Old title should no longer be present
    expect(screen.queryByText(initialTitle)).not.toBeInTheDocument()
    // Dialog content should still be visible
    expect(screen.getByText("test")).toBeVisible()
  })
})
