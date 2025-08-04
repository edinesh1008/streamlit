/**
 * Virtual DOM Reconciler for preserving React component state
 * when elements are inserted/removed/reordered.
 */

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { AppNode, BlockNode, ElementNode } from "~lib/AppNode"

interface ReconcilerChildProps {
  node: AppNode
  isHidden: boolean
  renderChild: (node: AppNode, key: string) => ReactNode
}

interface ReconcilerState {
  // Maps stable keys to their rendered components
  renderedElements: Map<
    string,
    {
      node: AppNode
      element: ReactNode
      lastSeen: number
    }
  >
  // Track the order of elements
  elementOrder: string[]
}

/**
 * A wrapper component that preserves child components when they're temporarily
 * removed from the tree (e.g., when new elements are inserted before them).
 */
const ReconcilerChild: React.FC<ReconcilerChildProps> = ({
  node,
  isHidden,
  renderChild,
}) => {
  const key =
    node instanceof ElementNode
      ? (node.element.type || "element") +
        "-" +
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node.element as any)[node.element.type || ""]?.id
      : "block-" + Math.random()

  return (
    <div
      style={{
        display: isHidden ? "none" : "contents",
      }}
      data-reconciler-key={key}
      data-hidden={isHidden}
    >
      {renderChild(node, key)}
    </div>
  )
}

interface VirtualReconcilerProps {
  nodes: AppNode[]
  renderChild: (node: AppNode, key: string) => ReactNode
  scriptRunId: string
  enableReconciliation?: boolean
}

/**
 * VirtualReconciler maintains a virtual DOM of child components and preserves
 * their React state even when they're temporarily removed from the tree.
 *
 * Instead of unmounting components when they're removed, it hides them and
 * only unmounts them after the script run is complete if they weren't re-rendered.
 */
export const VirtualReconciler: React.FC<VirtualReconcilerProps> = ({
  nodes,
  renderChild,
  scriptRunId,
  enableReconciliation = true,
}) => {
  const [state, setState] = useState<ReconcilerState>(() => ({
    renderedElements: new Map(),
    elementOrder: [],
  }))
  const scriptRunIdRef = useRef(scriptRunId)
  const previousNodesRef = useRef<AppNode[]>([])

  // Generate stable keys for nodes
  const getNodeKey = useCallback((node: AppNode, index: number): string => {
    if (node instanceof ElementNode) {
      const element = node.element
      const elementType = element.type || "element"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const elementId = (element as any)[elementType]?.id
      if (elementId) {
        return elementId
      }
      // Fallback to type + content hash
      const contentKey =
        elementType + "-" + index + "-" + node.scriptRunId.slice(-8)
      return contentKey
    } else if (node instanceof BlockNode) {
      return `block-${index}-${node.scriptRunId.slice(-8)}`
    }
    return `node-${index}`
  }, [])

  useEffect(() => {
    if (!enableReconciliation) {
      return
    }

    // Detect script run change
    const isNewScriptRun = scriptRunIdRef.current !== scriptRunId
    if (isNewScriptRun) {
      // Clean up elements from previous script run that are no longer present
      setState(prevState => {
        const newRenderedElements = new Map(prevState.renderedElements)
        const currentNodeKeys = new Set(
          nodes.map((node, idx) => getNodeKey(node, idx))
        )

        // Remove elements that weren't rendered in the new script run
        for (const [key, elementData] of newRenderedElements) {
          if (
            !currentNodeKeys.has(key) &&
            elementData.lastSeen !== Date.now()
          ) {
            newRenderedElements.delete(key)
          }
        }

        return {
          ...prevState,
          renderedElements: newRenderedElements,
        }
      })
      scriptRunIdRef.current = scriptRunId
    }

    // Update state with current nodes
    setState(prevState => {
      const newRenderedElements = new Map(prevState.renderedElements)
      const newElementOrder: string[] = []
      const now = Date.now()

      nodes.forEach((node, index) => {
        const key = getNodeKey(node, index)
        newElementOrder.push(key)

        // Update or add the element
        const existingElement = newRenderedElements.get(key)
        if (!existingElement || existingElement.node !== node) {
          newRenderedElements.set(key, {
            node,
            element: renderChild(node, key),
            lastSeen: now,
          })
        } else {
          // Update last seen time
          existingElement.lastSeen = now
        }
      })

      // Mark elements as hidden if they're not in the current node list
      for (const [key, elementData] of newRenderedElements) {
        if (!newElementOrder.includes(key)) {
          // Keep the element but mark when it was last seen
          elementData.lastSeen = now - 1
        }
      }

      return {
        renderedElements: newRenderedElements,
        elementOrder: newElementOrder,
      }
    })

    previousNodesRef.current = nodes
  }, [nodes, renderChild, scriptRunId, enableReconciliation, getNodeKey])

  if (!enableReconciliation) {
    // Fallback to normal rendering without reconciliation
    return (
      <>
        {nodes.map((node, index) => (
          <React.Fragment key={getNodeKey(node, index)}>
            {renderChild(node, getNodeKey(node, index))}
          </React.Fragment>
        ))}
      </>
    )
  }

  // Render all elements, hiding those not in the current order
  const allElements: ReactNode[] = []
  const renderedKeys = new Set<string>()

  // First, render elements in their current order
  state.elementOrder.forEach(key => {
    const elementData = state.renderedElements.get(key)
    if (elementData) {
      renderedKeys.add(key)
      allElements.push(
        <ReconcilerChild
          key={key}
          node={elementData.node}
          isHidden={false}
          renderChild={renderChild}
        />
      )
    }
  })

  // Then, render hidden elements (to preserve their state)
  for (const [key, elementData] of state.renderedElements) {
    if (!renderedKeys.has(key)) {
      allElements.push(
        <ReconcilerChild
          key={key}
          node={elementData.node}
          isHidden={true}
          renderChild={renderChild}
        />
      )
    }
  }

  return <>{allElements}</>
}

export default VirtualReconciler
