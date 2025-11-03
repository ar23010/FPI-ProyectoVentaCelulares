<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <div class="text-h4 text-white q-mb-lg">Carrito de compras</div>

        <div class="row q-col-gutter-lg">
          <!-- Lista de productos en el carrito -->
          <div class="col-12 col-md-8">
            <q-card flat bordered class="dark-card">
              <q-card-section>
                <div class="row items-center justify-between">
                  <div class="text-h6 text-white">
                    {{ cartItems.length }} productos en tu carrito
                  </div>
                  <q-btn
                    flat
                    color="negative"
                    label="Vaciar carrito"
                    icon="delete_sweep"
                    @click="clearCart"
                    :disable="cartItems.length === 0"
                  />
                </div>
              </q-card-section>

              <q-separator />

              <!-- Items del carrito -->
              <q-list separator>
                <q-item v-for="item in cartItems" :key="item.id">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded>
                      <img :src="item.image" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-h6 text-white">{{ item.name }}</q-item-label>
                    <q-item-label caption class="text-grey-5">
                      {{ item.brand }} • {{ item.condition }}
                    </q-item-label>
                    <div class="row items-center q-mt-sm q-gutter-sm">
                      <q-chip
                        dense
                        icon="memory"
                        color="primary"
                        text-color="white"
                        size="sm"
                      >
                        {{ item.storage }}
                      </q-chip>
                      <q-chip
                        dense
                        icon="palette"
                        color="primary"
                        text-color="white"
                        size="sm"
                      >
                        {{ item.color }}
                      </q-chip>
                    </div>
                  </q-item-section>

                  <q-item-section side class="text-center">
                    <div class="text-h6 text-primary">${{ item.price }}</div>
                    <div class="q-mt-sm">
                      <q-btn
                        flat
                        round
                        dense
                        icon="remove"
                        color="grey"
                        size="sm"
                        @click="decreaseQuantity(item.id)"
                        :disable="item.quantity <= 1"
                      />
                      <span class="text-white q-mx-sm">{{ item.quantity }}</span>
                      <q-btn
                        flat
                        round
                        dense
                        icon="add"
                        color="grey"
                        size="sm"
                        @click="increaseQuantity(item.id)"
                      />
                    </div>
                    <q-btn
                      flat
                      dense
                      color="negative"
                      icon="delete"
                      label="Eliminar"
                      size="sm"
                      class="q-mt-sm"
                      @click="removeItem(item.id)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>

              <!-- Carrito vacío -->
              <div v-if="cartItems.length === 0" class="text-center q-pa-xl">
                <q-icon name="shopping_cart" size="5rem" color="grey-5" />
                <div class="text-h6 text-white q-mt-md">
                  Tu carrito está vacío
                </div>
                <div class="text-body2 text-grey-5 q-mb-md">
                  Explora nuestro catálogo y agrega productos
                </div>
                <q-btn
                  unelevated
                  color="primary"
                  label="Ver productos"
                  icon="store"
                  to="/productos"
                />
              </div>
            </q-card>

            <!-- Cupones y descuentos -->
            <q-card flat bordered class="dark-card q-mt-lg" v-if="cartItems.length > 0">
              <q-card-section>
                <div class="text-subtitle1 text-white q-mb-md">
                  <q-icon name="local_offer" color="primary" />
                  ¿Tienes un cupón?
                </div>
                <div class="row q-gutter-sm">
                  <q-input
                    v-model="couponCode"
                    filled
                    placeholder="Código de cupón"
                    class="col"
                  >
                    <template v-slot:prepend>
                      <q-icon name="confirmation_number" />
                    </template>
                  </q-input>
                  <q-btn
                    unelevated
                    color="primary"
                    label="Aplicar"
                    @click="applyCoupon"
                    :disable="!couponCode"
                  />
                </div>
                <div v-if="appliedCoupon" class="q-mt-md">
                  <q-banner dense class="bg-positive text-white" rounded>
                    <template v-slot:avatar>
                      <q-icon name="check_circle" />
                    </template>
                    Cupón "{{ appliedCoupon.code }}" aplicado: -${{ appliedCoupon.discount }}
                    <template v-slot:action>
                      <q-btn flat label="Remover" @click="removeCoupon" />
                    </template>
                  </q-banner>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Resumen de compra -->
          <div class="col-12 col-md-4" v-if="cartItems.length > 0">
            <q-card flat bordered class="dark-card sticky-summary">
              <q-card-section>
                <div class="text-h6 text-white q-mb-md">Resumen de compra</div>

                <div class="row justify-between q-mb-sm">
                  <div class="text-body2 text-grey-5">Subtotal ({{ totalItems }} items)</div>
                  <div class="text-body2 text-white">${{ subtotal }}</div>
                </div>

                <div class="row justify-between q-mb-sm">
                  <div class="text-body2 text-grey-5">Envío</div>
                  <div class="text-body2 text-white">
                    {{ shipping === 0 ? 'Gratis' : `$${shipping}` }}
                  </div>
                </div>

                <div v-if="appliedCoupon" class="row justify-between q-mb-sm">
                  <div class="text-body2 text-positive">Descuento</div>
                  <div class="text-body2 text-positive">-${{ appliedCoupon.discount }}</div>
                </div>

                <q-separator class="q-my-md" />

                <div class="row justify-between q-mb-md">
                  <div class="text-h6 text-white">Total</div>
                  <div class="text-h6 text-primary">${{ total }}</div>
                </div>

                <q-btn
                  unelevated
                  color="primary"
                  label="Proceder al pago"
                  icon-right="arrow_forward"
                  class="full-width q-mb-sm"
                  size="lg"
                  @click="checkout"
                />

                <q-btn
                  flat
                  color="grey"
                  label="Continuar comprando"
                  icon="arrow_back"
                  class="full-width"
                  to="/productos"
                />
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle2 text-white q-mb-sm">
                  <q-icon name="info" color="primary" />
                  Información de envío
                </div>
                <div class="text-caption text-grey-5">
                  • Envío gratis en compras mayores a $500<br>
                  • Tiempo estimado: 2-5 días hábiles<br>
                  • Seguimiento disponible
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle2 text-white q-mb-sm">
                  <q-icon name="verified_user" color="primary" />
                  Compra segura
                </div>
                <div class="text-caption text-grey-5">
                  Tus datos están protegidos. Aceptamos múltiples métodos de pago.
                </div>
                <div class="row q-mt-md justify-center q-gutter-xs">
                  <q-icon name="credit_card" size="sm" color="grey-5" />
                  <q-icon name="account_balance" size="sm" color="grey-5" />
                  <q-icon name="payments" size="sm" color="grey-5" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo de confirmación de compra -->
    <q-dialog v-model="showCheckoutDialog">
      <q-card class="dark-card" style="min-width: 400px">
        <q-card-section class="text-center">
          <q-icon name="check_circle" size="4rem" color="positive" />
          <div class="text-h6 text-white q-mt-md">¡Compra realizada!</div>
          <div class="text-body2 text-grey-5 q-mt-sm">
            Tu pedido ha sido procesado exitosamente
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 text-white q-mb-sm">Detalles del pedido</div>
          <div class="row justify-between q-mb-xs">
            <div class="text-caption text-grey-5">Número de orden:</div>
            <div class="text-caption text-white">#{{ orderNumber }}</div>
          </div>
          <div class="row justify-between">
            <div class="text-caption text-grey-5">Total pagado:</div>
            <div class="text-caption text-primary">${{ total }}</div>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            unelevated
            color="primary"
            label="Ver historial de compras"
            @click="goToHistory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

// Mock de items en el carrito
const cartItems = ref([
  {
    id: 1,
    name: 'iPhone 13',
    brand: 'Apple',
    price: 750,
    quantity: 1,
    image: 'https://placehold.co/400x400/3498db/ffffff?text=iPhone+13',
    storage: '128GB',
    color: 'Azul medianoche',
    condition: 'Nuevo'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S22',
    brand: 'Samsung',
    price: 600,
    quantity: 1,
    image: 'https://placehold.co/400x400/2ecc71/ffffff?text=Galaxy+S22',
    storage: '256GB',
    color: 'Negro',
    condition: 'Como nuevo'
  },
  {
    id: 3,
    name: 'Xiaomi 13 Pro',
    brand: 'Xiaomi',
    price: 800,
    quantity: 1,
    image: 'https://placehold.co/400x400/e74c3c/ffffff?text=Xiaomi+13',
    storage: '256GB',
    color: 'Blanco',
    condition: 'Nuevo'
  }
])

const couponCode = ref('')
const appliedCoupon = ref(null)
const showCheckoutDialog = ref(false)
const orderNumber = ref('')

// Computed properties
const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shipping = computed(() => {
  return subtotal.value >= 500 ? 0 : 25
})

const total = computed(() => {
  let t = subtotal.value + shipping.value
  if (appliedCoupon.value) {
    t -= appliedCoupon.value.discount
  }
  return Math.max(0, t)
})

// Funciones
const increaseQuantity = (id) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item) {
    item.quantity++
  }
}

const decreaseQuantity = (id) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item && item.quantity > 1) {
    item.quantity--
  }
}

const removeItem = (id) => {
  $q.dialog({
    title: 'Eliminar producto',
    message: '¿Estás seguro de eliminar este producto del carrito?',
    cancel: {
      label: 'Cancelar',
      flat: true
    },
    persistent: true,
    ok: {
      label: 'Eliminar',
      color: 'negative'
    }
  }).onOk(() => {
    const index = cartItems.value.findIndex(i => i.id === id)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      $q.notify({
        message: 'Producto eliminado del carrito',
        color: 'info',
        icon: 'delete',
        position: 'top'
      })
    }
  })
}

const clearCart = () => {
  $q.dialog({
    title: 'Vaciar carrito',
    message: '¿Estás seguro de eliminar todos los productos del carrito?',
    cancel: {
      label: 'Cancelar',
      flat: true
    },
    persistent: true,
    ok: {
      label: 'Vaciar',
      color: 'negative'
    }
  }).onOk(() => {
    cartItems.value = []
    appliedCoupon.value = null
    $q.notify({
      message: 'Carrito vaciado',
      color: 'info',
      icon: 'shopping_cart',
      position: 'top'
    })
  })
}

const applyCoupon = () => {
  // Mock de validación de cupón
  const validCoupons = {
    'PROMO10': { code: 'PROMO10', discount: 10 },
    'SAVE20': { code: 'SAVE20', discount: 20 },
    'MEGA50': { code: 'MEGA50', discount: 50 }
  }

  if (validCoupons[couponCode.value.toUpperCase()]) {
    appliedCoupon.value = validCoupons[couponCode.value.toUpperCase()]
    $q.notify({
      message: `Cupón aplicado: -$${appliedCoupon.value.discount}`,
      color: 'positive',
      icon: 'check_circle',
      position: 'top'
    })
  } else {
    $q.notify({
      message: 'Cupón inválido',
      color: 'negative',
      icon: 'error',
      position: 'top'
    })
  }
}

const removeCoupon = () => {
  appliedCoupon.value = null
  couponCode.value = ''
}

const checkout = () => {
  orderNumber.value = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  showCheckoutDialog.value = true
  
  // Limpiar carrito después de la compra
  setTimeout(() => {
    cartItems.value = []
    appliedCoupon.value = null
    couponCode.value = ''
  }, 500)
}

const goToHistory = () => {
  showCheckoutDialog.value = false
  router.push('/historial')
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

.sticky-summary {
  position: sticky;
  top: 20px;
}
</style>
