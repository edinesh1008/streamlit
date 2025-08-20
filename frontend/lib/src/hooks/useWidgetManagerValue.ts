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

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { isNullOrUndefined } from "~lib/util/utils"
import { WidgetStateManager } from "~lib/WidgetStateManager"

/**
 * Pair a value with its origin. This helps the WidgetStateManager decide
 * whether to send updates immediately (from UI events) or to treat them as
 * external synchronizations.
 *
 * @template T The type of the value being stored
 */
export type ValueWithSource<T> = {
  value: T
  fromUi: boolean
}

/**
 * Minimal proto shape required by this hook. Widgets typically receive an
 * element proto that includes a `formId` used for form-related behaviors.
 */
interface ValueElementProtoInterface {
  formId: string
}

/**
 * Allowed inputs for the hook's setter. Mirrors React's SetStateAction:
 * you can pass a new value directly or an updater function. `null` is
 * treated as a no-op.
 */
export type Candidate<T> = SetStateAction<ValueWithSource<T> | null>

/**
 * Arguments for `useWidgetManagerValue`.
 *
 * @template T The value type managed by the widget
 * @template P The element proto type (must include `formId`)
 * @property getInitialValue Compute the initial value for the widget (reads
 *           from the manager or computes a default)
 * @property updateWidgetMgrState Push a new value into the WidgetStateManager
 * @property element The widget's proto
 * @property widgetMgr The shared WidgetStateManager instance
 * @property fragmentId Optional fragment identifier for routing updates
 */
export interface UseWidgetManagerValueArgs<
  T,
  P extends ValueElementProtoInterface,
> {
  getInitialValue: (wm: WidgetStateManager, el: P) => T
  updateWidgetMgrState: (
    el: P,
    wm: WidgetStateManager,
    vws: ValueWithSource<T>,
    fragmentId?: string
  ) => void
  element: P
  widgetMgr: WidgetStateManager
  fragmentId?: string
}

/**
 * Manage a widget's value with immediate, synchronous updates to
 * WidgetStateManager and an initial one-time synchronization.
 *
 * This hook follows React best practices by:
 * - Performing user-driven updates synchronously in an event-safe setter
 *   instead of an effect.
 * - Handling the initial external synchronization with a scoped effect
 *   (fromUi: false) without triggering render cascades.
 *
 * @template T The value type managed by the widget
 * @template P The element proto type (must include `formId`)
 * @param options The configuration object
 * @param options.getInitialValue Function to compute initial value
 * @param options.updateWidgetMgrState Function to push updates to the manager
 * @param options.element The widget's proto
 * @param options.widgetMgr The WidgetStateManager instance
 * @param options.fragmentId Optional fragment ID
 * @returns A tuple: [currentValue, setValue], where setValue accepts a
 *          `ValueWithSource<T>` or an updater function of it.
 * @example
 * const [value, setValue] = useWidgetManagerValue({
 *   getInitialValue: (wm, el) => wm.getStringValue(el) ?? "",
 *   updateWidgetMgrState: (el, wm, next, fragmentId) =>
 *     wm.setStringValue(el, next.value, next, fragmentId),
 *   element,
 *   widgetMgr,
 *   fragmentId,
 * })
 * // In an event handler:
 * setValue({ value: "hello", fromUi: true })
 */
export function useWidgetManagerValue<
  T,
  P extends ValueElementProtoInterface,
>({
  getInitialValue,
  updateWidgetMgrState,
  element,
  widgetMgr,
  fragmentId,
}: UseWidgetManagerValueArgs<T, P>): [
  T,
  Dispatch<SetStateAction<ValueWithSource<T> | null>>,
] {
  const [currentValue, setCurrentValue] = useState<T>(() =>
    getInitialValue(widgetMgr, element)
  )

  const lastSyncedRef = useRef<{ element: P; value: T } | null>(null)

  const setNextValueWithSource = useCallback<
    Dispatch<SetStateAction<ValueWithSource<T> | null>>
  >(
    nextOrUpdater => {
      const next =
        typeof nextOrUpdater === "function"
          ? nextOrUpdater(null)
          : nextOrUpdater

      if (isNullOrUndefined(next)) {
        return
      }

      setCurrentValue(next.value)
      updateWidgetMgrState(element, widgetMgr, next, fragmentId)
      lastSyncedRef.current = { element, value: next.value }
    },
    [updateWidgetMgrState, element, widgetMgr, fragmentId]
  )

  useEffect(() => {
    const last = lastSyncedRef.current
    if (last?.element === element && Object.is(last.value, currentValue)) {
      return
    }

    updateWidgetMgrState(
      element,
      widgetMgr,
      { value: currentValue, fromUi: false },
      fragmentId
    )
    lastSyncedRef.current = { element, value: currentValue }
  }, [element, widgetMgr, fragmentId, updateWidgetMgrState, currentValue])

  return [currentValue, setNextValueWithSource]
}
