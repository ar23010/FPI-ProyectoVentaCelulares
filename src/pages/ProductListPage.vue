<template>
  <q-page padding>
    <!-- Barra de búsqueda y filtros -->
    <div class="q-mb-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-input
            v-model="searchQuery"
            outlined
            placeholder="Buscar celulares..."
            @update:model-value="filterProducts"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="sortOption"
            outlined
            :options="sortOptions"
            label="Ordenar por"
            @update:model-value="sortProducts"
          />
        </div>
      </div>
    </div>

    <!-- Filtros laterales -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="dark-card">
          <q-card-section>
            <div class="text-h6 q-mb-md text-white">Filtros</div>
            
            <!-- Filtro por marca -->
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm text-white">Marca</div>
              <q-option-group
                v-model="selectedBrands"
                :options="brands"
                type="checkbox"
                color="primary"
                dark
                @update:model-value="filterProducts"
              />
            </div>

            <!-- Filtro por rango de precio -->
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm text-white">Rango de precio</div>
              <q-range
                v-model="priceRange"
                :min="0"
                :max="2000"
                :step="50"
                label
                color="primary"
                @update:model-value="filterProducts"
              />
              <div class="text-caption q-mt-sm">
                ${{ priceRange.min }} - ${{ priceRange.max }}
              </div>
            </div>

            <!-- Filtro por condición -->
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm text-white">Condición</div>
              <q-option-group
                v-model="selectedConditions"
                :options="conditions"
                type="checkbox"
                color="primary"
                dark
                @update:model-value="filterProducts"
              />
            </div>

            <q-btn
              flat
              color="primary"
              label="Limpiar filtros"
              class="full-width"
              @click="clearFilters"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Listado de productos -->
      <div class="col-12 col-md-9">
        <div class="row q-col-gutter-md">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card
              class="product-card cursor-pointer dark-card"
              @click="goToProductDetail(product.id)"
            >
              <!-- Imagen del producto o placeholder -->
              <div v-if="product.image" class="product-image-container">
                <q-img
                  :src="product.image"
                  :ratio="4/3"
                  spinner-color="primary"
                >
                  <div class="absolute-top-right q-ma-sm">
                    <q-badge :color="product.condition === 'Nuevo' ? 'positive' : 'info'">
                      {{ product.condition }}
                    </q-badge>
                  </div>
                </q-img>
              </div>
              
              <!-- Placeholder cuando no hay imagen -->
              <div v-else class="product-no-image">
                <div class="no-image-content">
                  <q-icon name="phone_android" size="4rem" color="grey-6" />
                  <div class="text-caption text-grey-5 q-mt-sm">Sin imagen</div>
                </div>
                <div class="absolute-top-right q-ma-sm">
                  <q-badge :color="product.condition === 'Nuevo' ? 'positive' : 'info'">
                    {{ product.condition }}
                  </q-badge>
                </div>
              </div>

              <q-card-section>
                <div class="text-h6 text-white">{{ product.name }}</div>
                <div class="text-caption text-grey-5">{{ product.brand }}</div>
                <div class="text-h5 text-primary q-mt-sm">
                  ${{ product.price.toLocaleString() }}
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-caption text-grey-5">
                  <q-icon name="location_on" size="xs" />
                  {{ product.location }}
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  color="primary"
                  label="Ver detalles"
                  @click.stop="goToProductDetail(product.id)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div v-if="filteredProducts.length === 0" class="text-center q-pa-xl">
          <q-icon name="search_off" size="4rem" color="grey-5" />
          <div class="text-h6 text-white q-mt-md">
            No se encontraron productos
          </div>
          <div class="text-body2 text-grey-5">
            Intenta ajustar los filtros de búsqueda
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado de búsqueda y filtros
const searchQuery = ref('')
const sortOption = ref('Más recientes')
const selectedBrands = ref([])
const selectedConditions = ref([])
const priceRange = ref({ min: 0, max: 2000 })

// Opciones de filtros
const sortOptions = [
  'Más recientes',
  'Menor precio',
  'Mayor precio',
  'Más populares'
]

const brands = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Samsung', value: 'Samsung' },
  { label: 'Xiaomi', value: 'Xiaomi' },
  { label: 'Huawei', value: 'Huawei' },
  { label: 'Motorola', value: 'Motorola' },
  { label: 'OnePlus', value: 'OnePlus' }
]

const conditions = [
  { label: 'Nuevo', value: 'Nuevo' },
  { label: 'Como nuevo', value: 'Como nuevo' },
  { label: 'Usado - Buen estado', value: 'Usado - Buen estado' },
  { label: 'Usado - Aceptable', value: 'Usado - Aceptable' }
]

// Datos de ejemplo (en producción vendrían de una API)
const allProducts = ref([
  {
    id: 1,
    name: 'iPhone 14 Pro Max',
    brand: 'Apple',
    price: 1200,
    condition: 'Nuevo',
    image: 'https://placehold.co/600x400/3498db/ffffff?text=iPhone+14+Pro',
    location: 'San Salvador',
    description: 'iPhone 14 Pro Max 256GB, color morado'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23 Ultra',
    brand: 'Samsung',
    price: 1100,
    condition: 'Nuevo',
    image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Galaxy+S23',
    location: 'Santa Ana',
    description: 'Samsung Galaxy S23 Ultra 512GB'
  },
  {
    id: 3,
    name: 'Xiaomi 13 Pro',
    brand: 'Xiaomi',
    price: 800,
    condition: 'Como nuevo',
    image: 'https://placehold.co/600x400/e74c3c/ffffff?text=Xiaomi+13',
    location: 'San Miguel',
    description: 'Xiaomi 13 Pro 256GB, usado 2 meses'
  },
  {
    id: 4,
    name: 'iPhone 13',
    brand: 'Apple',
    price: 850,
    condition: 'Usado - Buen estado',
    image: 'https://placehold.co/600x400/9b59b6/ffffff?text=iPhone+13',
    location: 'San Salvador',
    description: 'iPhone 13 128GB, excelente estado'
  },
  {
    id: 5,
    name: 'Samsung Galaxy A54',
    brand: 'Samsung',
    price: 400,
    condition: 'Nuevo',
    image: 'https://placehold.co/600x400/f39c12/ffffff?text=Galaxy+A54',
    location: 'La Libertad',
    description: 'Samsung Galaxy A54 5G 128GB'
  },
  {
    id: 6,
    name: 'Motorola Edge 40',
    brand: 'Motorola',
    price: 500,
    condition: 'Nuevo',
    image: 'https://placehold.co/600x400/1abc9c/ffffff?text=Moto+Edge',
    location: 'Sonsonate',
    description: 'Motorola Edge 40 256GB'
  },
  {
    id: 7,
    name: 'OnePlus 11 Pro',
    brand: 'OnePlus',
    price: 650,
    condition: 'Como nuevo',
    image: null, // Producto de prueba sin imagen
    location: 'San Salvador',
    description: 'OnePlus 11 Pro 256GB - Producto de prueba para integración Firebase'
  }
])

const filteredProducts = ref([...allProducts.value])

// Funciones de filtrado
const filterProducts = () => {
  let filtered = [...allProducts.value]

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }

  // Filtrar por marca
  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter(p =>
      selectedBrands.value.includes(p.brand)
    )
  }

  // Filtrar por condición
  if (selectedConditions.value.length > 0) {
    filtered = filtered.filter(p =>
      selectedConditions.value.includes(p.condition)
    )
  }

  // Filtrar por precio
  filtered = filtered.filter(
    p => p.price >= priceRange.value.min && p.price <= priceRange.value.max
  )

  filteredProducts.value = filtered
  sortProducts()
}

const sortProducts = () => {
  const sorted = [...filteredProducts.value]

  switch (sortOption.value) {
    case 'Menor precio':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'Mayor precio':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'Más populares':
      // Aquí podrías ordenar por número de vistas o likes
      break
    case 'Más recientes':
    default:
      sorted.sort((a, b) => b.id - a.id)
      break
  }

  filteredProducts.value = sorted
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedBrands.value = []
  selectedConditions.value = []
  priceRange.value = { min: 0, max: 2000 }
  filterProducts()
}

const goToProductDetail = (id) => {
  router.push(`/producto/${id}`)
}

onMounted(() => {
  filterProducts()
})
</script>

<style scoped lang="scss">
.product-card {
  transition: transform 0.2s ease;
  border-radius: 20px !important;
  will-change: transform;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.body--dark .product-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.body--light .product-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(59, 130, 246, 0.4) !important;
}

// Placeholder para productos sin imagen - Modo Oscuro
.body--dark .product-no-image {
  position: relative;
  height: 0;
  padding-bottom: 75%; // Ratio 4:3
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .no-image-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
}

// Placeholder para productos sin imagen - Modo Claro
.body--light .product-no-image {
  position: relative;
  height: 0;
  padding-bottom: 75%; // Ratio 4:3
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .no-image-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
}

.product-image-container {
  position: relative;
}

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
</style>
