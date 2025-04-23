<template>
  <div>
    <ImageUpload @image-selected="$emit('image-selected', $event)" />
    <div v-if="selectedImage" class="mt-4">
      <p class="text-sm text-gray-600">画像ファイル名: {{ selectedImage.file.name }}</p>
    </div>

    <div v-if="theme && theme.background" class="space-y-4 mt-4">
      <!-- 背景色 -->
      <div class="flex items-center gap-2">
        <label class="block font-medium w-20">背景色</label>
        <input
          type="color"
          :value="rgbToHex(theme.background)"
          @input="updateColor('background', $event.target.value)"
          :disabled="locks.background"
        />
        <button @click="toggleLock('background')">
          {{ locks.background ? '🔐' : '🔓' }}
        </button>
      </div>

      <!-- 吹き出し色 -->
      <div class="flex items-center gap-2">
        <label class="block font-medium w-20">吹き出し</label>
        <input
          type="color"
          :value="rgbToHex(theme.bubble)"
          @input="updateColor('bubble', $event.target.value)"
          :disabled="locks.bubble"
        />
        <button @click="toggleLock('bubble')">
          {{ locks.bubble ? '🔐' : '🔓' }}
        </button>
      </div>

      <!-- 中央線色 -->
      <div class="flex items-center gap-2">
        <label class="block font-medium w-20">中央線</label>
        <input
          type="color"
          :value="rgbToHex(theme.line)"
          @input="updateColor('line', $event.target.value)"
          :disabled="locks.line"
        />
        <button @click="toggleLock('line')">
          {{ locks.line ? '🔐' : '🔓' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { getReadableTextColor, rgbToHex } from '@/utils/color.js'

const props = defineProps({
  selectedImage: Object,
  theme: { type: Object, required: true },
  locks: { type: Object, required: true }
})

const emit = defineEmits(['image-selected', 'update-theme', 'update-locks'])

function toggleLock(key) {
  const updatedLocks = { ...props.locks, [key]: !props.locks[key] }
  emit('update-locks', updatedLocks)
}

function updateColor(key, value) {
  if (props.locks[key]) return
  const updated = { ...props.theme, [key]: value }

  if (key === 'background') {
    updated.text = getReadableTextColor(value)
  }

  emit('update-theme', updated)
}

</script>

<style scoped>
button {
  padding: 0.25rem 0.5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  cursor: pointer;
}
button:hover {
  background-color: #d1d5db;
}
</style>
