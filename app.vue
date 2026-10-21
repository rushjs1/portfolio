<script setup lang="ts">
useSeoMeta({
  titleTemplate: 'John Rush | %s',
  themeColor: '#161616',
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator :throttle="100" color="#facc15" :height="1.5" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
