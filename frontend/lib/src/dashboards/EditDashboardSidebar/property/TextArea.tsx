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
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react"

import { Textarea as UITextArea } from "baseui/textarea"
import { useTheme } from "@emotion/react"
import uniqueId from "lodash/uniqueId"

import { WidgetLabel } from "~lib/components/widgets/BaseWidget"
import { ElementNode } from "~lib/AppNode"
import { EditModeElementsContext } from "~lib/dashboards/EditModeElementsContext"

import { PropertyDefinition } from "./types"

interface TextAreaProps extends PropertyDefinition<string> {
  element: ElementNode
}

const TextArea: FC<TextAreaProps> = ({
  element,
  getValue,
  label,
  setValue: setPropertyValue,
}) => {
  const theme = useTheme()
  const { replaceElement } = useContext(EditModeElementsContext)
  // TODO: Update to match React best practices
  // eslint-disable-next-line react-compiler/react-compiler
  const id = useRef(uniqueId("text_area_")).current
  const [value, setValue] = useState(getValue(element))

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value)
      replaceElement(element, setPropertyValue(element, event.target.value))
    },
    [element, replaceElement, setPropertyValue]
  )

  return (
    <div className="stTextArea" data-testid="stTextArea">
      <WidgetLabel label={label} disabled={false} htmlFor={id} />
      <UITextArea
        value={value}
        placeholder="Enter text here..."
        onChange={handleChange}
        aria-label={label}
        disabled={false}
        id={id}
        overrides={{
          Input: {
            style: {
              lineHeight: theme.lineHeights.inputWidget,
              minHeight: theme.sizes.largestElementHeight,
              resize: "vertical",
              "::placeholder": {
                opacity: "0.7",
              },
              // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
              paddingRight: theme.spacing.lg,
              paddingLeft: theme.spacing.lg,
              paddingBottom: theme.spacing.lg,
              paddingTop: theme.spacing.lg,
            },
          },
          Root: {
            props: {
              "data-testid": "stTextAreaRootElement",
            },
            style: {
              // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
              borderLeftWidth: theme.sizes.borderWidth,
              borderRightWidth: theme.sizes.borderWidth,
              borderTopWidth: theme.sizes.borderWidth,
              borderBottomWidth: theme.sizes.borderWidth,
            },
          },
        }}
      />
    </div>
  )
}

export default memo(TextArea)
