<script setup lang="ts">
import ReactBridgeComponent from "@/components/ReactBridgeComponent.vue";
import {createExcaldrawReactComponent} from "@/components/excalidraw-tool";
import type {
  ExcaldrawToolReactProps
} from "@/components/excalidraw-tool/model/ExcaldrawToolReactProps.ts";
import type {ExcalidrawInitialDataState} from "@excalidraw/excalidraw/types";

const component = createExcaldrawReactComponent({
  onHeightChange: (height: number) => {
    console.log("Height changed to: ", height);
  },
  onChange: (data: ExcalidrawInitialDataState) => {
    console.log("Data changed to: ", data);
  },
  height: 500,
  isResizable: true
} as ExcaldrawToolReactProps);
</script>

<template>
  <header>
  </header>

  <main>
    <ReactBridgeComponent :component="component"/>
  </main>
</template>

<style scoped>
</style>
