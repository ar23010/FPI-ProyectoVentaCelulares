<template>
  <q-page padding>
    <div class="q-mb-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
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
        <div class="col-6 col-md-3">
          <q-select
            v-model="sortOption"
            outlined
            :options="sortOptions"
            label="Ordenar por"
            @update:model-value="sortProducts"
          />
        </div>
        <div class="col-6 col-md-3">
          <q-select
            v-model="itemsPerPage"
            outlined
            :options="[6, 9, 12, 18, 24]"
            label="Productos por página"
            @update:model-value="currentPage = 1"
          />
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="dark-card">
          <q-card-section>
            <div class="text-h6 q-mb-md text-white">Filtros</div>
            
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
              <div class="product-image-container">
                <q-img
                  :src="product.images[0]"
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

        <div v-if="filteredProducts.length === 0" class="text-center q-pa-xl">
          <q-icon name="search_off" size="4rem" color="grey-5" />
          <div class="text-h6 text-white q-mt-md">
            No se encontraron productos
          </div>
          <div class="text-body2 text-grey-5">
            Intenta ajustar los filtros de búsqueda
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="q-mt-xl">
          <q-separator class="q-mb-lg" />
          
          <div class="row justify-center items-center q-gutter-md">
            <!-- Paginación principal -->
            <div class="col-12 row justify-center">
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                :max-pages="6"
                direction-links
                boundary-links
                color="primary"
                active-design="unelevated"
                active-color="primary"
                active-text-color="white"
                size="md"
                @update:model-value="goToPage"
              />
            </div>
            
            <!-- Información de paginación y navegación rápida -->
            <div class="col-12 row justify-center items-center q-gutter-sm">
              <div class="text-caption text-grey-5">
                Mostrando 
                <span class="text-white text-weight-medium">
                  {{ (currentPage - 1) * itemsPerPage + 1 }}
                </span>
                - 
                <span class="text-white text-weight-medium">
                  {{ Math.min(currentPage * itemsPerPage, allFilteredProducts.length) }}
                </span>
                de 
                <span class="text-white text-weight-medium">
                  {{ allFilteredProducts.length }}
                </span>
                productos
              </div>
              
              <!-- Ir a página específica -->
              <q-btn
                flat
                dense
                color="primary"
                label="Ir a página"
                size="sm"
                @click="showGoToPageDialog = true"
              >
                <q-icon name="arrow_forward" size="xs" class="q-ml-xs" />
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div v-else-if="allFilteredProducts.length > 0 && totalPages === 1" class="q-mt-lg">
          <div class="row justify-center">
            <div class="text-caption text-grey-5">
              Mostrando todos los {{ allFilteredProducts.length }} productos
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo para ir a una página específica -->
    <q-dialog v-model="showGoToPageDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Ir a página</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model.number="goToPageNumber"
            type="number"
            filled
            label="Número de página"
            :min="1"
            :max="totalPages"
            :hint="`Ingresa un número entre 1 y ${totalPages}`"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            unelevated
            label="Ir"
            color="primary"
            @click="navigateToPage"
            :disable="!goToPageNumber || goToPageNumber < 1 || goToPageNumber > totalPages"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import { db } from 'boot/firebase'


const router = useRouter()

const searchQuery = ref('')
const sortOption = ref('Más recientes')
const selectedBrands = ref([])
const selectedConditions = ref([])
const priceRange = ref({ min: 0, max: 2000 })

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(9) // 9 productos por página (3x3 grid)
const showGoToPageDialog = ref(false)
const goToPageNumber = ref(1)

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

const allProducts = useCollection(collection(db, "Celulares"))

// Función para generar imagen placeholder basada en el nombre del producto
const getPlaceholderImage = (productName, brand) => {
  // Extraer las iniciales del nombre del producto
  const words = productName.split(' ').filter(w => w.length > 0)
  const initials = words.slice(0, 2).map(w => w[0]).join('').toUpperCase()
  
  // Colores basados en la marca
  const brandColors = {
    'Apple': '000000',
    'Samsung': '1428A0',
    'Xiaomi': 'FF6900',
    'Huawei': 'FF0000',
    'Motorola': '5B5EA6',
    'OnePlus': 'F50514',
    'Google': '4285F4',
    'Sony': '000000',
    'LG': 'A50034',
    'Nokia': '124191',
    'Realme': 'F5D000',
    'OPPO': '0EAF8B'
  }
  
  const color = brandColors[brand] || '3B82F6'
  
  // Generar URL de imagen usando UI Avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=400&background=${color}&color=fff&bold=true&font-size=0.4`
}

// Todos los productos filtrados (antes de paginar)
const allFilteredProducts = computed(() => {
  if (!allProducts.value) return []
  
  // Añadir imagen placeholder a productos sin imagen
  let filtered = allProducts.value.map(product => {
    if (!product.images || product.images.length === 0) {
      return {
        ...product,
        images: [getPlaceholderImage(product.name, product.brand)]
      }
    }
    return product
  })

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }

  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter(p =>
      selectedBrands.value.includes(p.brand)
    )
  }

  if (selectedConditions.value.length > 0) {
    filtered = filtered.filter(p =>
      selectedConditions.value.includes(p.condition)
    )
  }

  filtered = filtered.filter(
    p => p.price >= priceRange.value.min && p.price <= priceRange.value.max
  )

  switch (sortOption.value) {
    case 'Menor precio':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'Mayor precio':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'Más recientes':
    default:
      filtered.sort((a, b) => b.id - a.id)
      break
  }

  return filtered
})

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(allFilteredProducts.value.length / itemsPerPage.value)
})

// Productos paginados (los que se muestran en la página actual)
const filteredProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return allFilteredProducts.value.slice(start, end)
})

const filterProducts = () => {
  // Resetear a la primera página cuando se filtran productos
  currentPage.value = 1
}

const sortProducts = () => {
  // Resetear a la primera página cuando se ordena
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedBrands.value = []
  selectedConditions.value = []
  priceRange.value = { min: 0, max: 2000 }
  currentPage.value = 1
}

const goToPage = (page) => {
  currentPage.value = page
  // Scroll hacia arriba al cambiar de página
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const navigateToPage = () => {
  if (goToPageNumber.value >= 1 && goToPageNumber.value <= totalPages.value) {
    goToPage(goToPageNumber.value)
    showGoToPageDialog.value = false
  }
}

const goToProductDetail = (id) => {
  router.push(`/producto/${id}`)
}
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

/* Estilos de paginación */
:deep(.q-pagination__content) {
  gap: 6px;
}

:deep(.q-btn.q-pagination__middle) {
  border-radius: 10px;
  min-width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

:deep(.q-btn--unelevated.q-pagination__middle) {
  background: var(--q-primary) !important;
  color: white !important;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  transform: scale(1.1);
}

.body--dark :deep(.q-btn:not(.q-btn--unelevated).q-pagination__middle) {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

.body--light :deep(.q-btn:not(.q-btn--unelevated).q-pagination__middle) {
  background: white;
  color: rgba(59, 130, 246, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.2);
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: rgb(59, 130, 246);
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
  }
}

/* Botones de navegación (primera, última, anterior, siguiente) */
:deep(.q-btn.q-pagination__first),
:deep(.q-btn.q-pagination__last),
:deep(.q-btn.q-pagination__prev),
:deep(.q-btn.q-pagination__next) {
  border-radius: 10px;
  transition: all 0.3s ease;
}

.body--dark :deep(.q-btn.q-pagination__first),
.body--dark :deep(.q-btn.q-pagination__last),
.body--dark :deep(.q-btn.q-pagination__prev),
.body--dark :deep(.q-btn.q-pagination__next) {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.2);
    color: rgb(59, 130, 246);
    border-color: rgba(59, 130, 246, 0.4);
  }
}

.body--light :deep(.q-btn.q-pagination__first),
.body--light :deep(.q-btn.q-pagination__last),
.body--light :deep(.q-btn.q-pagination__prev),
.body--light :deep(.q-btn.q-pagination__next) {
  background: white;
  color: rgb(59, 130, 246);
  border: 1px solid rgba(59, 130, 246, 0.2);
  
  &:hover:not(:disabled) {
    background: rgb(59, 130, 246);
    color: white;
    border-color: rgb(59, 130, 246);
  }
}
</style>
