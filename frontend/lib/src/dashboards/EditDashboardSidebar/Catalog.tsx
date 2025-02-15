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

import React, { ReactElement, ReactNode, useRef } from "react"

import {
  BarChart,
  PieChart,
  ShowChart,
  TableView,
  TextFields,
} from "@emotion-icons/material-outlined"
import { EmotionIcon } from "@emotion-icons/emotion-icon"
import styled from "@emotion/styled"
import { transparentize } from "color2k"
import { useTheme } from "@emotion/react"
import { useDrag } from "react-dnd"

import Icon from "~lib/components/shared/Icon"
import { ElementNode } from "~lib/AppNode"
import { Element, ForwardMsgMetadata, Markdown } from "@streamlit/protobuf"

const StyledListItem = styled.li(({ theme }) => ({
  padding: `${theme.spacing.lg} ${theme.spacing.sm}`,
  color: theme.colors.bodyText,
}))

const StyledListContainer = styled.ul(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  marginTop: theme.spacing.twoXL,
  overflowY: "scroll",
  listItemStyleType: "none",
  [StyledListItem as any]: {
    borderBottom: `1px solid ${theme.colors.fadedText20}`,
    "&:last-of-type": {
      borderBottom: "none",
    },
  },
}))

const StyledListItemIcon = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  color: theme.colors.bodyText,
}))

const StyledListItemLayout = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.spacing.lg,
}))

const StyledListItemContentLayout = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.xs,
  color: transparentize(theme.colors.bodyText, 0.2),
}))

const StyledListItemTitle = styled.div(({ theme }) => ({
  fontWeight: theme.fontWeights.bold,
  lineHeight: theme.lineHeights.tight,
}))

const StyledListItemDescription = styled.div(({ theme }) => ({
  fontSize: theme.fontSizes.sm,
  lineHeight: theme.lineHeights.tight,
  fontStyle: "italic",
}))

const DEFAULT_ELEMENT: Record<string, ElementNode> = {
  table: {
    type: "table",
    props: {},
  },
  line_chart: {
    type: "line_chart",
    props: {},
  },
  bar_chart: {
    type: "bar_chart",
    props: {},
  },
  pie_chart: {
    type: "pie_chart",
    props: {},
  },
  rich_text: new ElementNode(
    new Element({
      markdown: {
        body: "# I am a heading\nI am some text",
        allowHtml: false,
        isCaption: false,
        elementType: Markdown.Type.NATIVE,
        help: "",
      },
    }),
    new ForwardMsgMetadata({
      cacheable: false,
      deltaPath: [],
      activeScriptHash: "NO_ACTIVE_SCRIPT_HASH",
    }),
    "NO_SCRIPT_RUN_ID",
    "NO_ACTIVE_SCRIPT_HASH"
  ),
}

interface ListItemProps {
  description?: string
  icon: EmotionIcon
  elementType: keyof typeof DEFAULT_ELEMENT
  children: ReactNode
}

function ListItem({
  icon,
  description,
  elementType,
  children,
}: ListItemProps): ReactElement {
  const theme = useTheme()
  const defaultElements = useRef(DEFAULT_ELEMENT)

  const [, dragRef] = useDrag({
    type: "element",
    item: () => {
      return DEFAULT_ELEMENT[elementType]
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        return
      }

      // Make a new element to produce a different reference
      const currentElement = defaultElements.current[elementType]
      defaultElements.current[elementType] = currentElement.clone()
    },
  })

  return (
    <StyledListItem ref={dragRef}>
      <StyledListItemLayout>
        <StyledListItemIcon>
          <Icon
            content={icon}
            size="threeXL"
            color={transparentize(theme.colors.bodyText, 0.2)}
          />
        </StyledListItemIcon>
        <StyledListItemContentLayout>
          <StyledListItemTitle>{children}</StyledListItemTitle>
          <StyledListItemDescription>
            {description ?? ""}
          </StyledListItemDescription>
        </StyledListItemContentLayout>
      </StyledListItemLayout>
    </StyledListItem>
  )
}

export function Catalog(): ReactElement {
  return (
    <StyledListContainer>
      <ListItem
        icon={TableView}
        description="Great for showing raw tabular data"
        elementType="table"
      >
        Table
      </ListItem>
      <ListItem
        icon={ShowChart}
        description="Ideal for visualizing trends over time or continuous data"
        elementType="line_chart"
      >
        Line Chart
      </ListItem>
      <ListItem
        icon={BarChart}
        description="Best for comparing categorical data with distinct groups"
        elementType="bar_chart"
      >
        Bar Chart
      </ListItem>
      <ListItem
        icon={PieChart}
        description="Useful for showing proportions and percentage distributions"
        elementType="pie_chart"
      >
        Pie Chart
      </ListItem>
      <ListItem
        icon={TextFields}
        description="Allows for formatted text with styling, links, and media"
        elementType="rich_text"
      >
        Rich Text
      </ListItem>
    </StyledListContainer>
  )
}
