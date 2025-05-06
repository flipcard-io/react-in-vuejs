<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from "vue";
import type {ExcalidrawInitialDataState} from "@excalidraw/excalidraw/types";
import React from "react";
import {watchDebounced} from "@vueuse/core";
import type {
  ExcaldrawToolComponentProps
} from "@/components/excalidraw-tool/model/ExcaldrawToolComponentProps.ts";
import type {
  ExcaldrawToolReactProps
} from "@/components/excalidraw-tool/model/ExcaldrawToolReactProps.ts";
import {createExcaldrawReactComponent} from "@/components/excalidraw-tool/index.ts";
import ReactBridgeComponent from "@/components/ReactBridgeComponent.vue";

const props = defineProps<ExcaldrawToolComponentProps>()

const emit = defineEmits<{
  (e: 'changed', data: ExcalidrawInitialDataState): void;
  (e: 'heightChanged', height: number): void;
}>();

const isFullscreen = ref(false)
const nonFullscreenHeight = ref(props.height)

const createProps = (): ExcaldrawToolReactProps => {
  const result = {
    height: props.height,
    data: props.data,
    isResizable: !isFullscreen.value
  } as ExcaldrawToolReactProps

  result.onChange = (newData: ExcalidrawInitialDataState) => {
    emit('changed', newData)
    result.data = newData
  }

  result.onHeightChange = (height: number) => {
    if (!isFullscreen.value) {
      emit('heightChanged', height)
      result.height = height
      nonFullscreenHeight.value = height
    }
  }

  return result
}

const reactProps = ref<ExcaldrawToolReactProps>(createProps())

const component = ref<React.ReactNode | undefined>(undefined)

const updateToWindowDimensions = () => {
  if (isFullscreen.value) {
    reactProps.value.height = window.innerHeight - 50
  }
}

// Set up resize listener
onMounted(() => {
  window.addEventListener('resize', updateToWindowDimensions)
})

// Clean up resize listener
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateToWindowDimensions)
})

watchDebounced(() => reactProps.value, (newValue: ExcaldrawToolReactProps) => {
  component.value = createExcaldrawReactComponent(newValue)
}, {immediate: true, deep: true, debounce: 200})

</script>

<template>
    <ReactBridgeComponent :component="component"></ReactBridgeComponent>
</template>

<style scoped>

</style>
