<script setup lang="ts">
const toast = useToast()

onUnmounted(() => toast.clear())
</script>

<template>
  <UNotifications />
</template>
