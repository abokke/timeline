<template>
  <div class="flex h-screen relative">
    <!-- フィードバックボタン -->
    <a
      href="https://forms.gle/pj3aQeAf33UNTSeo6"
      target="_blank"
      class="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
    >
      ご意見・ご要望はこちら
    </a>

    <SidebarPanel
      :sortKey="sortKey"
      :newEvent="newEvent"
      :selectedImage="selectedImage"
      :themeColor="themeColor"
      :theme="timelineTheme"
      :locks="locks"
      @add-event="addEvent"
      @image-selected="onImageSelected"
      @update:sortKey="val => sortKey = val"
      @update-theme="handleThemeUpdate"
      @update-locks="updateLocks"
    />
    <!-- 右：年表表示エリア -->
    <main class="flex-1 p-6 overflow-x-auto relative" :style="{ backgroundColor: timelineTheme.background }">
      <input
        v-model="timelineTitle"
        type="text"
        placeholder="タイトルを入力"
        class="text-3xl font-bold mb-6 w-full text-center border-b p-2 outline-none"
        :style="{ color: timelineTheme.text, backgroundColor: timelineTheme.background }"
      />

      <!-- 年表タイムライン -->
      <div ref="timelineContainer" class="relative w-max min-w-full h-[600px]">
        <div
          ref="timelineLine" 
          class="absolute top-1/2 translate-y-8 left-[120px] w-full border-t-2 z-0"
          :style="{ borderColor: timelineTheme.line }">
        </div>

        <div
          v-for="event in sortedEvents"
          :key="event.id"
          class="absolute flex flex-col items-center z-0"
          :style="{
            left: `${(event.globalIndex + 1) * 120}px`,
            top: '50%',
            transform: 'translate(-50%, 0%)'
          }"
        >
          <div class="h-12 border-l" :style="{ borderLeftColor: timelineTheme.line }"></div>
          <div class="text-xs mt-1" :style="{ color: timelineTheme.text }">
            {{ new Date(event.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
          </div>
        </div>

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
              :bubbleColor="timelineTheme.bubble"
              :textColor="getReadableTextColor(timelineTheme.bubble)"
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
              :bubbleColor="timelineTheme.bubble"
              :textColor="getReadableTextColor(timelineTheme.bubble)"
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
import { ref, computed, onMounted, reactive } from 'vue'
import ImageUpload from '@/components/ImageUpload.vue'
import EventCard from '@/components/EventCard.vue'
import SidebarPanel from '@/components/SidebarPanel.vue'
import { getReadableTextColor } from '@/utils/color.js'

const timelineTitle = ref('')
const sortKey = ref('date')
const newEvent = ref({ title: '', description: '', date: '', thumbnail: '' })
const events = ref([])
const selectedImage = ref(null)
const themeColor = ref('')

const timelineTheme = ref({
  background: '#ffffff',
  bubble: '#eeeeee',
  line: '#cccccc',
  text: '#000000'
})
timelineTheme.value.text = getReadableTextColor(timelineTheme.value.background)

const openSections = ref({ event: true, color: true, other: false })
function toggleSection(key) {
  openSections.value[key] = !openSections.value[key]
}

const locks = reactive({
  background: false,
  bubble: false,
  line: false
})

function onImageSelected(data) {
  selectedImage.value = data
  const colors = data.palette || []
  const fallback = (i, def) => colors[i] ?? def

  if (!locks.background) {
    timelineTheme.value.background = fallback(0, '#ffffff')
    timelineTheme.value.text = getReadableTextColor(timelineTheme.value.background)
  }
  if (!locks.bubble) {
    timelineTheme.value.bubble = fallback(1, timelineTheme.value.background)
  }
  if (!locks.line) {
    timelineTheme.value.line = fallback(2, '#cccccc')
  }
}

function addEvent() {
  if (newEvent.value.title && newEvent.value.description && newEvent.value.date) {
    const event = { id: Date.now(), ...newEvent.value }
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

function handleThemeUpdate(newTheme) {
  timelineTheme.value = newTheme
}

function updateLocks(newLocks) {
  Object.assign(locks, newLocks)
}
</script>

<style scoped>
body {
  margin: 0;
}
</style>
