<template>
  <div @click="triggerFileInput" class="w-full p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer hover:bg-gray-100">
    <input
      type="file"
      accept="image/*"
      class="hidden"
      ref="fileInput"
      @change="handleFileChange"
    />
    <p v-if="!imagePreview" class="text-gray-500">画像を選択してください</p>
    <img
      v-else
      ref="previewImage"
      :src="imagePreview"
      class="mx-auto max-h-48 rounded-md"
      @load="analyzePalette"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ColorThief from 'color-thief-browser'

const fileInput = ref(null)
const imagePreview = ref(null)
const previewImage = ref(null)
const currentFile = ref(null)

const emit = defineEmits(['image-selected'])

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return
  currentFile.value = file

  const reader = new FileReader()
  reader.onload = () => {
    imagePreview.value = reader.result
  }
  reader.readAsDataURL(file)
}

function analyzePalette() {
  const img = previewImage.value
  if (!img || !img.complete) return

  try {
    const colorThief = new ColorThief()
    const palette = colorThief.getPalette(img, 5) // 最大5色取得

    const toCss = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`

    emit('image-selected', {
      file: currentFile.value,
      preview: imagePreview.value,
      palette: palette.map(toCss)
    })
  } catch (e) {
    console.error('色抽出エラー', e)
  }
}
</script>
