<template>
  <div>
    <!-- 吹き出し本体 -->
    <div
      ref="bubble"
      class="relative p-4 rounded-lg shadow-md max-w-xs group"
      :style="{ backgroundColor: bubbleColor, color: textColor }"
    >
      <!-- 三角（下付き） -->
      <div
        v-if="position === 'top'"
        class="absolute left-1/2 -bottom-4 w-0 h-0"
        :style="{
          borderLeft: '16px solid transparent',
          borderRight: '16px solid transparent',
          borderTop: `16px solid ${bubbleColor}`,
          transform: 'translateX(-50%)'
        }"
      />
      <div
        v-else
        class="absolute left-1/2 -top-4 w-0 h-0"
        :style="{
          borderLeft: '16px solid transparent',
          borderRight: '16px solid transparent',
          borderBottom: `16px solid ${bubbleColor}`,
          transform: 'translateX(-50%)'
        }"
      />
      <!-- 編集 & 削除 ボタン（ホバー時） -->
      <div
        class="absolute -top-8 right-0 bg-white border rounded px-2 py-1 shadow z-10 hidden group-hover:flex space-x-3"
      >
        <button
          @click="startEditing"
          class="text-blue-500 hover:text-blue-700 text-sm"
          title="編集"
        >
          ✏️
        </button>
        <button
          @click="$emit('delete-event', event.id)"
          class="text-red-500 hover:text-red-700 text-sm"
          title="削除"
        >
          🗑
        </button>
      </div>

      <!-- サムネイル -->
      <div v-if="event.thumbnail && !isEditing" class="mb-2">
        <img :src="event.thumbnail" alt="thumbnail" class="w-full max-h-40 object-cover rounded-md" />
      </div>

      <!-- 編集モード -->
      <template v-if="isEditing">
        <input v-model="editableEvent.title" class="w-full text-lg font-bold mb-1 p-1 rounded border" />
        <input v-model="editableEvent.description" class="w-full text-sm mb-1 p-1 rounded border" />
        <input v-model="editableEvent.date" type="date" class="w-full text-xs p-1 rounded border" />
        <button @click="saveEdit" class="text-green-600 mt-2 text-sm">✔ 保存</button>
      </template>

      <!-- 通常表示 -->
      <template v-else>
        <h3 class="font-bold text-lg" :style="{ color: textColor }">{{ event.title }}</h3>
        <p class="text-sm" :style="{ color: textColor }">{{ event.description }}</p>
        <p class="text-xs mt-1" :style="{ color: textColor }">{{ formattedDate }}</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  event: Object,
  position: String,
  bubbleColor: {
    type: String,
    default: '#dbeafe' // ← Tailwindの bg-blue-100 に近い色
  },
  textColor: {
    type: String,
    default: '#000000'
  }
})

const emit = defineEmits(['update-event', 'delete-event'])

const isEditing = ref(false)
const editableEvent = ref({ ...props.event })

watch(
  () => props.event,
  (newVal) => {
    editableEvent.value = { ...newVal }
  }
)

const formattedDate = computed(() => {
  const date = new Date(props.event.date)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

function startEditing() {
  isEditing.value = true
}

function saveEdit() {
  emit('update-event', { ...editableEvent.value })
  isEditing.value = false
}
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.2s ease-out;
  transform: translateY(-5px);
  opacity: 0;
}
.fade-slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.fade-slide-leave-active {
  transition: all 0.2s ease-in;
}
.fade-slide-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}
</style>