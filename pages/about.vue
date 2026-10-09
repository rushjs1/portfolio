<script setup lang="ts">
useSeoMeta({
  title: 'About'
})

const interests = ['3D Art', 'Guitar & Piano', 'Music Production', 'Game Development']

const facts = [
  { label: 'Based in', value: 'Indianapolis, IN' },
  { label: 'Company', value: 'E-gineering', href: 'https://www.e-gineering.com/' },
]
</script>

<template>
  <div class="flex flex-col items-start w-full">
    <div class="flex flex-col items-start w-full space-y-3">
      <div class="flex items-center space-x-4 w-full">
        <BackButton />
        <span class="text-5xl font-bold"> About Me </span>
      </div>
      <span class="bg-yellow-400 rounded-full h-2 w-44"></span>
    </div>

    <div class="w-full mt-6 mb-20 grid md:grid-cols-[14rem_1fr] gap-8">
      <aside class="flex flex-col">
        <div
          v-for="(fact, idx) in facts"
          :key="fact.label"
          :class="idx !== 0 && 'border-t border-white/10 mt-4 pt-4'"
          class="flex flex-col gap-1"
        >
          <div class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">{{ fact.label }}</div>
          <div class="text-lg font-semibold tracking-tight">
            <NuxtLink
              v-if="fact.href"
              :to="fact.href"
              target="_blank"
              external
              class="inline-flex items-center gap-1 hover:text-yellow-400 transition-colors"
            >
              {{ fact.value }}
              <Icon name="heroicons-outline:external-link" size="0.9em"/>
            </NuxtLink>
            <template v-else>{{ fact.value }}</template>
          </div>
        </div>
      </aside>

      <div class="flex flex-col gap-6 md:border-l md:border-white/10 md:pl-8">
        <p class="text-lg text-pretty max-w-[60ch]">
          Outside of my professional endeavors I enjoy spending time with family and friends, watching sports, gaming, exercising and learning new things about programming.
        </p>

        <p class="text-lg text-pretty max-w-[60ch]">
          Want to collaborate or just talk shop? Check out my <NuxtLink to="/projects"><u>projects</u></NuxtLink> or reach out <NuxtLink to="/contact"><u>here</u></NuxtLink>.
        </p>

        <div class="flex flex-col gap-3">
          <div class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">Also into</div>
          <ul role="list" class="flex flex-wrap gap-2">
            <li
              v-for="interest in interests"
              :key="interest"
              class="text-sm rounded-md px-3 py-1 bg-white/10 ring-1 ring-white/15"
            >
              {{ interest }}
            </li>
          </ul>
        </div>

        <div class="flex items-center gap-5 pt-2">
          <div class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">Connect</div>
          <div class="flex items-center space-x-3">
            <SocialMediaButton to="https://github.com/rushjs1" aria-label="Github for John Rush">
              <Icon name="bi:github" size="1.5em" color="black" mode="svg" />
            </SocialMediaButton>
            <SocialMediaButton to="https://www.linkedin.com/in/john-rush-6680101a4" aria-label="linkedin for John Rush">
              <Icon name="logos:linkedin-icon" size="1.5em" mode="svg"/>
            </SocialMediaButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
