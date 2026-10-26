export default defineNuxtPlugin(() => {
  if (import.meta.dev || window.location.hostname !== 'rushjsdev.com') {
    return;
  }

  useHead({
    script: [
      {
        key: 'cloudflare-analytics',
        type: 'module',
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        'data-cf-beacon': JSON.stringify({
          token: 'c660dc96198e41968994e7612077e7bd',
        }),
        tagPosition: 'bodyClose',
      },
    ],
  });
});
