<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

useSeoMeta({
  title: 'Contact'
})

const toast = useToast()
const isDisabled = ref(false)

const { meta, values, errors, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().nonempty(),
      email: z.string().nonempty().email(),
      message: z.string().nonempty(),
    })
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
        callback: () => {
          isDisabled.value = false
        },
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
      callback: () => {
        isDisabled.value = false
      },
    })
    console.error('There was an error.', error)
  }
}
</script>

<template>
  <div class="flex flex-col items-start w-full">
    <div class="flex flex-col items-start w-full space-y-3">
      <div class="flex items-center space-x-4 w-full">
        <BackButton />
        <span class="text-5xl font-bold"> Contact </span>
      </div>
      <span class="bg-yellow-400 rounded-full h-2 w-44"></span>
    </div>

    <div class="w-full mt-6 mb-20 grid md:grid-cols-[14rem_1fr] gap-8">
      <aside class="flex flex-col">
        <div class="flex flex-col gap-1">
          <div class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">Email</div>
          <div class="text-lg font-semibold tracking-tight break-all">
            <NuxtLink
              to="mailto:rushjsdev@gmail.com"
              external
              class="inline-flex items-center gap-1 hover:text-yellow-400 transition-colors"
            >
              rushjsdev@gmail.com
              <Icon name="heroicons-outline:external-link" size="0.9em" />
            </NuxtLink>
          </div>
        </div>

        <div class="flex flex-col gap-1 border-t border-white/10 mt-4 pt-4">
          <div class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">Based in</div>
          <div class="text-lg font-semibold tracking-tight">Indianapolis, IN</div>
        </div>

        <div class="flex flex-col gap-2 border-t border-white/10 mt-4 pt-4">
          <div class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">Also on</div>
          <div class="flex items-center gap-3">
            <SocialMediaButton to="https://github.com/rushjs1" aria-label="Github for John Rush">
              <Icon name="bi:github" size="1.5em" color="black" mode="svg" />
            </SocialMediaButton>
            <SocialMediaButton to="https://www.linkedin.com/in/john-rush-6680101a4" aria-label="linkedin for John Rush">
              <Icon name="logos:linkedin-icon" size="1.5em" mode="svg" />
            </SocialMediaButton>
          </div>
        </div>
      </aside>

      <div class="flex flex-col gap-6 md:border-l md:border-white/10 md:pl-8">
        <p class="text-lg text-pretty max-w-[60ch] text-white/80">
          Got an idea, or a problem you want a second pair of eyes on? Drop a note and I'll get back to you.
        </p>

        <form @submit.prevent="submit" action="#" method="post" class="flex flex-col gap-5 w-full">
          <div class="flex flex-col gap-2">
            <label for="name" class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">Name</label>
            <input
              v-model="name"
              v-bind="nameAttrs"
              id="name"
              class="bg-white/[0.04] ring-1 ring-white/10 focus:ring-yellow-400/40 rounded-md w-full px-3 py-2.5 outline-none placeholder:text-white/30"
              placeholder="Your name"
            />
            <p v-if="errors.name" class="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-red-400/80">{{ errors.name }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">Email</label>
            <input
              v-model="email"
              v-bind="emailAttrs"
              id="email"
              class="bg-white/[0.04] ring-1 ring-white/10 focus:ring-yellow-400/40 rounded-md w-full px-3 py-2.5 outline-none placeholder:text-white/30"
              placeholder="you@example.com"
            />
            <p v-if="errors.email" class="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-red-400/80">{{ errors.email }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <label for="message" class="text-xs font-mono uppercase tracking-[0.18em] text-white/50">Message</label>
            <textarea
              v-model="message"
              v-bind="messageAttrs"
              id="message"
              rows="5"
              class="bg-white/[0.04] ring-1 ring-white/10 focus:ring-yellow-400/40 rounded-md w-full px-3 py-2.5 outline-none placeholder:text-white/30 resize-y"
              placeholder="What's on your mind?"
            ></textarea>
            <p v-if="errors.message" class="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-red-400/80">{{ errors.message }}</p>
          </div>

          <div class="flex justify-end pt-1">
            <button
              type="submit"
              class="group inline-flex items-center gap-2 rounded-md bg-yellow-400 text-black font-mono text-xs uppercase tracking-[0.18em] px-4 py-2.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
              :disabled="isDisabled || meta.valid === false"
            >
              Send Message
              <Icon name="heroicons:arrow-up-right" size="0.95em" class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
