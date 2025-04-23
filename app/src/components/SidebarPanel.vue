<template>
  <aside class="w-80 bg-gray-100 p-4 border-r overflow-y-auto">
    <h2 class="text-xl font-semibold mb-4">操作パネル</h2>

    <!-- セクション：イベント入力 -->
    <section class="mb-4 border rounded-md shadow-sm">
      <header
        @click="toggleSection('event')"
        class="flex items-center justify-between px-4 py-2 cursor-pointer bg-white hover:bg-gray-50 border-b"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">📋</span>
          <span class="font-medium">イベント入力</span>
        </div>
        <span>{{ openSections.event ? '−' : '+' }}</span>
      </header>
      <div v-if="openSections.event" class="p-4 space-y-2">
        <label class="block font-medium">ソート順</label>
        <select v-model="sortKeyProxy" class="w-full p-2 border rounded">
          <option value="date">日付順</option>
          <option value="title">タイトル順</option>
        </select>

        <EventForm
        :form="newEvent"
        :themeColor="themeColor"
        @submit="$emit('add-event')"
      />
          </div>
    </section>

    <!-- セクション：カラー設定 -->
    <section class="mb-4 border rounded-md shadow-sm">
      <header
        @click="toggleSection('color')"
        class="flex items-center justify-between px-4 py-2 cursor-pointer bg-white hover:bg-gray-50 border-b"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">🎨</span>
          <span class="font-medium">カラー設定</span>
        </div>
        <span>{{ openSections.color ? '−' : '+' }}</span>
      </header>
      <div v-if="openSections.color" class="p-4">
        <ColorThemeEditor
          :selectedImage="selectedImage"
          :theme="theme"
          :themeChangedByUser="themeChangedByUser"
          @image-selected="$emit('image-selected', $event)"
          @update-theme="$emit('update-theme', $event)"
        />
      </div>
    </section>

    <!-- セクション：その他設定 -->
    <section class="mb-4 border rounded-md shadow-sm">
      <header
        @click="toggleSection('other')"
        class="flex items-center justify-between px-4 py-2 cursor-pointer bg-white hover:bg-gray-50 border-b"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">⚙️</span>
          <span class="font-medium">表示・その他設定</span>
        </div>
        <span>{{ openSections.other ? '−' : '+' }}</span>
      </header>
      <div v-if="openSections.other" class="p-4 text-sm text-gray-500">
        <p>ここに今後の設定オプションが入ります。</p>
      </div>
    </section>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import ImageUpload from '@/components/ImageUpload.vue'
import EventForm from '@/components/EventForm.vue'
import ColorThemeEditor from '@/components/ColorThemeEditor.vue'

const props = defineProps({
  sortKey: String,
  newEvent: Object,
  selectedImage: Object,
  themeColor: String,
  theme: Object,
  themeChangedByUser: Object
})

const emit = defineEmits(['add-event', 'image-selected', 'update:sortKey', 'update-theme'])
const sortKeyProxy = ref(props.sortKey)

watch(sortKeyProxy, val => emit('update:sortKey', val))



const openSections = ref({ event: true, color: true, other: false })
function toggleSection(key) {
  openSections.value[key] = !openSections.value[key]
}

</script>

<style scoped>
section + section {
  margin-top: 1rem;
}
</style>
