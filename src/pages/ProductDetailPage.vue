<template>
  <q-page padding>
    <div v-if="product" class="row q-col-gutter-lg">
      <!-- Galería de imágenes o placeholder -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="dark-card">
          <!-- Carousel si hay imágenes -->
          <q-carousel
            v-if="product.images && product.images.length > 0"
            v-model="currentSlide"
            animated
            navigation
            infinite
            :autoplay="5000"
            arrows
            height="400px"
            class="rounded-borders"
          >
            <q-carousel-slide
              v-for="(img, index) in product.images"
              :key="index"
              :name="index"
              :img-src="img"
            />
          </q-carousel>
          
          <!-- Placeholder si no hay imágenes -->
          <div v-else class="product-detail-no-image">
            <q-icon name="phone_android" size="8rem" color="grey-6" />
            <div class="text-h6 text-grey-5 q-mt-md">Sin imagen disponible</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              Integración con Firebase próximamente
            </div>
          </div>
        </q-card>
      </div>

      <!-- Información del producto -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="dark-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h4 text-white">{{ product.name }}</div>
              <q-btn
                flat
                round
                color="red"
                icon="favorite_border"
                @click="toggleFavorite"
              />
            </div>

            <div class="text-h3 text-primary q-mb-md">
              ${{ product.price.toLocaleString() }}
            </div>

            <q-separator class="q-my-md" />

            <!-- Especificaciones -->
            <div class="q-mb-md">
              <div class="text-h6 q-mb-sm text-white">Especificaciones</div>
              <q-list dense dark>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Marca</q-item-label>
                    <q-item-label>{{ product.brand }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Condición</q-item-label>
                    <q-item-label>
                      <q-badge :color="product.condition === 'Nuevo' ? 'positive' : 'info'">
                        {{ product.condition }}
                      </q-badge>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Almacenamiento</q-item-label>
                    <q-item-label>{{ product.storage }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>RAM</q-item-label>
                    <q-item-label>{{ product.ram }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Color</q-item-label>
                    <q-item-label>{{ product.color }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Ubicación</q-item-label>
                    <q-item-label>
                      <q-icon name="location_on" size="xs" />
                      {{ product.location }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <q-separator class="q-my-md" />

            <!-- Descripción -->
            <div class="q-mb-md">
              <div class="text-h6 q-mb-sm text-white">Descripción</div>
              <p class="text-body1 text-grey-5">{{ product.description }}</p>
            </div>

            <q-separator class="q-my-md" />

            <!-- Información del vendedor -->
            <div class="q-mb-md">
              <div class="text-h6 q-mb-sm text-white">Vendedor</div>
              <div class="row items-center q-gutter-sm">
                <q-avatar size="50px" color="primary" text-color="white">
                  {{ product.seller.name.charAt(0) }}
                </q-avatar>
                <div>
                  <div class="text-subtitle1 text-white">{{ product.seller.name }}</div>
                  <div class="text-caption text-grey-5">
                    <q-icon name="star" color="orange" size="xs" />
                    {{ product.seller.rating }} ({{ product.seller.reviews }} reseñas)
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="q-mt-lg q-gutter-sm">
              <q-btn
                unelevated
                color="primary"
                size="lg"
                label="Contactar vendedor"
                icon="message"
                class="full-width q-mb-sm"
                @click="contactSeller"
              />
              <q-btn
                outline
                color="primary"
                size="lg"
                label="Hacer una oferta"
                icon="local_offer"
                class="full-width"
                @click="makeOffer"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Productos similares -->
    <div class="q-mt-xl">
      <div class="text-h5 q-mb-md text-white">Productos similares</div>
      <div class="row q-col-gutter-md">
        <div
          v-for="similar in similarProducts"
          :key="similar.id"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card
            class="cursor-pointer dark-card"
            @click="goToProduct(similar.id)"
          >
            <q-img :src="similar.image" :ratio="4/3" />
            <q-card-section>
              <div class="text-subtitle1 text-white">{{ similar.name }}</div>
              <div class="text-h6 text-primary">${{ similar.price.toLocaleString() }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Diálogos -->
    <q-dialog v-model="showContactDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Contactar vendedor</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="contactMessage"
            type="textarea"
            filled
            label="Mensaje"
            rows="5"
            hint="Escribe tu mensaje al vendedor"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn unelevated label="Enviar" color="primary" @click="sendMessage" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showOfferDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Hacer una oferta</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body1 q-mb-md">
            Precio actual: <strong>${{ product?.price.toLocaleString() }}</strong>
          </div>
          <q-input
            v-model.number="offerAmount"
            type="number"
            filled
            prefix="$"
            label="Tu oferta"
            hint="Ingresa el monto que deseas ofrecer"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn unelevated label="Enviar oferta" color="primary" @click="submitOffer" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const currentSlide = ref(0)
const showContactDialog = ref(false)
const showOfferDialog = ref(false)
const contactMessage = ref('')
const offerAmount = ref(null)

// Datos del producto (en producción vendría de una API)
const product = ref(null)
const similarProducts = ref([])

const loadProduct = () => {
  const productId = parseInt(route.params.id)
  
  // Datos de ejemplo - deben coincidir con ProductListPage.vue
  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 14 Pro Max',
      brand: 'Apple',
      price: 1200,
      condition: 'Nuevo',
      storage: '256GB',
      ram: '6GB',
      color: 'Morado oscuro',
      location: 'San Salvador',
      description: 'iPhone 14 Pro Max 256GB completamente nuevo en caja sellada. Incluye cargador y audifonos. Garantía de 1 año. El dispositivo cuenta con Dynamic Island, chip A16 Bionic, sistema de cámara Pro de 48 MP y pantalla Super Retina XDR de 6.7 pulgadas.',
      images: [
        'https://placehold.co/800x600/3498db/ffffff?text=iPhone+14+Pro+1',
        'https://placehold.co/800x600/3498db/ffffff?text=iPhone+14+Pro+2',
        'https://placehold.co/800x600/3498db/ffffff?text=iPhone+14+Pro+3'
      ],
      seller: {
        name: 'Juan Pérez',
        rating: 4.8,
        reviews: 45
      }
    },
    {
      id: 2,
      name: 'Samsung Galaxy S23 Ultra',
      brand: 'Samsung',
      price: 1100,
      condition: 'Nuevo',
      storage: '512GB',
      ram: '12GB',
      color: 'Negro fantasma',
      location: 'Santa Ana',
      description: 'Samsung Galaxy S23 Ultra 512GB nuevo. Cámara de 200MP, S Pen incluido, batería de 5000mAh. Pantalla Dynamic AMOLED 2X de 6.8 pulgadas con 120Hz. Procesador Snapdragon 8 Gen 2.',
      images: [
        'https://placehold.co/800x600/2ecc71/ffffff?text=Galaxy+S23+1',
        'https://placehold.co/800x600/2ecc71/ffffff?text=Galaxy+S23+2',
        'https://placehold.co/800x600/2ecc71/ffffff?text=Galaxy+S23+3'
      ],
      seller: {
        name: 'María González',
        rating: 4.9,
        reviews: 67
      }
    },
    {
      id: 3,
      name: 'Xiaomi 13 Pro',
      brand: 'Xiaomi',
      price: 800,
      condition: 'Como nuevo',
      storage: '256GB',
      ram: '12GB',
      color: 'Negro',
      location: 'San Miguel',
      description: 'Xiaomi 13 Pro 256GB, usado solo 2 meses. Como nuevo, sin rayones ni golpes. Incluye caja original y todos los accesorios. Cámara Leica, procesador Snapdragon 8 Gen 2, pantalla AMOLED de 6.73 pulgadas.',
      images: [
        'https://placehold.co/800x600/e74c3c/ffffff?text=Xiaomi+13+1',
        'https://placehold.co/800x600/e74c3c/ffffff?text=Xiaomi+13+2',
        'https://placehold.co/800x600/e74c3c/ffffff?text=Xiaomi+13+3'
      ],
      seller: {
        name: 'Carlos Martínez',
        rating: 4.7,
        reviews: 32
      }
    },
    {
      id: 4,
      name: 'iPhone 13',
      brand: 'Apple',
      price: 850,
      condition: 'Usado - Buen estado',
      storage: '128GB',
      ram: '4GB',
      color: 'Azul',
      location: 'San Salvador',
      description: 'iPhone 13 128GB en excelente estado. Batería al 92%. Sin golpes ni rayones. Incluye cargador. Chip A15 Bionic, sistema de cámara dual, pantalla Super Retina XDR de 6.1 pulgadas.',
      images: [
        'https://placehold.co/800x600/9b59b6/ffffff?text=iPhone+13+1',
        'https://placehold.co/800x600/9b59b6/ffffff?text=iPhone+13+2'
      ],
      seller: {
        name: 'Ana López',
        rating: 4.6,
        reviews: 28
      }
    },
    {
      id: 5,
      name: 'Samsung Galaxy A54',
      brand: 'Samsung',
      price: 400,
      condition: 'Nuevo',
      storage: '128GB',
      ram: '8GB',
      color: 'Violeta',
      location: 'La Libertad',
      description: 'Samsung Galaxy A54 5G 128GB completamente nuevo en caja sellada. Cámara de 50MP, batería de 5000mAh, pantalla Super AMOLED de 6.4 pulgadas con 120Hz. Procesador Exynos 1380.',
      images: [
        'https://placehold.co/800x600/f39c12/ffffff?text=Galaxy+A54+1',
        'https://placehold.co/800x600/f39c12/ffffff?text=Galaxy+A54+2'
      ],
      seller: {
        name: 'Roberto Flores',
        rating: 4.8,
        reviews: 51
      }
    },
    {
      id: 6,
      name: 'Motorola Edge 40',
      brand: 'Motorola',
      price: 500,
      condition: 'Nuevo',
      storage: '256GB',
      ram: '8GB',
      color: 'Eclipse Black',
      location: 'Sonsonate',
      description: 'Motorola Edge 40 256GB nuevo en caja. Pantalla pOLED de 6.55 pulgadas con 144Hz, cámara de 50MP con OIS, procesador MediaTek Dimensity 8020, carga rápida de 68W.',
      images: [
        'https://placehold.co/800x600/1abc9c/ffffff?text=Moto+Edge+1',
        'https://placehold.co/800x600/1abc9c/ffffff?text=Moto+Edge+2'
      ],
      seller: {
        name: 'Luis Ramírez',
        rating: 4.7,
        reviews: 39
      }
    },
    {
      id: 7,
      name: 'OnePlus 11 Pro',
      brand: 'OnePlus',
      price: 650,
      condition: 'Como nuevo',
      storage: '256GB',
      ram: '12GB',
      color: 'Eternal Green',
      location: 'San Salvador',
      description: 'OnePlus 11 Pro 256GB en excelente estado, usado por 3 meses. Incluye cargador original de 100W, cable USB-C y caja. Pantalla AMOLED de 6.7 pulgadas con tecnología LTPO 3.0, cámara Hasselblad de 50MP con OIS. Procesador Snapdragon 8 Gen 2, batería de 5000mAh. Producto de prueba para integración con Firebase - imagen pendiente de subir.',
      images: null, // Producto de prueba sin imagen
      seller: {
        name: 'Carlos Méndez',
        rating: 4.9,
        reviews: 67
      }
    }
  ]

  product.value = mockProducts.find(p => p.id === productId)
  
  // Si no se encuentra el producto, mostrar error o redirigir
  if (!product.value) {
    $q.notify({
      message: 'Producto no encontrado',
      color: 'negative',
      position: 'top'
    })
    router.push('/productos')
    return
  }
  
  // Cargar productos similares
  similarProducts.value = mockProducts.filter(p => p.id !== productId).slice(0, 4)
}

const toggleFavorite = () => {
  $q.notify({
    message: 'Agregado a favoritos',
    color: 'positive',
    icon: 'favorite',
    position: 'top'
  })
}

const contactSeller = () => {
  showContactDialog.value = true
}

const makeOffer = () => {
  showOfferDialog.value = true
  offerAmount.value = Math.floor(product.value.price * 0.9)
}

const sendMessage = () => {
  if (!contactMessage.value) {
    $q.notify({
      message: 'Por favor escribe un mensaje',
      color: 'negative',
      position: 'top'
    })
    return
  }

  $q.notify({
    message: 'Mensaje enviado al vendedor',
    color: 'positive',
    icon: 'check',
    position: 'top'
  })
  
  showContactDialog.value = false
  contactMessage.value = ''
}

const submitOffer = () => {
  if (!offerAmount.value || offerAmount.value <= 0) {
    $q.notify({
      message: 'Ingresa un monto válido',
      color: 'negative',
      position: 'top'
    })
    return
  }

  $q.notify({
    message: `Oferta de $${offerAmount.value} enviada al vendedor`,
    color: 'positive',
    icon: 'check',
    position: 'top'
  })
  
  showOfferDialog.value = false
}

const goToProduct = (id) => {
  router.push(`/producto/${id}`)
  loadProduct()
  window.scrollTo(0, 0)
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped lang="scss">
.dark-card {
  background: #0a0e1a !important;
  border-radius: 20px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.9) !important;
    border-color: rgba(255, 255, 255, 0.15) !important;
  }
}

// Placeholder para detalle sin imagen - Modo Oscuro
.body--dark .product-detail-no-image {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%);
  border-radius: 20px;
}

// Placeholder para detalle sin imagen - Modo Claro
.body--light .product-detail-no-image {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 20px;
  
  .text-grey-5, .text-grey-6 {
    color: #64748b !important;
  }
}

.body--light .dark-card {
  background: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(59, 130, 246, 0.2) !important;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
    border-color: rgba(59, 130, 246, 0.3) !important;
  }
}
</style>
