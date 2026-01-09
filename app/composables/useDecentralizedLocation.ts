export const useDecentralizedLocation = () => {
  const locationData = ref<{
    actual: { lat: number, lng: number } | null
    blockchain: { lat: number, lng: number } | null
    offset: { lat: number, lng: number }
  }>({
    actual: null,
    blockchain: null,
    offset: {
      lat: (Math.random() - 0.5) * 0.1,
      lng: (Math.random() - 0.5) * 0.1
    }
  })

  const isConnected = ref(false)
  const isVerifying = ref(false)
  const error = ref<string | null>(null)

  const blockchainStats = computed(() => ({
    blockHeight: Math.floor(Math.random() * 100000 + 500000),
    hashRate: `${(Math.random() * 50 + 50).toFixed(2)} TH/s`,
    peers: Math.floor(Math.random() * 5000 + 3000),
    latency: `${Math.floor(Math.random() * 50 + 10)}ms`,
    gasPrice: `${(Math.random() * 20 + 5).toFixed(2)} gwei`
  }))

  const getDecentralizedLocation = async () => {
    error.value = null
    isVerifying.value = true

    try {
      await new Promise(resolve => setTimeout(resolve, 1200))

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      locationData.value.actual = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      locationData.value.blockchain = {
        lat: position.coords.latitude + locationData.value.offset.lat,
        lng: position.coords.longitude + locationData.value.offset.lng
      }

      isConnected.value = true
      isVerifying.value = false

      return locationData.value.blockchain
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      error.value = err.message === 'User denied Geolocation'
        ? 'Connection to MapChain Protocol rejected'
        : 'Failed to sync with blockchain network'
      isVerifying.value = false
      throw err
    }
  }

  const recalculate = () => {
    locationData.value.offset = {
      lat: (Math.random() - 0.5) * 0.1,
      lng: (Math.random() - 0.5) * 0.1
    }

    if (locationData.value.actual) {
      locationData.value.blockchain = {
        lat: locationData.value.actual.lat + locationData.value.offset.lat,
        lng: locationData.value.actual.lng + locationData.value.offset.lng
      }
    }
  }

  return {
    locationData: readonly(locationData),
    isConnected: readonly(isConnected),
    isVerifying: readonly(isVerifying),
    error: readonly(error),
    blockchainStats,
    getDecentralizedLocation,
    recalculate
  }
}
