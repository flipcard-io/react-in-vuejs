import React, {useCallback, useEffect, useRef, useState} from "react";
import {type JSX} from "react";
import {Excalidraw} from "@excalidraw/excalidraw";

import type {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import type {AppState, BinaryFiles, ExcalidrawInitialDataState} from "@excalidraw/excalidraw/types";
import {debounce} from "lodash";
import type {
  ExcaldrawToolReactProps
} from "@/components/excalidraw-tool/model/ExcaldrawToolReactProps.ts";

export const ExcaldrawToolComponent = ({
                                         height,
                                         data,
                                         onChange,
                                         onHeightChange,
                                         isResizable
                                       }: ExcaldrawToolReactProps): JSX.Element => {

  const containerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable div

// Effect to observe resize changes
  useEffect(() => {
    if (!isResizable) return; // Skip observation if resizing is disabled

    const element = containerRef.current;
    if (!element) return; // Exit if the element is not yet available

    // Create a ResizeObserver instance
    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0]; // Get the first entry
      if (!entry.contentRect) return; // Exit if contentRect is not available
      onHeightChange(entry.contentRect.height);
    });

    // Start observing the div element
    resizeObserver.observe(element);

    // Cleanup function: disconnect the observer when the component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, [isResizable]); // Add isResizable to dependencies

  // Handle changes in the Excalidraw component and update state/notify parent
  const handleChange = useCallback((
    elements: readonly OrderedExcalidrawElement[],
    state: AppState,
    files: BinaryFiles
  ) => {
    // create a partial AppState without collaborators property, because it is posing some issues
    // when we are trying to serialize the object
    //https://github.com/excalidraw/excalidraw/issues/8637
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {collaborators, ...appStateWithoutCollaborators} = state;
    const result: ExcalidrawInitialDataState = {
      appState: appStateWithoutCollaborators,
      elements: elements,
      files: files,
      source: "excalidraw",
      scrollToContent: true,
      type: "excalidraw"
    };
    onChange(result)
  }, [onChange]);

  return (
    <div
      className={'border rounded-2'}
      ref={containerRef}
      style={{
        height: `${height}px`,
        overflowY: "scroll", // Keep scroll for content overflow
        resize: isResizable ? "vertical" : "none",  // Add CSS resize property
        minHeight: "100px", // Optional: Set a minimum height
        maxHeight: "2000px"  // Optional: Set a maximum height
      }}
    >
      <Excalidraw
        initialData={data}
        onChange={debounce(handleChange, 300)}
      />
    </div>
  );
};
