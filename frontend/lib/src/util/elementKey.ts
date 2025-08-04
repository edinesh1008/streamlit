/**
 * Stable key generation for elements to preserve React component state
 * during re-renders when elements are inserted/removed.
 */

import { Element } from "@streamlit/protobuf"

import { getElementId } from "./utils"

/**
 * Generates a stable key for an element that persists across re-renders.
 * This key is based on the element's content and original position,
 * not its current array index.
 */
export function generateStableElementKey(
  element: Element,
  deltaPath: number[],
  scriptRunId: string
): string {
  // First priority: Use explicit element ID if available
  const elementId = getElementId(element)
  if (elementId) {
    return elementId
  }

  // Second priority: Generate a stable key based on element type and content
  const elementType = element.type || "unknown"

  // Create a content hash based on the element's key properties
  let contentHash = ""

  switch (elementType) {
    case "text":
      contentHash = element.text?.body || ""
      break
    case "markdown":
      contentHash = element.markdown?.body || ""
      break
    case "heading":
      contentHash = element.heading?.body || ""
      break
    case "code":
      contentHash = element.code?.codeText || ""
      break
    // Add more cases for other element types as needed
    default:
      // For elements without clear content, use type + path
      contentHash = `${elementType}-${deltaPath.join("-")}`
  }

  // Create a simple hash of the content
  const hash = contentHash
    .split("")
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
    .toString(36)

  // Combine element type, position hint, and content hash
  // This creates a key that's stable for the same content at the same logical position
  return `${elementType}-${deltaPath[deltaPath.length - 1]}-${hash}-${scriptRunId.slice(-8)}`
}

/**
 * Generates a stable key for a block node
 */
export function generateStableBlockKey(
  blockType: string | undefined,
  deltaPath: number[],
  blockId?: string
): string {
  if (blockId) {
    return blockId
  }

  // Use block type and path for stability
  const type = blockType || "block"
  return `${type}-${deltaPath.join("-")}`
}
