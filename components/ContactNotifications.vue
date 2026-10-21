<script setup lang="ts">
const toast = useToast()

onUnmounted(() => toast.clear())
</script>

<template>
  <UNotifications>
    <template #title="{ title }">
      <span v-html="title" />
    </template>
    <template #description="{ description }">
      <span v-html="description" />
    </template>
  </UNotifications>
</template>
