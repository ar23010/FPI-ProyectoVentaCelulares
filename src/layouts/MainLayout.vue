<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-transparent text-white">
      <q-toolbar>
        <q-toolbar-title class="text-primary text-weight-bold cursor-pointer" @click="$router.push('/productos')">
          <q-icon name="phone_android" size="md" class="q-mr-sm" />
          CellPhone Market
        </q-toolbar-title>

        <!-- Barra de búsqueda en desktop -->
        <q-input
          dense
          standout
          v-model="searchText"
          placeholder="Buscar celulares..."
          class="gt-sm"
          style="width: 400px"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-space />

        <!-- Botones de navegación -->
        <q-btn
          flat
          dense
          label="Explorar"
          icon="explore"
          @click="$router.push('/productos')"
          class="gt-sm q-mr-sm"
        />

        <q-btn
          unelevated
          color="primary"
          label="Vender"
          icon="add"
          @click="$router.push('/vender')"
          class="q-mr-sm"
        />

        <q-btn
          flat
          dense
          round
          icon="favorite_border"
          class="q-mr-sm"
        >
          <q-badge color="red" floating>3</q-badge>
        </q-btn>

        <q-btn
          flat
          dense
          round
          icon="account_circle"
        >
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Mi perfil</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="shopping_bag" />
                </q-item-section>
                <q-item-section>Mis compras</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="sell" />
                </q-item-section>
                <q-item-section>Mis ventas</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="showSettingsDialog = true">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Configuración</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- Menú móvil -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>

      <!-- Barra de búsqueda en móvil -->
      <q-toolbar class="lt-md">
        <q-input
          dense
          standout
          v-model="searchText"
          placeholder="Buscar celulares..."
          class="full-width"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <!-- Drawer para móvil -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="lt-md"
    >
      <q-list>
        <q-item-label header class="text-primary text-weight-bold">
          Navegación
        </q-item-label>

        <q-item clickable @click="$router.push('/productos')" v-close-popup>
          <q-item-section avatar>
            <q-icon name="explore" />
          </q-item-section>
          <q-item-section>Explorar</q-item-section>
        </q-item>

        <q-item clickable @click="$router.push('/vender')" v-close-popup>
          <q-item-section avatar>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>Vender</q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon name="favorite" />
          </q-item-section>
          <q-item-section>Favoritos</q-item-section>
          <q-item-section side>
            <q-badge color="red">3</q-badge>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header>Mi cuenta</q-item-label>

        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Mi perfil</q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon name="shopping_bag" />
          </q-item-section>
          <q-item-section>Mis compras</q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon name="sell" />
          </q-item-section>
          <q-item-section>Mis ventas</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable @click="showSettingsDialog = true" v-close-popup>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Configuración</q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Cerrar sesión</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      
      <!-- Footer movido dentro del page-container para que aparezca al final -->
      <footer class="footer-section">
        <div class="footer-content">
          <div class="row justify-center q-gutter-md q-py-lg">
            <div class="col-12 col-sm-auto text-center">
              <div class="text-weight-bold q-mb-sm text-white">Acerca de</div>
              <div class="text-caption text-grey-5">Quiénes somos</div>
              <div class="text-caption text-grey-5">Términos y condiciones</div>
              <div class="text-caption text-grey-5">Política de privacidad</div>
            </div>
            <div class="col-12 col-sm-auto text-center">
              <div class="text-weight-bold q-mb-sm text-white">Ayuda</div>
              <div class="text-caption text-grey-5">Centro de ayuda</div>
              <div class="text-caption text-grey-5">Comprar</div>
              <div class="text-caption text-grey-5">Vender</div>
            </div>
            <div class="col-12 col-sm-auto text-center">
              <div class="text-weight-bold q-mb-sm text-white">Síguenos</div>
              <div class="q-gutter-sm">
                <q-btn round dense flat icon="facebook" color="white" />
                <q-btn round dense flat icon="email" color="white" />
                <q-btn round dense flat icon="phone" color="white" />
              </div>
            </div>
          </div>
          <q-separator class="q-my-sm" style="background: rgba(100, 181, 246, 0.3)" />
          <div class="text-caption q-py-md text-center text-grey-5">
            © 2025 CellPhone Market - El Salvador
          </div>
        </div>
      </footer>
    </q-page-container>

    <!-- Diálogo de Configuración -->
    <q-dialog v-model="showSettingsDialog">
      <q-card style="min-width: 400px" class="settings-card">
        <q-card-section>
          <div class="text-h5 text-white">
            <q-icon name="settings" class="q-mr-sm" />
            Configuración
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle1 text-white q-mb-md">
            <q-icon name="palette" class="q-mr-sm" />
            Apariencia
          </div>

          <q-option-group
            v-model="themeMode"
            :options="themeOptions"
            color="primary"
            @update:model-value="changeTheme"
            class="theme-options"
          >
            <template v-slot:label="opt">
              <div class="row items-center full-width">
                <q-icon :name="opt.icon" size="sm" class="q-mr-md" />
                <div class="col">
                  <div class="text-white">{{ opt.label }}</div>
                  <div class="text-caption text-grey-5">{{ opt.description }}</div>
                </div>
              </div>
            </template>
          </q-option-group>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const leftDrawerOpen = ref(false)
const searchText = ref('')
const showSettingsDialog = ref(false)
const themeMode = ref('auto')

const themeOptions = [
  {
    label: 'Automático',
    value: 'auto',
    icon: 'brightness_auto',
    description: 'Usar tema del sistema'
  },
  {
    label: 'Modo claro',
    value: 'light',
    icon: 'light_mode',
    description: 'Tema claro siempre'
  },
  {
    label: 'Modo oscuro',
    value: 'dark',
    icon: 'dark_mode',
    description: 'Tema oscuro siempre'
  }
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function changeTheme(mode) {
  // Guardar preferencia
  localStorage.setItem('theme-mode', mode)
  
  // Aplicar tema
  if (mode === 'auto') {
    $q.dark.set('auto')
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.body.classList.remove('body--dark', 'body--light')
    document.body.classList.add(isDark ? 'body--dark' : 'body--light')
  } else if (mode === 'dark') {
    $q.dark.set(true)
    document.body.classList.remove('body--dark', 'body--light')
    document.body.classList.add('body--dark')
  } else {
    $q.dark.set(false)
    document.body.classList.remove('body--dark', 'body--light')
    document.body.classList.add('body--light')
  }
  
  $q.notify({
    message: `Tema cambiado a: ${themeOptions.find(opt => opt.value === mode).label}`,
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
    timeout: 2000
  })
}

onMounted(() => {
  // Cargar preferencia guardada
  const savedTheme = localStorage.getItem('theme-mode') || 'auto'
  themeMode.value = savedTheme
})
</script>

<style scoped lang="scss">
.footer-section {
  margin-top: 4rem;
  padding: 0;
  background: linear-gradient(0deg, #0f172a 0%, #1e3a8a 100%);
  border-top: none;
  box-shadow: 
    0 -8px 16px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(100, 181, 246, 0.1) inset;
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.settings-card {
  .theme-options {
    .q-radio {
      width: 100%;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 8px;
      transition: background-color 0.15s ease;
      
      &:hover {
        background: rgba(30, 58, 138, 0.12);
      }
    }
  }
}

.body--light .settings-card {
  .theme-options .q-radio:hover {
    background: rgba(30, 58, 138, 0.1);
  }
}
</style>
