<template>
  <div class="flex h-screen relative">
    <!-- フィードバックボタン -->
    <a
      href="https://forms.gle/pj3aQeAf33UNTSeo6"
      target="_blank"
      class="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
    >
      フィードバック
    </a>

    <!-- 左：操作パネル -->
    <aside class="w-80 bg-gray-100 p-4 border-r overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4">操作パネル</h2>

      <!-- ソート選択 -->
      <div class="mb-4">
        <label class="block mb-1 font-medium">ソート順</label>
        <select v-model="sortKey" class="w-full p-2 border rounded">
          <option value="date">日付順</option>
          <option value="title">タイトル順</option>
        </select>
      </div>

      <!-- イベント追加フォーム -->
      <div class="mb-4">
        <label class="block mb-1 font-medium">イベントのタイトル</label>
        <input v-model="newEvent.title" type="text" class="w-full p-2 border rounded mb-2" />

        <label class="block mb-1 font-medium">説明</label>
        <input v-model="newEvent.description" type="text" class="w-full p-2 border rounded mb-2" />

        <label class="block mb-1 font-medium">日付</label>
        <input v-model="newEvent.date" type="date" class="w-full p-2 border rounded mb-2" />

        <label class="block mb-1 font-medium">サムネイルURL</label>
        <input v-model="newEvent.thumbnail" type="text" class="w-full p-2 border rounded mb-2" placeholder="https://example.com/image.jpg" />

        <button @click="addEvent" class="w-full text-white p-2 rounded" :style="{ backgroundColor: themeColor || '#3b82f6' }">
          追加
        </button>
      </div>
      <div class="p-8">
        <ImageUpload @image-selected="onImageSelected" />
        <div v-if="selectedImage" class="mt-4">
          <p class="text-sm text-gray-600">画像ファイル名: {{ selectedImage.file.name }}</p>
        </div>
      </div>
    </aside>

    <!-- 右：年表表示エリア -->
    <main class="flex-1 p-6 overflow-x-auto relative" :style="{ backgroundColor: timelineTheme.background }">
      <input
        v-model="timelineTitle"
        type="text"
        placeholder="年表のタイトルを入力"
        class="text-3xl font-bold mb-6 w-full text-center border-b p-2 outline-none" :style="{ color: timelineTheme.text, backgroundColor: timelineTheme.background }"
      />

<!-- 年表タイムライン -->
<div ref="timelineContainer" class="relative w-max min-w-full h-[600px]">

  <!-- 中央線 -->
  <div ref="timelineLine" class="absolute top-1/2 translate-y-8 left-[120px] w-full border-t-2 border-gray-300 z-0" :style="{ borderColor: timelineTheme.line }"></div>

<!-- イベントごとの目盛り -->
<div
  v-for="event in sortedEvents"
  :key="event.id"
  class="absolute flex flex-col items-center z-0"
  :style="{
    left: `${(event.globalIndex + 1) * 120}px`,
    top: '50%', // 中央線の位置に合わせる
    transform: 'translate(-50%, 0%)'
  }"
>
  <!-- 目盛り線（中央線の下に出る） -->
  <div class="h-12 border-l border-gray-400"></div>

  <!-- 日付ラベル（さらにその下） -->
  <div class="text-xs text-gray-500 mt-1">
    {{ new Date(event.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
  </div>
</div>

  <!-- 上表示エリア（2段構成） -->
  <div class="absolute top-4 w-full">
    <div
      v-for="event in topTier1Events"
      :key="event.id"
      class="absolute flex flex-col-reverse items-center"
      :style="{ left: `${(event.globalIndex + 1) * 120}px`, transform: 'translateX(-50%)' }"
    >
      <EventCard
        :event="event"
        position="top"
        @update-event="updateEvent"
        @delete-event="deleteEvent(event.id)"
      />
    </div>
  </div>

  <div class="absolute top-40 w-full">
    <div
      v-for="event in topTier2Events"
      :key="event.id"
      class="absolute flex flex-col-reverse items-center"
      :style="{ left: `${(event.globalIndex + 1) * 120}px`, transform: 'translateX(-50%)' }"
    >
      <EventCard
        :event="event"
        position="top"
        @update-event="updateEvent"
        @delete-event="deleteEvent(event.id)"
      />
    </div>
  </div>

</div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ImageUpload from '@/components/ImageUpload.vue'
import EventCard from '@/components/EventCard.vue'

const timelineTitle = ref('')
const sortKey = ref('date')
const newEvent = ref({
  title: '',
  description: '',
  date: '',
  thumbnail: ''
})
const events = ref([])
const selectedImage = ref(null)
const timelineTheme = ref({
  background: '#ffffff',
  bubble: '#eeeeee',
  line: '#cccccc',
  text: '#000000'
})
const themeColor = ref('')

function onImageSelected(data) {
  selectedImage.value = data
  const colors = data.palette || []

  // 色数が少ない場合のフォールバック対応
  const fallback = (i, def) => colors[i] ?? def

  timelineTheme.value = {
    background: fallback(0, '#ffffff'),
    bubble:     fallback(1, fallback(0, '#eeeeee')),
    line:       fallback(2, '#cccccc'),
    text:       getReadableTextColor(colors[0]) // 背景に応じた可読色
  }
}

function getReadableTextColor(rgbString) {
  if (!rgbString) return '#000000'
  const [r, g, b] = rgbString.match(/\d+/g).map(Number)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance < 128 ? '#ffffff' : '#000000'
}

function addEvent() {
  if (newEvent.value.title && newEvent.value.description && newEvent.value.date) {
    const event = {
      id: Date.now(),
      ...newEvent.value
    }
    events.value.push(event)
    localStorage.setItem('events', JSON.stringify(events.value))
    newEvent.value = { title: '', description: '', date: '', thumbnail: '' }
  }
}

function updateEvent(updatedEvent) {
  const index = events.value.findIndex(event => event.id === updatedEvent.id)
  if (index !== -1) {
    events.value[index] = updatedEvent
    localStorage.setItem('events', JSON.stringify(events.value))
  }
}

function deleteEvent(id) {
  events.value = events.value.filter(event => event.id !== id)
  localStorage.setItem('events', JSON.stringify(events.value))
}

const sortedEvents = computed(() => {
  return events.value
    .filter(e => e && e.title)
    .sort((a, b) => {
      if (sortKey.value === 'title') return a.title.localeCompare(b.title)
      return new Date(a.date) - new Date(b.date)
    })
    .map((event, i) => ({ ...event, globalIndex: i }))
})

const topTier1Events = computed(() => sortedEvents.value.filter((_, i) => i % 2 === 0))
const topTier2Events = computed(() => sortedEvents.value.filter((_, i) => i % 2 === 1))

onMounted(() => {
  const stored = localStorage.getItem('events')
  if (stored) {
    try {
      events.value = JSON.parse(stored).filter(e => e && e.title)
    } catch (e) {
      console.error('JSON parse error', e)
    }
  }
})
</script>

<style scoped>
body {
  margin: 0;
}
</style>
