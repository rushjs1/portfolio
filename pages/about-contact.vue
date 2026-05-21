<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

useSeoMeta({
  title: 'About + Contact',
})

const toast = useToast()
const isDisabled = ref(false)

const interests = [
  '3D Art',
  'Guitar & Piano',
  'Music Production',
  'Game Development',
]

const { meta, values, errors, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().nonempty(),
      email: z.string().nonempty().email(),
      message: z.string().nonempty(),
    }),
  ),
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [message, messageAttrs] = defineField('message')

async function submit() {
  isDisabled.value = true

  try {
    const res = await $fetch('/api/contact', {
      method: 'POST',
      body: values,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      toast.add({
        title: 'Thank you for your submission!',
        description: 'I will contact you about your inquiry as soon as I can.',
        timeout: 10000,
        icon: 'i-heroicons-check-circle-16-solid',
      })

      resetForm()
    }
  } catch (error) {
    toast.add({
      title: 'Error submitting inquiry.',
      description:
        'Please contact me via a different method, or try again later. <br /> <br/> I apologize for the inconvience.',
      timeout: 10000,
      icon: 'i-heroicons-x-circle-16-solid',
      color: 'red',
    })
    console.error('There was an error.', error)
  } finally {
    isDisabled.value = false
  }
}
</script>

<template>
  <div class="flex w-full flex-col items-start">
    <div class="flex w-full flex-col items-start space-y-3">
      <div class="flex w-full items-center space-x-4">
        <BackButton />
        <h1 class="text-5xl font-semibold tracking-tight text-balance">
          About + Contact
        </h1>
      </div>
      <span class="h-2 w-44 rounded-full bg-yellow-400"></span>
    </div>

    <div class="mt-6 mb-20 grid w-full gap-8 md:grid-cols-[14rem_1fr]">
      <aside class="flex flex-col">
        <div class="flex flex-col gap-1">
          <div
            class="text-xs font-mono uppercase tracking-[0.18em] text-white/50"
          >
            Email
          </div>
          <div class="break-all text-lg font-semibold tracking-tight">
            <NuxtLink
              to="mailto:rushjsdev@gmail.com"
              external
              class="inline-flex items-center gap-1 transition-colors hover:text-yellow-400"
            >
              rushjsdev@gmail.com
              <Icon name="heroicons-outline:external-link" size="0.9em" />
            </NuxtLink>
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-1 border-t border-white/10 pt-4">
          <div
            class="text-xs font-mono uppercase tracking-[0.18em] text-white/50"
          >
            Based in
          </div>
          <div class="text-lg font-semibold tracking-tight">
            Indianapolis, IN
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-1 border-t border-white/10 pt-4">
          <div
            class="text-xs font-mono uppercase tracking-[0.18em] text-white/50"
          >
            Company
          </div>
          <div class="text-lg font-semibold tracking-tight">
            <NuxtLink
              to="https://jacksonsystems.com/"
              target="_blank"
              external
              class="inline-flex items-center gap-1 transition-colors hover:text-yellow-400"
            >
              Jackson Systems
              <Icon name="heroicons-outline:external-link" size="0.9em" />
            </NuxtLink>
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
          <div
            class="text-xs font-mono uppercase tracking-[0.18em] text-white/50"
          >
            Also on
          </div>
          <div class="flex items-center gap-3">
            <SocialMediaButton
              to="https://github.com/rushjs1"
              aria-label="Github for John Rush"
            >
              <Icon name="bi:github" size="1.5em" color="black" mode="svg" />
            </SocialMediaButton>
            <SocialMediaButton
              to="https://www.linkedin.com/in/john-rush-6680101a4"
              aria-label="linkedin for John Rush"
            >
              <Icon name="logos:linkedin-icon" size="1.5em" mode="svg" />
            </SocialMediaButton>
          </div>
        </div>
      </aside>

      <div class="flex flex-col gap-6 md:border-l md:border-white/10 md:pl-8">
        <p class="max-w-[60ch] text-base text-pretty text-white/80 sm:text-lg">
          Outside of my professional endeavors I enjoy spending time with family
          and friends, watching sports, gaming, exercising and learning new
          things about programming.
        </p>

        <p class="max-w-[60ch] text-base text-pretty text-white/80 sm:text-lg">
          Want to collaborate or just talk shop? Check out my
          <NuxtLink to="/projects"><u>projects</u></NuxtLink> or reach out here.
        </p>

        <div class="flex flex-col gap-3">
          <div
            class="text-xs font-mono uppercase tracking-[0.18em] text-white/50"
          >
            Also into
          </div>
          <ul role="list" class="flex flex-wrap gap-2">
            <li
              v-for="interest in interests"
              :key="interest"
              class="rounded-md bg-white/10 px-3 py-1 text-sm ring-1 ring-white/15"
            >
              {{ interest }}
            </li>
          </ul>
        </div>

        <form
          @submit.prevent="submit"
          action="#"
          method="post"
          class="flex w-full flex-col gap-5"
        >
          <div class="flex flex-col gap-2">
            <label
              for="name"
              class="text-xs font-mono uppercase tracking-[0.18em] text-white/50"
              >Name</label
            >
            <input
              id="name"
              v-model="name"
              v-bind="nameAttrs"
              name="name"
              type="text"
              autocomplete="name"
              class="w-full rounded-md bg-white/[0.04] px-3 py-2.5 text-base outline-none ring-1 ring-white/10 placeholder:text-white/30 focus:ring-yellow-400/40"
              placeholder="Your name"
            />
            <p
              v-if="errors.name"
              class="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-red-400/80"
            >
              {{ errors.name }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="email"
              class="text-xs font-mono uppercase tracking-[0.18em] text-white/50"
              >Email</label
            >
            <input
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              name="email"
              type="email"
              autocomplete="email"
              class="w-full rounded-md bg-white/[0.04] px-3 py-2.5 text-base outline-none ring-1 ring-white/10 placeholder:text-white/30 focus:ring-yellow-400/40"
              placeholder="you@example.com"
            />
            <p
              v-if="errors.email"
              class="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-red-400/80"
            >
              {{ errors.email }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="message"
              class="text-xs font-mono uppercase tracking-[0.18em] text-white/50"
              >Message</label
            >
            <textarea
              id="message"
              v-model="message"
              v-bind="messageAttrs"
              name="message"
              rows="5"
              class="w-full resize-y rounded-md bg-white/[0.04] px-3 py-2.5 text-base outline-none ring-1 ring-white/10 placeholder:text-white/30 focus:ring-yellow-400/40"
              placeholder="What's on your mind?"
            ></textarea>
            <p
              v-if="errors.message"
              class="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-red-400/80"
            >
              {{ errors.message }}
            </p>
          </div>

          <div class="flex justify-end pt-1">
            <button
              type="submit"
              class="group inline-flex items-center gap-2 rounded-md bg-yellow-400 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="isDisabled || meta.valid === false"
            >
              Send Message
              <Icon
                name="heroicons:arrow-up-right"
                size="0.95em"
                class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
