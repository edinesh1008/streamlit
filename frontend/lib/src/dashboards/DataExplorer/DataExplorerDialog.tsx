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

import React, {
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import { Arrow } from "@streamlit/protobuf"

import { ElementNode } from "~lib/AppNode"
import Modal, {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from "~lib/components/shared/Modal"
import { BaseButtonKind } from "~lib/components/shared/BaseButton"
import { EditModeElementsContext } from "~lib/dashboards/EditModeElementsContext"

export interface DataExplorerDialogProps {
  element: ElementNode
  onClose: () => void
}

export function DataExplorerDialog({
  element,
  onClose,
}: DataExplorerDialogProps): ReactElement {
  const { dataQueryRegistry } = useContext(EditModeElementsContext)
  const [queryId, setQueryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  let data: Arrow | null = null
  if (queryId && dataQueryRegistry[queryId]) {
    data = dataQueryRegistry[queryId]
  }

  const handleCancel = useCallback(() => {
    onClose()
  }, [onClose])

  const handleConfirmChange = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Modal isOpen={true} closeable={true} onClose={handleCancel} size="auto">
      <div onClick={e => e.stopPropagation()}>
        <ModalHeader>Chart Editor</ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <ModalButton kind={BaseButtonKind.GHOST} onClick={handleCancel}>
            Cancel
          </ModalButton>
          <ModalButton
            autoFocus
            kind={BaseButtonKind.PRIMARY}
            onClick={handleConfirmChange}
          >
            Save
          </ModalButton>
        </ModalFooter>
      </div>
    </Modal>
  )
}
