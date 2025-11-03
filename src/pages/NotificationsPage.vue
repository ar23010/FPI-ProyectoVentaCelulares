<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="dark-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h4 text-white">Notificaciones</div>
              <q-btn
                flat
                dense
                label="Marcar todo como leído"
                color="primary"
                @click="markAllAsRead"
                :disable="unreadCount === 0"
              />
            </div>
            <div class="text-body2 text-grey-5 q-mt-sm">
              {{ unreadCount }} notificaciones sin leer
            </div>
          </q-card-section>

          <q-separator />

          <!-- Tabs para filtrar notificaciones -->
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="all" label="Todas" />
            <q-tab name="favorites" label="Favoritos" />
            <q-tab name="offers" label="Ofertas" />
            <q-tab name="messages" label="Mensajes" />
          </q-tabs>

          <q-separator />

          <!-- Lista de notificaciones -->
          <q-list separator>
            <q-item
              v-for="notification in filteredNotifications"
              :key="notification.id"
              clickable
              :class="{ 'notification-unread': !notification.read }"
              @click="markAsRead(notification.id)"
            >
              <q-item-section avatar>
                <q-avatar :color="getIconColor(notification.type)" text-color="white">
                  <q-icon :name="getIcon(notification.type)" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-white">{{ notification.title }}</q-item-label>
                <q-item-label caption class="text-grey-5">
                  {{ notification.message }}
                </q-item-label>
                <q-item-label caption class="text-grey-6 q-mt-xs">
                  <q-icon name="schedule" size="xs" />
                  {{ notification.time }}
                </q-item-label>
              </q-item-section>

              <q-item-section side v-if="!notification.read">
                <q-badge color="primary" rounded />
              </q-item-section>

              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                  color="grey"
                  @click.stop
                >
                  <q-menu>
                    <q-list style="min-width: 150px">
                      <q-item clickable v-close-popup @click="markAsRead(notification.id)">
                        <q-item-section>Marcar como leída</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteNotification(notification.id)">
                        <q-item-section class="text-negative">Eliminar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Mensaje cuando no hay notificaciones -->
          <div v-if="filteredNotifications.length === 0" class="text-center q-pa-xl">
            <q-icon name="notifications_off" size="4rem" color="grey-5" />
            <div class="text-h6 text-white q-mt-md">
              No tienes notificaciones
            </div>
            <div class="text-body2 text-grey-5">
              Te notificaremos sobre ofertas, mensajes y actualizaciones
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const tab = ref('all')

// Mock de notificaciones
const notifications = ref([
  {
    id: 1,
    type: 'favorite',
    title: 'Nuevo favorito disponible',
    message: 'El iPhone 13 que agregaste a favoritos bajó de precio: $800 → $750',
    time: 'Hace 5 minutos',
    read: false,
    category: 'favorites'
  },
  {
    id: 2,
    type: 'offer',
    title: 'Oferta recibida',
    message: 'Carlos Méndez te hizo una oferta de $550 por tu Samsung Galaxy S22',
    time: 'Hace 1 hora',
    read: false,
    category: 'offers'
  },
  {
    id: 3,
    type: 'message',
    title: 'Nuevo mensaje',
    message: 'Ana López: "¿El teléfono incluye el cargador original?"',
    time: 'Hace 2 horas',
    read: false,
    category: 'messages'
  },
  {
    id: 4,
    type: 'favorite',
    title: 'Producto vendido',
    message: 'El Xiaomi 13 Pro que tenías en favoritos fue vendido',
    time: 'Hace 3 horas',
    read: true,
    category: 'favorites'
  },
  {
    id: 5,
    type: 'sale',
    title: '¡Venta exitosa!',
    message: 'Tu iPhone 14 Pro Max fue vendido. El comprador iniciará el pago.',
    time: 'Hace 5 horas',
    read: true,
    category: 'offers'
  },
  {
    id: 6,
    type: 'message',
    title: 'Mensaje leído',
    message: 'Roberto Flores leyó tu mensaje sobre el Motorola Edge 40',
    time: 'Ayer',
    read: true,
    category: 'messages'
  },
  {
    id: 7,
    type: 'offer',
    title: 'Oferta rechazada',
    message: 'Tu oferta de $480 por el OnePlus 11 fue rechazada',
    time: 'Hace 2 días',
    read: true,
    category: 'offers'
  },
  {
    id: 8,
    type: 'favorite',
    title: 'Nuevo producto favorito',
    message: 'Hay nuevos productos que podrían interesarte: Samsung Galaxy S24 Ultra',
    time: 'Hace 3 días',
    read: true,
    category: 'favorites'
  }
])

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const filteredNotifications = computed(() => {
  if (tab.value === 'all') {
    return notifications.value
  }
  return notifications.value.filter(n => n.category === tab.value)
})

// Funciones
const getIcon = (type) => {
  const icons = {
    favorite: 'favorite',
    offer: 'local_offer',
    message: 'message',
    sale: 'sell',
    system: 'info'
  }
  return icons[type] || 'notifications'
}

const getIconColor = (type) => {
  const colors = {
    favorite: 'red',
    offer: 'green',
    message: 'blue',
    sale: 'purple',
    system: 'grey'
  }
  return colors[type] || 'grey'
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  $q.notify({
    message: 'Todas las notificaciones marcadas como leídas',
    color: 'positive',
    icon: 'check',
    position: 'top'
  })
}

const deleteNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
    $q.notify({
      message: 'Notificación eliminada',
      color: 'info',
      icon: 'delete',
      position: 'top'
    })
  }
}
</script>

<style scoped lang="scss">
.dark-card {
  background: #0a0e1a !important;
  border-radius: 20px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.body--light .dark-card {
  background: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(59, 130, 246, 0.2) !important;
}

.notification-unread {
  background: rgba(255, 255, 255, 0.03);
}

.body--light .notification-unread {
  background: rgba(59, 130, 246, 0.05);
}
</style>
