<template>
  <q-page padding>
    <div v-if="product" class="row q-col-gutter-lg">
      <!-- Galería de imágenes -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-carousel
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
        </q-card>
      </div>

      <!-- Información del producto -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h4">{{ product.name }}</div>
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
              <div class="text-h6 q-mb-sm">Especificaciones</div>
              <q-list dense>
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
              <div class="text-h6 q-mb-sm">Descripción</div>
              <p class="text-body1">{{ product.description }}</p>
            </div>

            <q-separator class="q-my-md" />

            <!-- Información del vendedor -->
            <div class="q-mb-md">
              <div class="text-h6 q-mb-sm">Vendedor</div>
              <div class="row items-center q-gutter-sm">
                <q-avatar size="50px" color="primary" text-color="white">
                  {{ product.seller.name.charAt(0) }}
                </q-avatar>
                <div>
                  <div class="text-subtitle1">{{ product.seller.name }}</div>
                  <div class="text-caption text-grey">
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
      <div class="text-h5 q-mb-md">Productos similares</div>
      <div class="row q-col-gutter-md">
        <div
          v-for="similar in similarProducts"
          :key="similar.id"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card
            class="cursor-pointer"
            @click="goToProduct(similar.id)"
          >
            <q-img :src="similar.image" :ratio="4/3" />
            <q-card-section>
              <div class="text-subtitle1">{{ similar.name }}</div>
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
  
  // Datos de ejemplo
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
      description: 'Samsung Galaxy S23 Ultra 512GB nuevo. Cámara de 200MP, S Pen incluido, batería de 5000mAh.',
      images: [
        'https://placehold.co/800x600/2ecc71/ffffff?text=Galaxy+S23+1',
        'https://placehold.co/800x600/2ecc71/ffffff?text=Galaxy+S23+2'
      ],
      seller: {
        name: 'María González',
        rating: 4.9,
        reviews: 67
      }
    }
  ]

  product.value = mockProducts.find(p => p.id === productId) || mockProducts[0]
  
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
