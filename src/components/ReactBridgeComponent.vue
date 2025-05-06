<script setup lang="ts">
import React from "react";
import ReactDOM from "react-dom/client";
import {onBeforeUnmount, onMounted, ref} from "vue";

const props = defineProps<{
  component?: React.ReactNode
}>()

const container = ref<HTMLElement | null>(null)
const root = ref<ReactDOM.Root | null>(null)

const initialize = (component?: React.ReactNode) => {
  if (container.value && component) {
    try {
      root.value = ReactDOM.createRoot(container.value);
      root.value.render(component);
    } catch (error) {
      console.log("Failed to load react component: ", error);
    }
  } else {
    console.error("Failed to load react component: ", component);
  }
}

const unmount = () => {
  if (root.value) {
    root.value.unmount();
    root.value = null;
  }
}

onMounted(() => {
  initialize(props.component)
})

onBeforeUnmount(() => {
  unmount();
})

</script>

<template>
  <div ref="container"></div>
</template>

<style scoped>

</style>
