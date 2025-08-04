# Tech Spec: Preserving React Component State During Element Reordering

## Problem Statement

In Streamlit, when new elements are added to the same level of the delta path during a rerun, existing elements can get unmounted and remounted by React's reconciliation process. This happens because React keys are often based on array indices, causing components to lose their internal state when their position changes.

Currently, this is handled by reconstructing widget state from the WidgetStateManager, but this approach has limitations:

- Only widget state is preserved, not other React component state
- Performance overhead from state reconstruction
- Potential flickering or UI disruptions
- Loss of DOM state (scroll positions, focus, etc.)

## Proposed Solution: Virtual DOM Reconciliation

Implement a virtual reconciliation layer that temporarily hides components instead of unmounting them when their position changes, preserving all React state until we're certain they won't be re-rendered.

### Key Components

#### 1. VirtualReconciler Component (`VirtualReconciler.tsx`)

A wrapper component that manages the lifecycle of child components:

```typescript
interface ReconcilerState {
  renderedElements: Map<string, {
    node: AppNode
    element: ReactNode
    lastSeen: number
  }>
  elementOrder: string[]
}
```

**Features:**

- Maintains a map of all rendered components with their stable keys
- Hides components (using `display: none`) instead of unmounting when removed
- Only unmounts components after script run completion if they weren't re-rendered
- Tracks component order for proper visual arrangement

#### 2. Stable Key Generation (`elementKey.ts`)

Generate content-based keys that remain stable across re-renders:

```typescript
export function generateStableElementKey(
  element: Element,
  deltaPath: number[],
  scriptRunId: string
): string
```

**Key Generation Priority:**

1. Use explicit element ID if available (for widgets)
2. Generate hash based on element type and content
3. Include position hint for uniqueness
4. Append script run ID suffix for disambiguation

#### 3. Integration with Block Renderer

Update `Block.tsx` to use the VirtualReconciler:

- Replace array index-based keys with stable keys
- Wrap child rendering in VirtualReconciler
- Enable/disable reconciliation based on block type (e.g., forms handle their own state)

## Implementation Details

### State Preservation Strategy

1. **Initial Render**: Components are rendered normally and added to the reconciler's map
2. **Element Insertion**:
   - New elements get new keys and are rendered
   - Existing elements keep their keys and remain mounted
   - React doesn't see position changes as identity changes
3. **Temporary Hiding**: Elements not in current render are hidden but kept in DOM
4. **Cleanup**: After script run completes, remove components that weren't re-rendered

### Benefits

1. **Complete State Preservation**:
   - React component state (`useState`, `useRef`, etc.)
   - DOM state (scroll positions, focus, selections)
   - Event listeners and effect cleanup functions
   - Animation states

2. **Better Performance**:
   - No state reconstruction overhead
   - Reduced re-rendering
   - Smoother animations and transitions

3. **Improved UX**:
   - No flickering when elements reorder
   - Maintains user interactions (e.g., expanded/collapsed states)
   - Preserves form input states

### Considerations

1. **Memory Usage**: Hidden components remain in memory
   - Mitigation: Clean up after each script run
   - Only affects components at the same tree level

2. **CSS Implications**: Using `display: contents` for wrapper
   - Preserves layout flow
   - Doesn't affect styling of child components

3. **Backward Compatibility**:
   - Falls back to normal rendering when disabled
   - Forms and other special components can opt out
   - No changes to public API

## Alternative Approaches Considered

1. **React.memo with Custom Comparison**:
   - Pros: Built-in React feature
   - Cons: Only prevents re-renders, doesn't preserve position-based state

2. **Portal-based Rendering**:
   - Pros: Complete control over DOM position
   - Cons: Complex implementation, potential styling issues

3. **Extended Widget State Manager**:
   - Pros: Builds on existing system
   - Cons: Limited to serializable state, doesn't preserve DOM state

## Rollout Plan

1. **Phase 1**: Implement behind feature flag
   - Test with common use cases
   - Monitor performance metrics

2. **Phase 2**: Enable for specific components
   - Start with stateful widgets
   - Gradually expand coverage

3. **Phase 3**: General availability
   - Enable by default
   - Provide opt-out mechanism for edge cases

## Success Metrics

- Reduction in component remounts during reruns
- Decreased time spent in state reconstruction
- Improved user satisfaction scores for interactive apps
- No regression in memory usage or performance
