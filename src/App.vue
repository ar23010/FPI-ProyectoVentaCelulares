<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted, watch } from 'vue'

const $q = useQuasar()

// Función para aplicar el tema basado en la preferencia
const applyTheme = (mode) => {
  if (mode === 'auto') {
    // Usar preferencia del sistema
    $q.dark.set('auto')
  } else if (mode === 'dark') {
    $q.dark.set(true)
  } else {
    $q.dark.set(false)
  }
  
  // Aplicar clase al body para estilos personalizados
  document.body.classList.remove('body--dark', 'body--light')
  if (mode === 'auto') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.body.classList.add(isDark ? 'body--dark' : 'body--light')
  } else {
    document.body.classList.add(mode === 'dark' ? 'body--dark' : 'body--light')
  }
}

// Cargar preferencia guardada o usar 'auto' por defecto
onMounted(() => {
  const savedTheme = localStorage.getItem('theme-mode') || 'auto'
  applyTheme(savedTheme)
  
  // Escuchar cambios en la preferencia del sistema cuando está en modo auto
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    const currentMode = localStorage.getItem('theme-mode') || 'auto'
    if (currentMode === 'auto') {
      document.body.classList.remove('body--dark', 'body--light')
      document.body.classList.add(e.matches ? 'body--dark' : 'body--light')
    }
  })
})

// Observar cambios en dark mode de Quasar
watch(() => $q.dark.isActive, (isDark) => {
  const currentMode = localStorage.getItem('theme-mode') || 'auto'
  if (currentMode === 'auto') {
    document.body.classList.remove('body--dark', 'body--light')
    document.body.classList.add(isDark ? 'body--dark' : 'body--light')
  }
})
</script>
