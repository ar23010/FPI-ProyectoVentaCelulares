<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="dark-card">
          <q-card-section>
            <div class="text-h4 q-mb-md text-white">Vender un celular</div>
            <div class="text-body1 text-grey-5">
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
                  <div class="text-body1 q-mb-md text-white">
                    Sube hasta 5 imágenes de tu producto
                  </div>
                  
                  <q-banner class="bg-info text-white q-mb-md" rounded>
                    <template v-slot:avatar>
                      <q-icon name="info" color="white" />
                    </template>
                    <strong>Modo de prueba:</strong> Puedes continuar sin imágenes. 
               
                  </q-banner>

                

                  <q-file
                    v-model="selectedFiles"
                    filled
                    multiple
                    accept="image/*"
                    label="Seleccionar imágenes (opcional para pruebas)"
                    max-files="5"
                    counter
                    @update:model-value="handleImageSelection"
                    hint="Puedes continuar sin imágenes"
                    :disable="convertingImages"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>

                  <div v-if="formData.images.length > 0" class="row q-col-gutter-md q-mt-md">
                    <div
                      v-for="(imageBase64, index) in formData.images"
                      :key="index"
                      class="col-6 col-sm-4"
                    >
                      <q-card flat bordered class="dark-card">
                        <q-img :src="imageBase64" :ratio="1" />
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
import { db } from 'boot/firebase'
import { collection, addDoc } from "firebase/firestore"; 



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
  images: [], 
  location: '',
  city: '',
  phone: '',
  acceptTerms: false
})


const selectedFiles = ref([]) 
const convertingImages = ref(false)

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


// Manejar la selección de archivos y convertir a base64
const handleImageSelection = async () => {
  if (selectedFiles.value) {
    convertingImages.value = true
    formData.value.images = [] 
    
    const files = Array.isArray(selectedFiles.value)
      ? selectedFiles.value
      : [selectedFiles.value]
    
    // Procesar archivos de forma secuencial
    for (const file of files) {
      try {
        const base64 = await convertFileToBase64(file)
        formData.value.images.push(base64) // Guardar directamente en formData.images
      } catch (error) {
        console.error('Error converting image to base64:', error)
        $q.notify({
          message: 'Error al procesar una imagen',
          color: 'negative',
          position: 'top'
        })
      }
    }
    
    convertingImages.value = false
  }
}

// Función auxiliar para convertir archivo a base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    
    reader.onerror = (error) => {
      reject(error)
    }
    
    // Redimensionar imagen si es muy grande
    if (file.size > 1024 * 1024) { // Si es mayor a 1MB
      compressImage(file)
        .then(compressedFile => {
          reader.readAsDataURL(compressedFile)
        })
        .catch(() => {
          // Si falla la compresión, usar archivo original
          reader.readAsDataURL(file)
        })
    } else {
      reader.readAsDataURL(file)
    }
  })
}

// Función para comprimir imágenes
const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}



const removeImage = (index) => {
  formData.value.images.splice(index, 1)
  
  // También remover del array de archivos seleccionados
  if (Array.isArray(selectedFiles.value)) {
    selectedFiles.value.splice(index, 1)
  }
}

const submitForm = async () => {
  loading.value = true
  
  try {
    // Crear el objeto de datos a guardar
    const dataToSave = {
      name: formData.value.name,
      brand: formData.value.brand,
      condition: formData.value.condition,
      price: formData.value.price,
      storage: formData.value.storage,
      ram: formData.value.ram,
      color: formData.value.color,
      description: formData.value.description,
      images: formData.value.images, // Array de imágenes en base64
      location: formData.value.location,
      city: formData.value.city,
      phone: formData.value.phone,
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    
    const docRef = await addDoc(collection(db, "Celulares"), dataToSave)
    console.log("Document written with ID: ", docRef.id)
    
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
    
  } catch (e) {
    console.error("Error adding document: ", e)
    loading.value = false
    
    $q.notify({
      message: 'Error al publicar el anuncio. Intenta de nuevo.',
      color: 'negative',
      icon: 'error',
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
</style>
