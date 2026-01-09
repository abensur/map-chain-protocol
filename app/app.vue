<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'MapChain Protocol - The World\'s First Decentralized Map'
const description = 'Experience the future of mapping. Powered by blockchain technology, verified by thousands of nodes. 100% decentralized, immutable, and censorship-resistant location data.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://mapchain.netlify.app/og-image.png',
  ogUrl: 'https://mapchain.netlify.app',
  ogType: 'website',
  ogLogo: 'https://mapchain.netlify.app/favicon.svg',
  twitterImage: 'https://mapchain.netlify.app/og-image.png',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description
})
</script>

<template>
  <UApp>
    <NuxtPage />

    <!-- Floating Dark Mode Toggle -->
    <div class="fixed bottom-6 right-6 z-50">
      <UColorModeButton size="lg" />
    </div>
  </UApp>
</template>
