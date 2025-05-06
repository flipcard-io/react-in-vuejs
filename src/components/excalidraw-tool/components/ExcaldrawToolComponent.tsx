import React, {useCallback, useEffect, useRef} from "react";
import {type JSX} from "react";
import {Excalidraw} from "@excalidraw/excalidraw";

import type {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import type {AppState, BinaryFiles, ExcalidrawInitialDataState} from "@excalidraw/excalidraw/types";
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

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isResizable) return;

    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry.contentRect) return;
      onHeightChange(entry.contentRect.height);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isResizable]);

  const handleChange = useCallback((
    elements: readonly OrderedExcalidrawElement[],
    state: AppState,
    files: BinaryFiles
  ) => {

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
        overflowY: "scroll",
        resize: isResizable ? "vertical" : "none",
        minHeight: "100px",
        maxHeight: "2000px"
      }}
    >
      <Excalidraw
        initialData={data}
        onChange={handleChange}
      />
    </div>
  );
};
