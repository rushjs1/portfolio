export default defineNuxtPlugin(() => {
  if (import.meta.dev || window.location.hostname !== 'rushjsdev.com') {
    return;
  }

  const preference = new URLSearchParams(window.location.search).get('analytics');
  const storageKey = 'portfolio:analytics-disabled';

  try {
    if (preference === 'off') {
      localStorage.setItem(storageKey, 'true');
      return;
    }

    if (preference === 'on') {
      localStorage.removeItem(storageKey);
    }

    if (localStorage.getItem(storageKey) === 'true') {
      return;
    }
  } catch {
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
