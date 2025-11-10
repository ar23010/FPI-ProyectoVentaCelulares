<template>
  <q-page padding>
  
    <div v-if="product === undefined" class="text-center q-pa-xl">
      <q-spinner-dots size="50px" color="primary" />
      <div class="text-h6 text-white q-mt-md">Cargando producto...</div>
    </div>

  
    <div v-else-if="product === null" class="text-center q-pa-xl">
      <q-icon name="error_outline" size="4rem" color="grey-5" />
      <div class="text-h6 text-white q-mt-md">Producto no encontrado</div>
      <div class="text-body2 text-grey-5 q-mb-md">
        El producto que buscas no existe o ha sido eliminado
      </div>
      <q-btn
        unelevated
        color="primary"
        label="Volver a productos"
        @click="router.push('/productos')"
      />
    </div>

   
    <div v-else class="row q-col-gutter-lg">
  
      <div class="col-12 col-md-6">
        <q-card flat bordered class="dark-card">
         
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
            >
              <q-img
                :src="img"
                fit="contain"
                height="400px"
                class="full-width"
                spinner-color="primary"
              />
            </q-carousel-slide>
          </q-carousel>
          
         
          <div v-else class="product-detail-no-image">
            <q-icon name="phone_android" size="8rem" color="grey-6" />
            <div class="text-h6 text-grey-5 q-mt-md">Sin imagen disponible</div>
            <div class="text-caption text-grey-6 q-mt-sm">
            
            </div>
          </div>
        </q-card>
      </div>

  
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

         
            <div class="q-mb-md">
              <div class="text-h6 q-mb-sm text-white">Descripción</div>
              <p class="text-body1 text-grey-5">{{ product.description }}</p>
            </div>

            <q-separator class="q-my-md" />

          
            <div class="q-mb-md">
              <div class="text-h6 q-mb-sm text-white">Vendedor</div>
              <div class="row items-center q-gutter-sm">
                <q-avatar size="50px" color="primary" text-color="white">
                  V
                </q-avatar>
                <div>
                  <div class="text-subtitle1 text-white">Vendedor Anonimo</div>
                  <div class="text-caption text-grey-5">
                    <q-icon name="star" color="orange" size="xs" />
                    4.5 (10 reseñas)
                  </div>
                </div>
              </div>
            </div>

           
            <div class="q-mt-lg q-gutter-sm">
              <q-btn
                unelevated
                color="positive"
                size="lg"
                :label="cartStore.isInCart(product.id) ? 'Ya en carrito' : 'Agregar al carrito'"
                :icon="cartStore.isInCart(product.id) ? 'check' : 'shopping_cart'"
                class="full-width q-mb-sm"
                :disable="cartStore.isInCart(product.id)"
                @click="addToCart"
              />
              <q-btn
                unelevated
                color="primary"
                size="lg"
                label="Contactar vendedor"
                icon="message"
                class="full-width q-mb-sm"
                @click="contactSeller"
              />
            
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

   
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

    
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocument, useCollection } from 'vuefire'
import { doc, collection } from 'firebase/firestore'
import { db } from 'boot/firebase'
import { useCartStore } from 'src/stores/carrito'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const currentSlide = ref(0)
const showContactDialog = ref(false)
const contactMessage = ref('')



const productId = computed(() => route.params.id)


const product = useDocument(() => 
  productId.value ? doc(db, 'Celulares', productId.value) : null
)


const allProducts = useCollection(collection(db, "Celulares"))


const similarProducts = computed(() => {
  if (!product.value || !allProducts.value) return []
  
  return allProducts.value
    .filter(p => 
      p.id !== productId.value && 
      p.brand === product.value.brand
    )
    .slice(0, 4)
})



const addToCart = () => {
  if (product.value && !cartStore.isInCart(product.value.id)) {
    cartStore.addToCart(product.value)
    console.log('Producto agregado al carrito:', product.value.name)
  }
}

const toggleFavorite = () => {
  console.log('Producto agregado/quitado de favoritos')
}

const contactSeller = () => {
  showContactDialog.value = true
}


const sendMessage = () => {
  if (!contactMessage.value) {
    
    return
  }

 
  
  showContactDialog.value = false
  contactMessage.value = ''
}



const goToProduct = (id) => {
  router.push(`/producto/${id}`)
  window.scrollTo(0, 0)
}
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


.body--dark .product-detail-no-image {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%);
  border-radius: 20px;
}


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
