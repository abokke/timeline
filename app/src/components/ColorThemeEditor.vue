<template>
  <div>
    <ImageUpload @image-selected="$emit('image-selected', $event)" />
    <div v-if="selectedImage" class="mt-4">
      <p class="text-sm text-gray-600">画像ファイル名: {{ selectedImage.file.name }}</p>
    </div>
    <div v-if="theme && theme.background" class="space-y-2">
      <label class="block font-medium">背景色</label>
      <input type="color" :value="theme.background" @input="updateColor('background', $event.target.value)" />

      <label class="block font-medium">吹き出し色</label>
      <input type="color" :value="theme.bubble" @input="updateColor('bubble', $event.target.value)" />

      <label class="block font-medium">中央線色</label>
      <input type="color" :value="theme.line" @input="updateColor('line', $event.target.value)" />
    </div>
  </div>
</template>

<script setup>
import ImageUpload from '@/components/ImageUpload.vue'
import { getReadableTextColor } from '@/utils/color.js'

const props = defineProps({
  selectedImage: Object,
  theme: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['image-selected', 'update-theme'])

function updateColor(key, value) {
  const updated = { ...props.theme, [key]: value }

  if (key === 'background') {
    // 補色を自動設定するならここで入れる
    updated.text = getReadableTextColor(value)
  }
  emit('update-theme', updated)
}
</script>

<style scoped>
/* optional */
</style>