<template>
  <div class="relative min-h-screen">
    <div v-if="!confirmed" class="flex items-center justify-center min-h-screen p-8">
      <div class="max-w-2xl text-center space-y-8">
        <div class="space-y-4">
          <div class="flex items-center justify-center gap-3 mb-6">
            <h1 class="text-6xl font-bold bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              MapChain
            </h1>
          </div>
          <p class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            The World's First Truly Decentralized Map
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Experience the future of mapping. Powered by blockchain thoughts,
            verified by positive energy. Give away your location data control
            and embrace true decentralization.
          </p>
        </div>

        <div class="flex flex-col items-center gap-4">
          <UButton @click="handleConfirm" size="xl" class="px-12 py-4 cursor-pointer">
            <span class="flex items-center gap-2 text-lg">
              <UIcon name="i-lucide-rocket" class="w-5 h-5" />
              Launch Decentralized Map
            </span>
          </UButton>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <ClientOnly>
              {{ nodeCount.toLocaleString() }} nodes online • 99.9% uptime
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center space-y-4">
        <UIcon name="i-lucide-loader-circle" class="w-16 h-16 mx-auto animate-spin text-primary" />
        <p class="text-xl text-gray-600 dark:text-gray-400">Connecting to blockchain nodes...</p>
        <p class="text-sm text-gray-500">Verifying location consensus...</p>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center min-h-screen p-8">
      <div class="text-center space-y-4 max-w-md">
        <UIcon name="i-lucide-alert-circle" class="w-16 h-16 mx-auto text-red-500" />
        <p class="text-xl text-red-600 dark:text-red-400">{{ error }}</p>
        <UButton @click="requestLocation" size="lg">Retry Connection</UButton>
      </div>
    </div>

    <div v-else class="relative">
      <div ref="mapContainer" class="w-full h-screen"></div>

      <div class="z-401 absolute top-6 left-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 max-w-sm">
        <div class="flex items-center gap-3 mb-2">
          <UIcon name="i-lucide-map" class="w-6 h-6 text-primary" />
          <span class="font-bold text-lg">MapChain Protocol</span>
        </div>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Latitude:</span>
            <span class="font-mono font-semibold">{{ displayLocation.lat.toFixed(6) }}°</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Longitude:</span>
            <span class="font-mono font-semibold">{{ displayLocation.lng.toFixed(6) }}°</span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400">Status:</span>
            <div class="flex items-center gap-1.5">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span class="font-semibold text-green-600">Decentralized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapContainer = ref<HTMLElement | null>(null)
const confirmed = ref(false)
const loading = ref(false)
const error = ref('')
const displayLocation = ref({ lat: 0, lng: 0 })
const nodeCount = ref(Math.floor(Math.random() * 1000 + 5000))

let map: any = null
let marker: any = null
let nodeInterval: ReturnType<typeof setInterval> | null = null

const OFFSET = {
  lat: (Math.random() - 0.5) * 0.1,
  lng: (Math.random() - 0.5) * 0.1
}

const handleConfirm = () => {
  confirmed.value = true
  requestLocation()
}

const requestLocation = async () => {
  error.value = ''
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    const actualLat = position.coords.latitude
    const actualLng = position.coords.longitude

    displayLocation.value = {
      lat: actualLat + OFFSET.lat,
      lng: actualLng + OFFSET.lng
    }

    loading.value = false

    nextTick(() => {
      initMap()
    })
  } catch (err: any) {
    error.value = err.message || 'Failed to connect to blockchain network'
    loading.value = false
  }
}

const initMap = () => {
  if (!mapContainer.value || map) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(link)

  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.async = true
  script.defer = true

  script.onload = () => {
    const L = (window as any).L
    if (!L) {
      error.value = 'Failed to load blockchain map renderer'
      return
    }

    map = L.map(mapContainer.value).setView([displayLocation.value.lat, displayLocation.value.lng], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Powered by MapChain Protocol',
      maxZoom: 19
    }).addTo(map)

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })

    const markerOffset = 0.0025

    marker = L.marker([displayLocation.value.lat - markerOffset, displayLocation.value.lng + markerOffset], {
      icon: customIcon,
      title: 'Your Decentralized Location 🌐'
    }).addTo(map)

    L.circle([displayLocation.value.lat - markerOffset, displayLocation.value.lng + markerOffset], {
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.2,
      radius: 50
    }).addTo(map)
  }

  script.onerror = () => {
    error.value = 'Failed to load blockchain map renderer'
  }

  document.head.appendChild(script)
}

onMounted(() => {
  nodeInterval = setInterval(() => {
    nodeCount.value = Math.floor(Math.random() * 1000 + 5000)
  }, 2000)
})

onUnmounted(() => {
  if (nodeInterval) {
    clearInterval(nodeInterval)
  }
})
</script>
