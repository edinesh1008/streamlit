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

import React, { memo, ReactElement, useState } from "react"

import { Block as BlockProto } from "@streamlit/protobuf"

import Modal, { ModalBody, ModalHeader } from "~lib/components/shared/Modal"
import IsDialogContext from "~lib/components/core/IsDialogContext"
import { notNullOrUndefined } from "~lib/util/utils"

export interface Props {
  element: BlockProto.Dialog
  deltaMsgReceivedAt?: number
}

const Dialog: React.FC<React.PropsWithChildren<Props>> = ({
  element,
  children,
}): ReactElement => {
  const { title, dismissible, width, isOpen: initialIsOpen } = element
  const [isOpen, setIsOpen] = useState<boolean>(() =>
    notNullOrUndefined(initialIsOpen) ? initialIsOpen : false
  )

  // don't use the Modal's isOpen prop as it feels laggy when using it
  if (!isOpen) {
    return <></>
  }

  return (
    <Modal
      isOpen
      closeable={dismissible}
      onClose={() => setIsOpen(false)}
      size={width === BlockProto.Dialog.DialogWidth.LARGE ? "full" : "default"}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
  )
}

function DialogWithProvider(
  props: React.PropsWithChildren<Props>
): ReactElement {
  const { element, deltaMsgReceivedAt } = props
  const { isOpen: initialIsOpen } = element

  /**
   * Using a key to reset the Dialog component's internal state when
   * initialIsOpen or deltaMsgReceivedAt changes. This is a React pattern that
   * avoids the need for useEffect to reset state when props change. When the
   * key changes, React will unmount and remount the component, creating a fresh
   * instance with new state initialized from the current props.
   * @see {@link https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes | You Might Not Need an Effect}
   */
  const key = `${initialIsOpen}-${deltaMsgReceivedAt}`

  return (
    <IsDialogContext.Provider value={true}>
      <Dialog {...props} key={key} />
    </IsDialogContext.Provider>
  )
}

export default memo(DialogWithProvider)
