import type {ExcalidrawInitialDataState} from "@excalidraw/excalidraw/types";

export interface ExcaldrawToolReactProps {
  height: number;
  data?: ExcalidrawInitialDataState | null; // Add initial data prop
  onChange: (result: ExcalidrawInitialDataState) => void; // Callback to pass data up
  onHeightChange: (height: number) => void; // Callback to pass height up
  isResizable: boolean; // Optional prop to control resizing
}
