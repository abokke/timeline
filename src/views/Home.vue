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

        <button @click="addEvent" class="w-full bg-blue-500 text-white p-2 rounded">追加</button>
      </div>
    </aside>

    <!-- 右：年表表示エリア -->
    <main class="flex-1 p-6 overflow-x-auto relative">
      <input
        v-model="timelineTitle"
        type="text"
        placeholder="年表のタイトルを入力"
        class="text-3xl font-bold mb-6 w-full text-center border-b p-2 outline-none"
      />

<!-- 年表タイムライン -->
<div ref="timelineContainer" class="relative w-max min-w-full h-[600px]">

  <!-- 中央線 -->
  <div ref="timelineLine" class="absolute top-1/2 translate-y-8 left-[120px] w-full border-t-2 border-gray-300 z-0"></div>

  <!-- イベントごとの目盛り -->
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

<script>
import EventCard from '@/components/EventCard.vue';

export default {
  name: 'HomeLayout',
  components: { EventCard },
  data() {
    return {
      timelineTitle: '',
      newEvent: {
        title: '',
        description: '',
        date: '',
        thumbnail: ''
      },
      events: [],
      sortKey: 'date'
    };
  },
  computed: {
    sortedEvents() {
      return this.events
        .filter(e => e && e.title)
        .sort((a, b) => {
          if (this.sortKey === 'title') {
            return a.title.localeCompare(b.title);
          }
          return new Date(a.date) - new Date(b.date);
        })
        .map((event, i) => ({ ...event, globalIndex: i }));
    },
    topTier1Events() {
      return this.sortedEvents.filter((e, i) => e && e.title && i % 2 === 0);
    },
    topTier2Events() {
      return this.sortedEvents.filter((e, i) => e && e.title && i % 2 === 1);
    }
  },
  methods: {
    addEvent() {
      if (this.newEvent.title && this.newEvent.description && this.newEvent.date) {
        const newEvent = {
          id: Date.now(),
          title: this.newEvent.title,
          description: this.newEvent.description,
          date: this.newEvent.date,
          thumbnail: this.newEvent.thumbnail
        };
        this.events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(this.events));
        this.newEvent.title = '';
        this.newEvent.description = '';
        this.newEvent.date = '';
        this.newEvent.thumbnail = '';
      }
    },
    updateEvent(updatedEvent) {
      const index = this.events.findIndex(event => event.id === updatedEvent.id);
      if (index !== -1) {
        this.events.splice(index, 1, updatedEvent);
        localStorage.setItem('events', JSON.stringify(this.events));
      }
    },
    deleteEvent(id) {
      this.events = this.events.filter(event => event.id !== id);
      localStorage.setItem('events', JSON.stringify(this.events));
    }
  },
  mounted() {
    const stored = localStorage.getItem('events');
    if (stored) {
      try {
        this.events = JSON.parse(stored).filter(e => e && e.title);
      } catch (e) {
        console.error('JSON parse error', e);
      }
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
}
</style>
