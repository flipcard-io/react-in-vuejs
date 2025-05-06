<script setup lang="ts">
import { createReactHelloWorldComponent } from "./components/utils";
import ReactBridgeComponent from "@/components/ReactBridgeComponent.vue";
import {ref} from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
const component = ref(createReactHelloWorldComponent());
</script>

<template>
  <header>
  </header>

  <main>
    <HelloWorld message="Vuejs component" />
    <ReactBridgeComponent :component="component" />
  </main>
</template>

<style scoped>
</style>
