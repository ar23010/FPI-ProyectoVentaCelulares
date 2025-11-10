<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <div class="text-h4 text-white q-mb-lg">Historial</div>

        <q-card flat bordered class="dark-card">
       
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="purchases" icon="shopping_bag" label="Mis compras" />
            <q-tab name="sales" icon="sell" label="Mis ventas" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
           
            <q-tab-panel name="purchases">
              <div class="text-h6 text-white q-mb-md">Historial de compras</div>

          
              <div class="row q-col-gutter-sm q-mb-lg">
                <div class="col-12 col-sm-4">
                  <q-select
                    v-model="purchaseFilter"
                    filled
                    :options="statusOptions"
                    label="Estado"
                    emit-value
                    map-options
                  >
                    <template v-slot:prepend>
                      <q-icon name="filter_list" />
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model="purchaseDateFrom"
                    filled
                    type="date"
                    label="Desde"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model="purchaseDateTo"
                    filled
                    type="date"
                    label="Hasta"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" />
                    </template>
                  </q-input>
                </div>
              </div>

         
              <div class="q-gutter-md">
                <q-card
                  v-for="purchase in filteredPurchases"
                  :key="purchase.id"
                  flat
                  bordered
                  class="purchase-card"
                >
                  <q-card-section>
                    <div class="row items-center justify-between q-mb-md">
                      <div>
                        <div class="text-caption text-grey-5">Orden #{{ purchase.orderNumber }}</div>
                        <div class="text-caption text-grey-5">{{ purchase.date }}</div>
                      </div>
                      <q-badge :color="getStatusColor(purchase.status)">
                        {{ getStatusLabel(purchase.status) }}
                      </q-badge>
                    </div>

                    <div class="row items-center">
                      <div class="col-auto">
                        <q-avatar size="80px" rounded>
                          <img :src="purchase.product.image" />
                        </q-avatar>
                      </div>
                      <div class="col q-ml-md">
                        <div class="text-h6 text-white">{{ purchase.product.name }}</div>
                        <div class="text-body2 text-grey-5">{{ purchase.product.brand }}</div>
                        <div class="text-h6 text-primary q-mt-xs">${{ purchase.total }}</div>
                      </div>
                    </div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section>
                    <div class="text-subtitle2 text-white q-mb-sm">
                      <q-icon name="person" />
                      Vendedor
                    </div>
                    <div class="row items-center justify-between">
                      <div>
                        <div class="text-body2 text-white">{{ purchase.seller.name }}</div>
                        <div class="row items-center q-mt-xs">
                          <q-rating
                            :model-value="purchase.seller.rating"
                            size="sm"
                            color="primary"
                            readonly
                          />
                          <span class="text-caption text-grey-5 q-ml-xs">
                            ({{ purchase.seller.reviews }} reseñas)
                          </span>
                        </div>
                      </div>
                      <q-btn
                        flat
                        color="primary"
                        icon="message"
                        label="Contactar"
                        size="sm"
                      />
                    </div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section v-if="purchase.status !== 'cancelled'">
                    <div class="text-subtitle2 text-white q-mb-sm">
                      <q-icon name="local_shipping" />
                      Seguimiento de envío
                    </div>
                    <q-stepper
                      v-model="purchase.shippingStep"
                      flat
                      animated
                      active-color="primary"
                      done-color="positive"
                    >
                      <q-step
                        :name="1"
                        title="Pedido confirmado"
                        icon="check_circle"
                        :done="purchase.shippingStep > 1"
                      />
                      <q-step
                        :name="2"
                        title="En preparación"
                        icon="inventory"
                        :done="purchase.shippingStep > 2"
                      />
                      <q-step
                        :name="3"
                        title="En camino"
                        icon="local_shipping"
                        :done="purchase.shippingStep > 3"
                      />
                      <q-step
                        :name="4"
                        title="Entregado"
                        icon="done_all"
                      />
                    </q-stepper>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions align="right">
                    <q-btn
                      v-if="purchase.status === 'delivered' && !purchase.reviewed"
                      flat
                      color="primary"
                      icon="star"
                      label="Calificar"
                      @click="showReviewDialog(purchase)"
                    />
                    <q-btn
                      flat
                      color="primary"
                      icon="receipt"
                      label="Ver recibo"
                      @click="viewReceipt(purchase)"
                    />
                    <q-btn
                      v-if="purchase.status === 'processing'"
                      flat
                      color="negative"
                      icon="cancel"
                      label="Cancelar"
                      @click="cancelPurchase(purchase.id)"
                    />
                  </q-card-actions>
                </q-card>
              </div>

            
              <div v-if="filteredPurchases.length === 0" class="text-center q-pa-xl">
                <q-icon name="shopping_bag" size="4rem" color="grey-5" />
                <div class="text-h6 text-white q-mt-md">No tienes compras</div>
                <div class="text-body2 text-grey-5 q-mb-md">
                  Comienza a explorar nuestro catálogo
                </div>
                <q-btn
                  unelevated
                  color="primary"
                  label="Ver productos"
                  icon="store"
                  to="/productos"
                />
              </div>
            </q-tab-panel>

           
            <q-tab-panel name="sales">
              <div class="text-h6 text-white q-mb-md">Historial de ventas</div>

            
              <div class="row q-col-gutter-sm q-mb-lg">
                <div class="col-12 col-sm-4">
                  <q-select
                    v-model="saleFilter"
                    filled
                    :options="statusOptions"
                    label="Estado"
                    emit-value
                    map-options
                  >
                    <template v-slot:prepend>
                      <q-icon name="filter_list" />
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model="saleDateFrom"
                    filled
                    type="date"
                    label="Desde"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model="saleDateTo"
                    filled
                    type="date"
                    label="Hasta"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" />
                    </template>
                  </q-input>
                </div>
              </div>

           
              <div class="row q-col-gutter-md q-mb-lg">
                <div class="col-12 col-sm-4">
                  <q-card flat bordered class="stat-card">
                    <q-card-section class="text-center">
                      <div class="text-h4 text-primary">{{ totalSales }}</div>
                      <div class="text-caption text-grey-5">Total ventas</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-sm-4">
                  <q-card flat bordered class="stat-card">
                    <q-card-section class="text-center">
                      <div class="text-h4 text-positive">${{ totalEarnings }}</div>
                      <div class="text-caption text-grey-5">Ganancia total</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-sm-4">
                  <q-card flat bordered class="stat-card">
                    <q-card-section class="text-center">
                      <div class="text-h4 text-orange">{{ pendingSales }}</div>
                      <div class="text-caption text-grey-5">Pendientes</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

        
              <div class="q-gutter-md">
                <q-card
                  v-for="sale in filteredSales"
                  :key="sale.id"
                  flat
                  bordered
                  class="purchase-card"
                >
                  <q-card-section>
                    <div class="row items-center justify-between q-mb-md">
                      <div>
                        <div class="text-caption text-grey-5">Venta #{{ sale.saleNumber }}</div>
                        <div class="text-caption text-grey-5">{{ sale.date }}</div>
                      </div>
                      <q-badge :color="getStatusColor(sale.status)">
                        {{ getStatusLabel(sale.status) }}
                      </q-badge>
                    </div>

                    <div class="row items-center">
                      <div class="col-auto">
                        <q-avatar size="80px" rounded>
                          <img :src="sale.product.image" />
                        </q-avatar>
                      </div>
                      <div class="col q-ml-md">
                        <div class="text-h6 text-white">{{ sale.product.name }}</div>
                        <div class="text-body2 text-grey-5">{{ sale.product.brand }}</div>
                        <div class="text-h6 text-primary q-mt-xs">${{ sale.total }}</div>
                      </div>
                    </div>
                  </q-card-section>

                  <q-separator />

                  <q-card-section>
                    <div class="text-subtitle2 text-white q-mb-sm">
                      <q-icon name="person" />
                      Comprador
                    </div>
                    <div class="row items-center justify-between">
                      <div>
                        <div class="text-body2 text-white">{{ sale.buyer.name }}</div>
                        <div class="text-caption text-grey-5">{{ sale.buyer.location }}</div>
                      </div>
                      <q-btn
                        flat
                        color="primary"
                        icon="message"
                        label="Contactar"
                        size="sm"
                      />
                    </div>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions align="right">
                    <q-btn
                      v-if="sale.status === 'processing'"
                      unelevated
                      color="positive"
                      icon="local_shipping"
                      label="Marcar como enviado"
                      @click="markAsShipped(sale.id)"
                    />
                    <q-btn
                      flat
                      color="primary"
                      icon="receipt"
                      label="Ver detalles"
                      @click="viewSaleDetails(sale)"
                    />
                  </q-card-actions>
                </q-card>
              </div>

          
              <div v-if="filteredSales.length === 0" class="text-center q-pa-xl">
                <q-icon name="sell" size="4rem" color="grey-5" />
                <div class="text-h6 text-white q-mt-md">No tienes ventas</div>
                <div class="text-body2 text-grey-5 q-mb-md">
                  Publica tus productos para comenzar a vender
                </div>
                <q-btn
                  unelevated
                  color="primary"
                  label="Publicar producto"
                  icon="add"
                  to="/vender"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

  
    <q-dialog v-model="showReview">
      <q-card class="dark-card" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6 text-white">Calificar compra</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="text-center">
          <div class="text-body2 text-grey-5 q-mb-md">¿Cómo fue tu experiencia?</div>
          <q-rating
            v-model="reviewRating"
            size="3em"
            color="primary"
          />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="reviewComment"
            filled
            type="textarea"
            label="Comentario (opcional)"
            rows="4"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn unelevated label="Enviar reseña" color="primary" @click="submitReview" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const tab = ref('purchases')


const purchaseFilter = ref('all')
const saleFilter = ref('all')
const purchaseDateFrom = ref('')
const purchaseDateTo = ref('')
const saleDateFrom = ref('')
const saleDateTo = ref('')

const statusOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'En proceso', value: 'processing' },
  { label: 'En camino', value: 'shipping' },
  { label: 'Entregado', value: 'delivered' },
  { label: 'Cancelado', value: 'cancelled' }
]


const showReview = ref(false)
const reviewRating = ref(5)
const reviewComment = ref('')
const selectedPurchase = ref(null)


const purchases = ref([
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    date: '15 Oct 2024',
    status: 'delivered',
    shippingStep: 4,
    reviewed: false,
    product: {
      name: 'iPhone 13',
      brand: 'Apple',
      image: 'https://placehold.co/400x400/3498db/ffffff?text=iPhone+13'
    },
    seller: {
      name: 'María González',
      rating: 4.8,
      reviews: 45
    },
    total: 750
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    date: '20 Oct 2024',
    status: 'shipping',
    shippingStep: 3,
    reviewed: false,
    product: {
      name: 'Samsung Galaxy S22',
      brand: 'Samsung',
      image: 'https://placehold.co/400x400/2ecc71/ffffff?text=Galaxy+S22'
    },
    seller: {
      name: 'Carlos Ramírez',
      rating: 4.9,
      reviews: 67
    },
    total: 600
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    date: '25 Oct 2024',
    status: 'processing',
    shippingStep: 2,
    reviewed: false,
    product: {
      name: 'Xiaomi 13 Pro',
      brand: 'Xiaomi',
      image: 'https://placehold.co/400x400/e74c3c/ffffff?text=Xiaomi+13'
    },
    seller: {
      name: 'Ana López',
      rating: 4.7,
      reviews: 32
    },
    total: 800
  }
])


const sales = ref([
  {
    id: 1,
    saleNumber: 'SAL-2024-001',
    date: '10 Oct 2024',
    status: 'delivered',
    product: {
      name: 'iPhone 14 Pro Max',
      brand: 'Apple',
      image: 'https://placehold.co/400x400/9b59b6/ffffff?text=iPhone+14'
    },
    buyer: {
      name: 'Roberto Flores',
      location: 'San Salvador'
    },
    total: 1200
  },
  {
    id: 2,
    saleNumber: 'SAL-2024-002',
    date: '18 Oct 2024',
    status: 'processing',
    product: {
      name: 'Samsung Galaxy S23',
      brand: 'Samsung',
      image: 'https://placehold.co/400x400/f39c12/ffffff?text=Galaxy+S23'
    },
    buyer: {
      name: 'Laura Martínez',
      location: 'Santa Ana'
    },
    total: 900
  }
])


const filteredPurchases = computed(() => {
  return purchases.value.filter(p => purchaseFilter.value === 'all' || p.status === purchaseFilter.value)
})

const filteredSales = computed(() => {
  return sales.value.filter(s => saleFilter.value === 'all' || s.status === saleFilter.value)
})

const totalSales = computed(() => sales.value.length)
const totalEarnings = computed(() => sales.value.reduce((sum, s) => sum + s.total, 0))
const pendingSales = computed(() => sales.value.filter(s => s.status === 'processing').length)


const getStatusColor = (status) => {
  const colors = {
    processing: 'orange',
    shipping: 'blue',
    delivered: 'positive',
    cancelled: 'negative'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    processing: 'En proceso',
    shipping: 'En camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

const showReviewDialog = (purchase) => {
  selectedPurchase.value = purchase
  reviewRating.value = 5
  reviewComment.value = ''
  showReview.value = true
}

const submitReview = () => {
  if (selectedPurchase.value) {
    selectedPurchase.value.reviewed = true
    showReview.value = false
    $q.notify({
      message: 'Gracias por tu reseña',
      color: 'positive',
      icon: 'check_circle',
      position: 'top'
    })
  }
}

const viewReceipt = () => {
  $q.notify({
    message: 'Abriendo recibo...',
    color: 'info',
    icon: 'receipt',
    position: 'top'
  })
}

const cancelPurchase = (id) => {
  $q.dialog({
    title: 'Cancelar compra',
    message: '¿Estás seguro de cancelar esta compra?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const purchase = purchases.value.find(p => p.id === id)
    if (purchase) {
      purchase.status = 'cancelled'
      $q.notify({
        message: 'Compra cancelada',
        color: 'info',
        icon: 'cancel',
        position: 'top'
      })
    }
  })
}

const markAsShipped = (id) => {
  const sale = sales.value.find(s => s.id === id)
  if (sale) {
    sale.status = 'shipping'
    $q.notify({
      message: 'Marcado como enviado',
      color: 'positive',
      icon: 'local_shipping',
      position: 'top'
    })
  }
}

const viewSaleDetails = () => {
  $q.notify({
    message: 'Abriendo detalles...',
    color: 'info',
    icon: 'info',
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

.purchase-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.body--light .purchase-card {
  background: #f8fafc !important;
  border: 1px solid rgba(59, 130, 246, 0.15) !important;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.body--light .stat-card {
  background: #f8fafc !important;
  border: 1px solid rgba(59, 130, 246, 0.15) !important;
}
</style>
