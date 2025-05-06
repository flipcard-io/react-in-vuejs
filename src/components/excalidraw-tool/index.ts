import React from "react";
import {
  ExcaldrawToolComponent
} from "@/components/excalidraw-tool/components/ExcaldrawToolComponent.tsx";
import type {
  ExcaldrawToolReactProps
} from "@/components/excalidraw-tool/model/ExcaldrawToolReactProps.ts";

export const createExcaldrawReactComponent = ({
                                                onChange,
                                                onHeightChange,
                                                height,
                                                data,
                                                isResizable
                                              }: ExcaldrawToolReactProps) => {
  console.log('ExcaldrawToolComponent props:', { onChange, onHeightChange, isResizable });
  console.log('Type of onChange:', typeof onChange);
  console.log('Type of onHeightChange:', typeof onHeightChange);
  return React.createElement(ExcaldrawToolComponent, {
    height: height,
    data: data,
    onChange: onChange,
    onHeightChange: onHeightChange,
    isResizable: isResizable
  } as ExcaldrawToolReactProps)
}
