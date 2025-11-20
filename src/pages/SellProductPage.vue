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

              <q-step
                :name="3"
                title="Imágenes"
                icon="photo_camera"
                :done="step > 3"
              >
                <div class="q-gutter-md">
                  <div class="text-body1 q-mb-md text-white">
                    Sube hasta 3 imágenes de tu producto (se comprimen automáticamente)
                  </div>
                  
                  <q-banner class="bg-info text-white q-mb-md" rounded>
                    <template v-slot:avatar>
                      <q-icon name="info" color="white" />
                    </template>
                    <strong>Optimización automática:</strong> Las imágenes se comprimen automáticamente para Firebase. Máximo 3 imágenes recomendadas.
                  </q-banner>

                

                  <q-file
                    v-model="selectedFiles"
                    filled
                    multiple
                    accept="image/*"
                    label="Seleccionar imágenes (máximo 3 para Firebase)"
                    max-files="3"
                    counter
                    @update:model-value="handleImageSelection"
                    hint="Imágenes se comprimen automáticamente"
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

              <q-step
                :name="4"
                title="Ubicación"
                icon="location_on"
              >
                <q-form @submit.prevent="submitForm" class="q-gutter-md">
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
                      unelevated
                      color="primary"
                      label="Publicar anuncio"
                      icon="publish"
                      :loading="loading"
                      :disable="!formData.acceptTerms"
                      @click="submitForm"
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

const handleImageSelection = async () => {
  if (!selectedFiles.value) return
  
  convertingImages.value = true
  formData.value.images = []
  
  const files = Array.isArray(selectedFiles.value)
    ? selectedFiles.value.slice(0, 3) // Máximo 3 imágenes
    : [selectedFiles.value]
  
  let totalEstimatedSize = 0
  
  for (const file of files) {
    try {
      // Validar tamaño del archivo original
      if (file.size > 10 * 1024 * 1024) { // Máximo 10MB por imagen
        $q.notify({
          message: `Imagen ${file.name} es demasiado grande (máximo 10MB)`,
          color: 'warning',
          position: 'top'
        })
        continue
      }
      
      console.log(`Procesando: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)
      
      const base64 = await convertFileToBase64(file)
      const estimatedSize = base64.length * 0.75
      totalEstimatedSize += estimatedSize
      
      // Verificar que el tamaño total no exceda ~800KB
      if (totalEstimatedSize > 800 * 1024) {
        $q.notify({
          message: 'Demasiadas imágenes. Límite de tamaño alcanzado.',
          color: 'warning',
          position: 'top'
        })
        break
      }
      
      formData.value.images.push(base64)
      
    } catch (error) {
      console.error('Error converting image to base64:', error)
      $q.notify({
        message: `Error al procesar ${file.name}`,
        color: 'negative',
        position: 'top'
      })
    }
  }
  
  console.log(`Total de imágenes procesadas: ${formData.value.images.length}`)
  console.log(`Tamaño total estimado: ${(totalEstimatedSize / 1024).toFixed(2)} KB`)
  
  convertingImages.value = false
}

const convertFileToBase64 = async (file) => {
  try {
    const compressedBase64 = await compressImage(file)
    
    console.log(`Imagen comprimida: ${file.name}`)
    console.log(`Tamaño original: ${(file.size / 1024).toFixed(2)} KB`)
    console.log(`Tamaño base64 estimado: ${(compressedBase64.length * 0.75 / 1024).toFixed(2)} KB`)
    
    return compressedBase64
  } catch (error) {
    console.error('Error al comprimir imagen:', error)
    throw error
  }
}

const compressImage = (file, maxWidth = 300, quality = 0.4) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      try {
        let { width, height } = img
        
        // Redimensionar manteniendo aspecto pero limitando tamaño máximo
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height
            height = maxWidth
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir a JPEG con compresión agresiva
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        
        // Verificar si aún es muy grande (más de 100KB estimado)
        const estimatedSize = compressedBase64.length * 0.75
        if (estimatedSize > 100 * 1024 && quality > 0.2) {
          // Comprimir más si es necesario
          const smallerBase64 = canvas.toDataURL('image/jpeg', 0.2)
          resolve(smallerBase64)
        } else {
          resolve(compressedBase64)
        }
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

const removeImage = (index) => {
  formData.value.images.splice(index, 1)
  
  if (Array.isArray(selectedFiles.value)) {
    selectedFiles.value.splice(index, 1)
  }
}

const submitForm = async () => {
  console.log('submitForm llamado')
  loading.value = true
  
  try {
    const dataToSave = {
      name: formData.value.name,
      brand: formData.value.brand,
      condition: formData.value.condition,
      price: formData.value.price,
      storage: formData.value.storage,
      ram: formData.value.ram,
      color: formData.value.color,
      description: formData.value.description,
      images: formData.value.images,
      location: formData.value.location,
      city: formData.value.city,
      phone: formData.value.phone,
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    
    // Validar tamaño del documento antes de enviarlo
    const docSize = new Blob([JSON.stringify(dataToSave)]).size
    console.log(`Tamaño del documento: ${(docSize / 1024).toFixed(2)} KB`)
    
    if (docSize > 1048576) { // 1MB limit
      throw new Error(`Documento demasiado grande: ${(docSize / 1024).toFixed(2)} KB. Máximo: 1024 KB`)
    }
    
    console.log('Intentando guardar en Firebase...')
    
    // Intentar guardar en Firebase
    if (db) {
      try {
        const docRef = await addDoc(collection(db, "Celulares"), dataToSave)
        console.log("Document written with ID: ", docRef.id)
      } catch (firebaseError) {
        console.error("Error de Firebase:", firebaseError)
        throw firebaseError
      }
    } else {
      throw new Error("Firebase no está configurado")
    }
    
    loading.value = false
    
    // Mostrar notificación de éxito
    $q.notify({
      message: '¡Producto publicado exitosamente!',
      caption: 'Tu anuncio ya está visible en el marketplace',
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
      timeout: 2500,
      actions: [
        { label: 'Ver', color: 'white', handler: () => { router.push('/productos') } }
      ]
    })

    // Redirigir a la página de productos después de un breve delay
    setTimeout(() => {
      router.push('/productos')
    }, 1500)
    
  } catch (e) {
    console.error("Error adding document: ", e)
    loading.value = false
    
    let errorMessage = 'Error al publicar el anuncio'
    let errorCaption = 'Por favor, intenta de nuevo'
    
    if (e.message && e.message.includes('demasiado grande')) {
      errorMessage = 'Imágenes demasiado grandes'
      errorCaption = 'Reduce el número de imágenes o usa imágenes más pequeñas'
    } else if (e.code === 'permission-denied') {
      errorMessage = 'Sin permisos para guardar'
      errorCaption = 'Verifica la configuración de Firebase'
    } else if (e.message && e.message.includes('exceeds the maximum allowed size')) {
      errorMessage = 'Documento muy grande para Firebase'
      errorCaption = 'Reduce las imágenes a máximo 2-3 fotos'
    }
    
    $q.notify({
      message: errorMessage,
      caption: errorCaption,
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 5000
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
