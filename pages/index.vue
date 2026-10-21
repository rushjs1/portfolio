<script setup lang="ts">
useSeoMeta({
  title: 'Home',
  ogDescription: 'I am a web developer from Indianapolis, Indiana. Lets get in touch!'
})
</script>

<template>
  <div class="relative shadow-lg group shrink-0 h-32 w-32 p-1 rounded-lg">
    <div
      class="bg-slate-300 absolute animate-pulse-slow blur-2xl group-hover:blur-3xl transition-all duration-200 top-1 left-1 inset-0 w-32 h-32"
    ></div>

    <NuxtImg
      src="/london_4.png"
      alt="Home image"
      class="ring-[2px] rounded-lg h-full w-full absolute object-cover ring-white/20"
      width="128"
      height="128"
      format="webp"
      sizes="128px"
      densities="x1 x2"
      fetchpriority="high"
      preload
    />
  </div>
  <span class="text-white text-3xl font-bold md:text-6xl sm:text-5xl">
    John Rush
  </span>
  <!-- <span class="text-md md:text-xl">
    I am a Software Engineer from <b>Indianapolis, Indiana</b> with a passion for
    building secure and user friendly web applications.
  </span> -->
  <span class="text-md md:text-xl">
    Full-stack software engineer with a passion for building secure, thoughtfully crafted software that feels great to use.
  </span>

  <div class="flex items-center space-x-3">
    <SocialMediaButton to="https://github.com/rushjs1" aria-label="Github for John Rush">
      <Icon name="bi:github" size="1.5em" color="black" mode="svg"/>
    </SocialMediaButton>

    <SocialMediaButton to="https://www.linkedin.com/in/john-rush-6680101a4" aria-label="linkedin for John Rush">
      <Icon name="logos:linkedin-icon" size="1.5em" mode="svg"/>
    </SocialMediaButton>
  </div>
  <div class="flex items-center space-x-4">
      <NuxtLink
        to="/projects"
        class="gradient p-0.5 rounded-lg group"
      >
      <div class="flex grow-0 text-sm items-center bg-black/90 px-8 py-2 rounded-md relative">
        <span class="group-hover:-translate-x-4 duration-200 ease-out">
          Explore Projects
        </span>
        <IconArrowRight
          class="text-white absolute right-4 transition-all w-4 h-4 group-hover:opacity-100 opacity-0 duration-300"
        />
      </div>
      </NuxtLink>

    <NuxtLink to="/about" class="group">
      <span class="text-sm p-1 bg-left-bottom bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"> About Me </span>
    </NuxtLink>
  </div>
</template>

<style>
.gradient {
	background: linear-gradient(45deg, #f8e42e, #ff7d54);
}

.gradient:hover {
	background: linear-gradient(45deg, #f8e42e, #ff7d54, #f8e42e, #ff7d54, #f8e42e, #ff7d54, #f8e42e, #ff7d54);
	background-size: 400% 400%;
	animation: gradient .5s ease-out 1.5 alternate;
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	100% {
		background-position: 100% 50%;
	}
}
</style>
