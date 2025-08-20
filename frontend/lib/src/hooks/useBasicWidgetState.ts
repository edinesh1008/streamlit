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

import { Dispatch, SetStateAction, useCallback, useEffect } from "react"

import { useFormClearHelper } from "~lib/components/widgets/Form"
import { useWidgetManagerValue } from "~lib/hooks/useWidgetManagerValue"
import { Source, WidgetStateManager } from "~lib/WidgetStateManager"

export type ValueWithSource<T> = {
  value: T
} & Source

// Interface for a proto that has a .formId
interface ValueElementProtoInterface {
  formId: string
}

interface BaseArgs<
  T, // Type of the value stored in WidgetStateManager.
  P extends ValueElementProtoInterface, // Proto for this widget.
> {
  // Important: these callback functions need to have stable references! So
  // either declare them at the module level or wrap in useCallback.
  getStateFromWidgetMgr: (wm: WidgetStateManager, el: P) => T | undefined
  updateWidgetMgrState: (
    el: P,
    wm: WidgetStateManager,
    vws: ValueWithSource<T>,
    fragmentId?: string
  ) => void
  element: P
  widgetMgr: WidgetStateManager
  fragmentId?: string
  onFormCleared?: () => void
}

export interface UseBasicWidgetClientStateArgs<
  T, // Type of the value stored in WidgetStateManager.
  P extends ValueElementProtoInterface, // Proto for this widget.
> extends BaseArgs<T, P> {
  // Important: these callback functions need to have stable references! So
  // either declare them at the module level or wrap in useCallback.
  getDefaultState: (wm: WidgetStateManager, el: P) => T
}

/**
 * A React hook that makes the simplest kinds of widgets very easy to implement.
 * Use the clientState version when the widget does not have a .setValue on its
 * proto, otherwise utilize `useBasicWidgetState`.
 */
export function useBasicWidgetClientState<
  T, // Type of the value stored in WidgetStateManager.
  P extends ValueElementProtoInterface, // Proto for this widget.
>({
  getStateFromWidgetMgr,
  getDefaultState,
  updateWidgetMgrState,
  element,
  widgetMgr,
  fragmentId,
  onFormCleared,
}: UseBasicWidgetClientStateArgs<T, P>): [
  T,
  Dispatch<SetStateAction<ValueWithSource<T> | null>>,
] {
  const [currentValue, setNextValueWithSource] = useWidgetManagerValue<T, P>({
    getInitialValue: (wm, el) =>
      getStateFromWidgetMgr(wm, el) ?? getDefaultState(wm, el),
    updateWidgetMgrState,
    element,
    widgetMgr,
    fragmentId,
  })

  /**
   * If we're part of a clear_on_submit form, this will be called when our
   * form is submitted. Restore our default value and update the WidgetManager.
   */
  const handleFormCleared = useCallback((): void => {
    setNextValueWithSource({
      value: getDefaultState(widgetMgr, element),
      fromUi: true,
    })
    onFormCleared?.()
  }, [
    setNextValueWithSource,
    element,
    getDefaultState,
    widgetMgr,
    onFormCleared,
  ])

  // Manage our form-clear event handler.
  useFormClearHelper({ widgetMgr, element, onFormCleared: handleFormCleared })

  return [currentValue, setNextValueWithSource]
}

// Interface for a proto that has a setValue, and .formId
interface ValueElementProtoInterfaceWithSetValue
  extends ValueElementProtoInterface {
  setValue: boolean
}

export interface UseBasicWidgetStateArgs<
  T, // Type of the value stored in WidgetStateManager.
  P extends ValueElementProtoInterfaceWithSetValue, // Proto for this widget.
> extends BaseArgs<T, P> {
  // Important: these callback functions need to have stable references! So
  // either declare them at the module level or wrap in useCallback.
  getDefaultStateFromProto: (el: P) => T
  getCurrStateFromProto: (el: P) => T
}

/**
 * A React hook that makes the simplest kinds of widgets very easy to implement.
 */
export function useBasicWidgetState<
  T, // Type of the value stored in WidgetStateManager.
  P extends ValueElementProtoInterfaceWithSetValue, // Proto for this widget.
>({
  getStateFromWidgetMgr,
  getDefaultStateFromProto,
  getCurrStateFromProto,
  updateWidgetMgrState,
  element,
  widgetMgr,
  fragmentId,
  onFormCleared,
}: UseBasicWidgetStateArgs<T, P>): [
  T,
  Dispatch<SetStateAction<ValueWithSource<T> | null>>,
] {
  const getDefaultState = useCallback<(wm: WidgetStateManager, el: P) => T>(
    (_wm, el) => {
      return getDefaultStateFromProto(el)
    },
    [getDefaultStateFromProto]
  )

  const [currentValue, setNextValueWithSource] = useBasicWidgetClientState({
    getStateFromWidgetMgr,
    getDefaultState,
    updateWidgetMgrState,
    element,
    widgetMgr,
    fragmentId,
    onFormCleared,
  })

  // Respond to value changes via session_state. This is also set via an
  // "event", this time using the .setValue property of the proto.
  useEffect(() => {
    if (!element.setValue) return
    // TODO: Update to match React best practices
    // eslint-disable-next-line react-hooks/react-compiler
    element.setValue = false // Clear "event".

    setNextValueWithSource({
      value: getCurrStateFromProto(element),
      fromUi: false,
    })
  }, [element, getCurrStateFromProto, setNextValueWithSource])

  return [currentValue, setNextValueWithSource]
}
