<template>
  <div class="space-y-2">
    <label class="block font-medium">イベントのタイトル</label>
    <input v-model="form.title" type="text" class="w-full p-2 border rounded" />

    <label class="block font-medium">説明</label>
    <input v-model="form.description" type="text" class="w-full p-2 border rounded" />

    <label class="block font-medium">日付</label>
    <input v-model="form.date" type="date" class="w-full p-2 border rounded" />

    <label class="block font-medium">サムネイルURL</label>
    <input v-model="form.thumbnail" type="text" class="w-full p-2 border rounded" placeholder="https://example.com/image.jpg" />

    <button
      @click="$emit('submit')"
      class="w-full text-white p-2 rounded"
      :style="{ backgroundColor: themeColor || '#3b82f6' }"
    >
      追加
    </button>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  form: Object,
  themeColor: String
})
const emit = defineEmits(['submit'])
const { form } = toRefs(props)
</script>

<style scoped>
/* optional */
</style>
