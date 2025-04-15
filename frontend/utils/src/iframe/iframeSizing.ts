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

// Type for the debounced function including the cancel method
interface DebouncedFunc<T extends any[]> {
  (...args: T): void
  cancel: () => void
}

// Simple debounce function
function debounce<T extends any[]>(
  func: (...args: T) => void,
  wait: number
): DebouncedFunc<T> {
  let timeout: ReturnType<typeof setTimeout> | null

  const debounced = (...args: T): void => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      timeout = null
      func(...args)
    }, wait)
  }

  debounced.cancel = (): void => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

/**
 * Manages iframe height reporting and watching.
 */
export class IframeSizer {
  private lastFrameHeight: number | undefined

  private resizeObserver: ResizeObserver | undefined

  private mutationObserver: MutationObserver | undefined

  private debouncedUpdateHeight: DebouncedFunc<[]> | undefined

  private readonly setHeightCallback: (height: number) => void

  /**
   * Initializes the iframe sizing utility.
   * @param options - Configuration options.
   * @param options.setHeightCallback - The function to call when the height needs to be updated.
   */
  constructor(options: { setHeightCallback: (height: number) => void }) {
    this.setHeightCallback = options.setHeightCallback
  }

  /**
   * Report the element's height.
   * This should be called every time the element changes its DOM - that is,
   * when it's first loaded, and any time it updates.
   * @param height The height to set. Defaults to the scrollHeight of the element.
   * @param element The target element. Defaults to document.body.
   */
  public setFrameHeight(
    height?: number,
    element: HTMLElement = document.body
  ): void {
    if (height === undefined) {
      // `height` is optional. If undefined, it defaults to scrollHeight,
      // which is the entire height of the element minus its border,
      // scrollbar, and margin.
      height = element.scrollHeight
    }

    if (height === this.lastFrameHeight) {
      // Don't bother updating if our height hasn't changed.
      return
    }

    this.lastFrameHeight = height
    this.setHeightCallback(height)
  }

  /**
   * Watch the frame height and update the component's height when it changes.
   * This should be called only once when the component is mounted.
   *
   * @param element The target element to watch. Defaults to document.body.
   * @returns A function to stop watching the frame height.
   */
  public watchFrameHeight(element: HTMLElement = document.body): () => void {
    if (this.resizeObserver || this.mutationObserver) {
      this.stopWatchingFrameHeight()
    }

    // Define a common handler for both observers
    const updateHeight = (): void => {
      // Avoid infinite loops by checking if the height has actually changed.
      // Reading scrollHeight itself can trigger ResizeObserver/MutationObserver events in some cases.
      const newHeight = element.scrollHeight
      // Pass the element to setFrameHeight as well
      this.setFrameHeight(newHeight, element)
    }

    // Debounce the updateHeight function
    this.debouncedUpdateHeight = debounce(updateHeight, 100)

    // Use ResizeObserver to efficiently detect direct size changes.
    this.resizeObserver = new ResizeObserver(this.debouncedUpdateHeight)
    this.resizeObserver.observe(element)

    // Use MutationObserver to catch other changes (e.g., adding/removing children)
    // that might affect scrollHeight.
    this.mutationObserver = new MutationObserver(this.debouncedUpdateHeight)
    this.mutationObserver.observe(element, {
      attributes: true, // Catch style changes
      childList: true, // Catch added/removed elements
      subtree: true, // Observe the entire subtree
      characterData: true, // Catch text content changes
    })

    // Initial height check (not debounced)
    updateHeight()

    // Return the stopWatchingFrameHeight method bound to this instance
    return () => this.stopWatchingFrameHeight()
  }

  /**
   * Stop watching the frame height.
   * Should be called when the component is unmounted via the
   * returned function from `watchFrameHeight`.
   */
  private stopWatchingFrameHeight(): void {
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
    this.mutationObserver?.disconnect()
    this.mutationObserver = undefined
    // Setting lastFrameHeight to undefined ensures the next setFrameHeight call will always trigger
    this.lastFrameHeight = undefined
    // Cancel any pending debounced calls
    if (this.debouncedUpdateHeight) {
      this.debouncedUpdateHeight.cancel()
    }
    this.debouncedUpdateHeight = undefined
  }
}
