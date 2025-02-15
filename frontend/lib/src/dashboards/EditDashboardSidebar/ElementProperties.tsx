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

import React, { ComponentType, ReactElement } from "react"

import styled from "@emotion/styled"

import { ElementNode } from "~lib/AppNode"

import ELEMENT_DEFINITIONS from "./elementDefinition"
import PROPERTY_DEFINITIONS, { PropertyDefinition } from "./property"

const StyledProperties = styled.ul(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.twoXL,
  }
})

const StyledProperty = styled.li(({ theme }) => {
  return {
    listStyleType: "none",
    padding: theme.spacing.sm,
  }
})

interface PropertyProps extends PropertyDefinition<any> {
  element: ElementNode
}

const renderProperty = (
  element: ElementNode,
  property: PropertyDefinition<any>
): ReactElement => {
  const Component = PROPERTY_DEFINITIONS[
    property.type
  ] as ComponentType<PropertyProps>

  return <Component element={element} {...property} />
}

interface ElementPropertiesProps {
  element: ElementNode | null
}

export function ElementProperties({
  element,
}: ElementPropertiesProps): ReactElement {
  if (!element || !element.element.type) {
    return <></>
  }

  const properties = ELEMENT_DEFINITIONS[element.element.type]
  return (
    <StyledProperties>
      <strong>Element Properties</strong>
      {properties.map((property, index) => (
        <StyledProperty key={index}>
          {renderProperty(element, property)}
        </StyledProperty>
      ))}
    </StyledProperties>
  )
}
