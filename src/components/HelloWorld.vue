<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div>
    <h1>Hello World</h1>
    <p>This is a simple {{ message }}.</p>
  </div>
</template>

<style scoped>

</style>
