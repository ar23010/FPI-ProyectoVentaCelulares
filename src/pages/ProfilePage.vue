<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <!-- Información del perfil -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="dark-card">
          <q-card-section class="text-center">
            <q-avatar size="120px" color="primary" text-color="white">
              <img v-if="user.avatar" :src="user.avatar" />
              <span v-else class="text-h3">{{ user.initials }}</span>
            </q-avatar>
            
            <div class="text-h5 text-white q-mt-md">{{ user.name }}</div>
            <div class="text-body2 text-grey-5">{{ user.email }}</div>
            
            <q-btn
              flat
              color="primary"
              icon="edit"
              label="Editar perfil"
              class="q-mt-md"
              @click="showEditDialog = true"
            />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 text-white q-mb-md">Estadísticas</div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="stat-box">
                  <div class="text-h4 text-primary">{{ user.stats.sales }}</div>
                  <div class="text-caption text-grey-5">Ventas</div>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-box">
                  <div class="text-h4 text-primary">{{ user.stats.purchases }}</div>
                  <div class="text-caption text-grey-5">Compras</div>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-box">
                  <div class="text-h4 text-primary">{{ user.stats.favorites }}</div>
                  <div class="text-caption text-grey-5">Favoritos</div>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-box">
                  <div class="text-h4 text-primary">{{ user.rating }}</div>
                  <div class="text-caption text-grey-5">Calificación</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 text-white q-mb-md">Información de contacto</div>
            <q-list>
              <q-item dense>
                <q-item-section avatar>
                  <q-icon name="phone" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Teléfono</q-item-label>
                  <q-item-label class="text-white">{{ user.phone }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section avatar>
                  <q-icon name="location_on" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Ubicación</q-item-label>
                  <q-item-label class="text-white">{{ user.location }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section avatar>
                  <q-icon name="calendar_today" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Miembro desde</q-item-label>
                  <q-item-label class="text-white">{{ user.memberSince }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tabs de contenido -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="dark-card">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="products" icon="inventory_2" label="Mis productos" />
            <q-tab name="favorites" icon="favorite" label="Favoritos" />
            <q-tab name="reviews" icon="star" label="Reseñas" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- Mis productos -->
            <q-tab-panel name="products">
              <div class="text-h6 text-white q-mb-md">Productos publicados</div>
              
              <div class="row q-col-gutter-md">
                <div
                  v-for="product in myProducts"
                  :key="product.id"
                  class="col-12 col-sm-6"
                >
                  <q-card flat bordered class="product-card">
                    <q-img
                      :src="product.image"
                      :ratio="16/9"
                      spinner-color="primary"
                    >
                      <div class="absolute-top-right q-ma-sm">
                        <q-badge :color="product.status === 'active' ? 'positive' : 'grey'">
                          {{ product.status === 'active' ? 'Activo' : 'Vendido' }}
                        </q-badge>
                      </div>
                    </q-img>
                    <q-card-section>
                      <div class="text-subtitle1 text-white">{{ product.name }}</div>
                      <div class="text-h6 text-primary">${{ product.price }}</div>
                      <div class="text-caption text-grey-5 q-mt-sm">
                        <q-icon name="visibility" size="xs" />
                        {{ product.views }} vistas
                      </div>
                    </q-card-section>
                    <q-card-actions>
                      <q-btn flat color="primary" label="Editar" icon="edit" size="sm" />
                      <q-btn flat color="negative" label="Eliminar" icon="delete" size="sm" />
                    </q-card-actions>
                  </q-card>
                </div>
              </div>

              <div v-if="myProducts.length === 0" class="text-center q-pa-xl">
                <q-icon name="inventory_2" size="4rem" color="grey-5" />
                <div class="text-h6 text-white q-mt-md">No tienes productos publicados</div>
                <q-btn
                  unelevated
                  color="primary"
                  label="Publicar producto"
                  icon="add"
                  class="q-mt-md"
                  to="/vender"
                />
              </div>
            </q-tab-panel>

            <!-- Favoritos -->
            <q-tab-panel name="favorites">
              <div class="text-h6 text-white q-mb-md">Productos favoritos</div>
              
              <q-list separator>
                <q-item
                  v-for="favorite in favorites"
                  :key="favorite.id"
                  clickable
                >
                  <q-item-section avatar>
                    <q-avatar rounded>
                      <img :src="favorite.image" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-white">{{ favorite.name }}</q-item-label>
                    <q-item-label caption>{{ favorite.brand }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-h6 text-primary">${{ favorite.price }}</div>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      color="red"
                      icon="favorite"
                      @click.stop="removeFavorite(favorite.id)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>

              <div v-if="favorites.length === 0" class="text-center q-pa-xl">
                <q-icon name="favorite_border" size="4rem" color="grey-5" />
                <div class="text-h6 text-white q-mt-md">No tienes favoritos</div>
              </div>
            </q-tab-panel>

            <!-- Reseñas -->
            <q-tab-panel name="reviews">
              <div class="text-h6 text-white q-mb-md">Reseñas recibidas</div>
              
              <div class="row items-center q-mb-md">
                <div class="col-auto">
                  <div class="text-h3 text-primary">{{ user.rating }}</div>
                </div>
                <div class="col q-ml-md">
                  <q-rating
                    v-model="user.rating"
                    size="2em"
                    color="primary"
                    readonly
                  />
                  <div class="text-caption text-grey-5">{{ user.totalReviews }} reseñas</div>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <q-list separator>
                <q-item v-for="review in reviews" :key="review.id">
                  <q-item-section>
                    <div class="row items-center q-mb-sm">
                      <div class="text-subtitle2 text-white">{{ review.author }}</div>
                      <q-space />
                      <q-rating
                        :model-value="review.rating"
                        size="sm"
                        color="primary"
                        readonly
                      />
                    </div>
                    <q-item-label caption class="text-grey-5">
                      {{ review.comment }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-6 q-mt-xs">
                      {{ review.date }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <div v-if="reviews.length === 0" class="text-center q-pa-xl">
                <q-icon name="star_border" size="4rem" color="grey-5" />
                <div class="text-h6 text-white q-mt-md">No tienes reseñas</div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <!-- Diálogo de edición de perfil -->
    <q-dialog v-model="showEditDialog">
      <q-card class="dark-card" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6 text-white">Editar perfil</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="editUser.name"
            filled
            label="Nombre completo"
          />
          <q-input
            v-model="editUser.phone"
            filled
            label="Teléfono"
            mask="####-####"
          />
          <q-input
            v-model="editUser.location"
            filled
            label="Ubicación"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn unelevated label="Guardar" color="primary" @click="saveProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const tab = ref('products')
const showEditDialog = ref(false)

// Mock de datos del usuario
const user = ref({
  name: 'Juan Pérez',
  initials: 'JP',
  email: 'juan.perez@email.com',
  phone: '7234-5678',
  location: 'San Salvador',
  avatar: null,
  memberSince: 'Enero 2024',
  rating: 4.8,
  totalReviews: 24,
  stats: {
    sales: 15,
    purchases: 8,
    favorites: 12
  }
})

const editUser = ref({ ...user.value })

// Mock de productos del usuario
const myProducts = ref([
  {
    id: 1,
    name: 'iPhone 14 Pro Max',
    price: 1200,
    image: 'https://placehold.co/600x400/3498db/ffffff?text=iPhone+14',
    status: 'active',
    views: 145
  },
  {
    id: 2,
    name: 'Samsung Galaxy S22',
    price: 850,
    image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Galaxy+S22',
    status: 'sold',
    views: 89
  }
])

// Mock de favoritos
const favorites = ref([
  {
    id: 1,
    name: 'iPhone 13',
    brand: 'Apple',
    price: 750,
    image: 'https://placehold.co/100x100/3498db/ffffff?text=iPhone'
  },
  {
    id: 2,
    name: 'Xiaomi 13 Pro',
    brand: 'Xiaomi',
    price: 800,
    image: 'https://placehold.co/100x100/e74c3c/ffffff?text=Xiaomi'
  },
  {
    id: 3,
    name: 'OnePlus 11',
    brand: 'OnePlus',
    price: 650,
    image: 'https://placehold.co/100x100/9b59b6/ffffff?text=OnePlus'
  }
])

// Mock de reseñas
const reviews = ref([
  {
    id: 1,
    author: 'María González',
    rating: 5,
    comment: 'Excelente vendedor, el producto llegó en perfecto estado y tal como se describía.',
    date: 'Hace 2 días'
  },
  {
    id: 2,
    author: 'Carlos Ramírez',
    rating: 5,
    comment: 'Muy profesional y rápido en la entrega. Totalmente recomendado.',
    date: 'Hace 1 semana'
  },
  {
    id: 3,
    author: 'Ana López',
    rating: 4,
    comment: 'Buena comunicación, el teléfono estaba en buen estado.',
    date: 'Hace 2 semanas'
  }
])

// Funciones
const removeFavorite = (id) => {
  const index = favorites.value.findIndex(f => f.id === id)
  if (index !== -1) {
    favorites.value.splice(index, 1)
    $q.notify({
      message: 'Eliminado de favoritos',
      color: 'info',
      icon: 'favorite_border',
      position: 'top'
    })
  }
}

const saveProfile = () => {
  user.value = { ...editUser.value }
  showEditDialog.value = false
  $q.notify({
    message: 'Perfil actualizado',
    color: 'positive',
    icon: 'check',
    position: 'top'
  })
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

.stat-box {
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.body--light .stat-box {
  background: rgba(59, 130, 246, 0.05);
}

.product-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.body--light .product-card {
  background: #f8fafc !important;
  border: 1px solid rgba(59, 130, 246, 0.15) !important;
}
</style>
