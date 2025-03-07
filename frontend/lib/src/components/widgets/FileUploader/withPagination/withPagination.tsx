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
  ComponentType,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react"

import hoistNonReactStatics from "hoist-non-react-statics"

import { usePrevious } from "~lib/util/Hooks"

import Pagination from "./Pagination"

export interface Props {
  items: any[]
  pageSize: number
  resetOnAdd: boolean
}

const calculateNumPages = (items: any[], pageSize: number): number =>
  Math.ceil(items.length / pageSize)

const withPagination = (
  WrappedComponent: ComponentType<React.PropsWithChildren<any>>
): ComponentType<React.PropsWithChildren<any>> => {
  const WithPagination = ({
    pageSize,
    items,
    resetOnAdd,
    ...props
  }: Props): ReactElement => {
    const [currentPageState, setCurrentPage] = useState<number>(0)

    const prevItems: any[] = usePrevious(items)
    const totalPages = calculateNumPages(items, pageSize)

    // Calculate the correct current page based on current state and props
    let currentPage = currentPageState

    // Handle item additions (if resetOnAdd is true)
    if (prevItems && prevItems.length < items.length && resetOnAdd) {
      currentPage = 0

      // Only update state if needed to avoid unnecessary renders
      if (currentPageState !== 0) {
        setCurrentPage(0)
      }
    }
    // Handle when current page is out of bounds
    else if (currentPage >= totalPages && totalPages > 0) {
      currentPage = totalPages - 1

      // Only update state if needed
      if (currentPageState !== totalPages - 1) {
        setCurrentPage(totalPages - 1)
      }
    }

    const onNext = useCallback(() => {
      setCurrentPage(Math.min(currentPage + 1, totalPages - 1))
    }, [currentPage, totalPages])

    const onPrevious = useCallback(() => {
      setCurrentPage(Math.max(0, currentPage - 1))
    }, [currentPage])

    const paginatedItems = useMemo(() => {
      return items.slice(
        currentPage * pageSize,
        currentPage * pageSize + pageSize
      )
    }, [currentPage, items, pageSize])

    return (
      <>
        <WrappedComponent items={paginatedItems} {...props} />
        {items.length > pageSize ? (
          <Pagination
            pageSize={pageSize}
            totalPages={totalPages}
            currentPage={currentPage + 1}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        ) : null}
      </>
    )
  }
  return hoistNonReactStatics(WithPagination, WrappedComponent)
}

export default withPagination
