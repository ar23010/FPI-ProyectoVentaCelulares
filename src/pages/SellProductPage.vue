<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h4 q-mb-md">Vender un celular</div>
            <div class="text-body1 text-grey-7">
              Completa el formulario para publicar tu anuncio
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-stepper
              v-model="step"
              ref="stepper"
              color="primary"
              animated
            >
              <!-- Paso 1: Información básica -->
              <q-step
                :name="1"
                title="Información básica"
                icon="info"
                :done="step > 1"
              >
                <q-form @submit="nextStep" class="q-gutter-md">
                  <q-input
                    v-model="formData.name"
                    filled
                    label="Nombre del producto *"
                    hint="Ejemplo: iPhone 14 Pro Max 256GB"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-select
                    v-model="formData.brand"
                    filled
                    :options="brands"
                    label="Marca *"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-select
                    v-model="formData.condition"
                    filled
                    :options="conditions"
                    label="Condición *"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-input
                    v-model.number="formData.price"
                    filled
                    type="number"
                    prefix="$"
                    label="Precio *"
                    hint="Ingresa el precio en dólares"
                    :rules="[
                      val => !!val || 'Campo requerido',
                      val => val > 0 || 'El precio debe ser mayor a 0'
                    ]"
                  />

                  <q-stepper-navigation>
                    <q-btn
                      type="submit"
                      color="primary"
                      label="Continuar"
                    />
                  </q-stepper-navigation>
                </q-form>
              </q-step>

              <!-- Paso 2: Especificaciones técnicas -->
              <q-step
                :name="2"
                title="Especificaciones"
                icon="settings"
                :done="step > 2"
              >
                <q-form @submit="nextStep" class="q-gutter-md">
                  <q-select
                    v-model="formData.storage"
                    filled
                    :options="storageOptions"
                    label="Almacenamiento *"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-select
                    v-model="formData.ram"
                    filled
                    :options="ramOptions"
                    label="RAM *"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-input
                    v-model="formData.color"
                    filled
                    label="Color *"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-input
                    v-model="formData.description"
                    filled
                    type="textarea"
                    rows="5"
                    label="Descripción detallada *"
                    hint="Describe el estado del producto, accesorios incluidos, etc."
                    :rules="[
                      val => !!val || 'Campo requerido',
                      val => val.length >= 50 || 'Mínimo 50 caracteres'
                    ]"
                  />

                  <q-stepper-navigation>
                    <q-btn
                      flat
                      color="primary"
                      label="Atrás"
                      @click="step = 1"
                      class="q-mr-sm"
                    />
                    <q-btn
                      type="submit"
                      color="primary"
                      label="Continuar"
                    />
                  </q-stepper-navigation>
                </q-form>
              </q-step>

              <!-- Paso 3: Imágenes -->
              <q-step
                :name="3"
                title="Imágenes"
                icon="photo_camera"
                :done="step > 3"
              >
                <div class="q-gutter-md">
                  <div class="text-body1 q-mb-md">
                    Sube hasta 5 imágenes de tu producto
                  </div>

                  <q-file
                    v-model="formData.images"
                    filled
                    multiple
                    accept="image/*"
                    label="Seleccionar imágenes"
                    max-files="5"
                    counter
                    @update:model-value="previewImages"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>

                  <div v-if="imagePreviews.length > 0" class="row q-col-gutter-md q-mt-md">
                    <div
                      v-for="(preview, index) in imagePreviews"
                      :key="index"
                      class="col-6 col-sm-4"
                    >
                      <q-card flat bordered>
                        <q-img :src="preview" :ratio="1" />
                        <q-btn
                          round
                          size="sm"
                          color="negative"
                          icon="close"
                          class="absolute-top-right q-ma-xs"
                          @click="removeImage(index)"
                        />
                      </q-card>
                    </div>
                  </div>

                  <q-stepper-navigation>
                    <q-btn
                      flat
                      color="primary"
                      label="Atrás"
                      @click="step = 2"
                      class="q-mr-sm"
                    />
                    <q-btn
                      color="primary"
                      label="Continuar"
                      @click="nextStep"
                      :disable="imagePreviews.length === 0"
                    />
                  </q-stepper-navigation>
                </div>
              </q-step>

              <!-- Paso 4: Ubicación -->
              <q-step
                :name="4"
                title="Ubicación"
                icon="location_on"
              >
                <q-form @submit="submitForm" class="q-gutter-md">
                  <q-select
                    v-model="formData.location"
                    filled
                    :options="locations"
                    label="Departamento *"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-input
                    v-model="formData.city"
                    filled
                    label="Municipio *"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-input
                    v-model="formData.phone"
                    filled
                    label="Teléfono de contacto *"
                    mask="####-####"
                    hint="Formato: 0000-0000"
                    :rules="[val => !!val || 'Campo requerido']"
                  />

                  <q-checkbox
                    v-model="formData.acceptTerms"
                    label="Acepto los términos y condiciones"
                    :rules="[val => !!val || 'Debes aceptar los términos']"
                  />

                  <q-stepper-navigation>
                    <q-btn
                      flat
                      color="primary"
                      label="Atrás"
                      @click="step = 3"
                      class="q-mr-sm"
                    />
                    <q-btn
                      type="submit"
                      color="primary"
                      label="Publicar anuncio"
                      icon="publish"
                      :loading="loading"
                    />
                  </q-stepper-navigation>
                </q-form>
              </q-step>
            </q-stepper>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const step = ref(1)
const loading = ref(false)

const formData = ref({
  name: '',
  brand: '',
  condition: '',
  price: null,
  storage: '',
  ram: '',
  color: '',
  description: '',
  images: null,
  location: '',
  city: '',
  phone: '',
  acceptTerms: false
})

const imagePreviews = ref([])

// Opciones
const brands = [
  'Apple',
  'Samsung',
  'Xiaomi',
  'Huawei',
  'Motorola',
  'OnePlus',
  'Google',
  'Sony',
  'LG',
  'Nokia',
  'Realme',
  'OPPO',
  'Otro'
]

const conditions = [
  'Nuevo',
  'Como nuevo',
  'Usado - Buen estado',
  'Usado - Aceptable',
  'Para repuestos'
]

const storageOptions = [
  '16GB',
  '32GB',
  '64GB',
  '128GB',
  '256GB',
  '512GB',
  '1TB'
]

const ramOptions = [
  '2GB',
  '3GB',
  '4GB',
  '6GB',
  '8GB',
  '12GB',
  '16GB'
]

const locations = [
  'San Salvador',
  'Santa Ana',
  'San Miguel',
  'La Libertad',
  'Sonsonate',
  'Usulután',
  'La Paz',
  'Chalatenango',
  'Ahuachapán',
  'Cuscatlán',
  'Morazán',
  'La Unión',
  'Cabañas',
  'San Vicente'
]

const nextStep = () => {
  step.value++
}

const previewImages = () => {
  imagePreviews.value = []
  if (formData.value.images) {
    const files = Array.isArray(formData.value.images)
      ? formData.value.images
      : [formData.value.images]
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }
}

const removeImage = (index) => {
  imagePreviews.value.splice(index, 1)
  // También remover del array de archivos
  if (Array.isArray(formData.value.images)) {
    formData.value.images.splice(index, 1)
  }
}

const submitForm = () => {
  loading.value = true

  // Simular llamada a API
  setTimeout(() => {
    loading.value = false
    
    $q.notify({
      message: '¡Anuncio publicado exitosamente!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000
    })

    router.push('/productos')
  }, 2000)
}
</script>
