<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-grey-8">
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
              <q-item clickable v-close-popup>
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

        <q-item clickable v-close-popup>
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
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-grey-9 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <div class="row justify-center q-gutter-md q-py-md">
            <div class="col-12 col-sm-auto">
              <div class="text-weight-bold q-mb-sm">Acerca de</div>
              <div class="text-caption">Quiénes somos</div>
              <div class="text-caption">Términos y condiciones</div>
              <div class="text-caption">Política de privacidad</div>
            </div>
            <div class="col-12 col-sm-auto">
              <div class="text-weight-bold q-mb-sm">Ayuda</div>
              <div class="text-caption">Centro de ayuda</div>
              <div class="text-caption">Comprar</div>
              <div class="text-caption">Vender</div>
            </div>
            <div class="col-12 col-sm-auto">
              <div class="text-weight-bold q-mb-sm">Síguenos</div>
              <div class="q-gutter-sm">
                <q-btn round dense flat icon="facebook" />
                <q-btn round dense flat icon="email" />
                <q-btn round dense flat icon="phone" />
              </div>
            </div>
          </div>
          <q-separator class="q-my-sm" />
          <div class="text-caption q-py-sm">
            © 2025 CellPhone Market - El Salvador
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const searchText = ref('')

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
