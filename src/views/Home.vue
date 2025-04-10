<template>
  <div class="flex h-screen">
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
      <div class="relative w-max min-w-full h-[600px]">
        <!-- 中央線 -->
        <div class="absolute top-1/2 translate-y-8 left-0 w-full border-t-2 border-gray-300 z-0">
          <div
            v-for="i in 10"
            :key="i"
            class="absolute h-8 border-l border-gray-400 -top-4"
            :style="{ left: `${i * 120}px` }"
          >
            <div v-if="sortedEvents.length > 0" class="text-xs text-gray-500 mt-8 -ml-6">{{ `Day ${i}` }}</div>
          </div>
        </div>

        <!-- 上表示エリア -->
        <div class="absolute top-0 w-full flex px-10 gap-20 justify-start">
          <div
            v-for="event in topEvents"
            :key="event.id"
            class="flex flex-col items-center"
            :style="{ transform: `translateX(${event.globalIndex * 80}px)` }"
          >
            <EventCard
              :event="event"
              position="top"
              @update-event="updateEvent"
              @delete-event="deleteEvent(event.id)"
            />
          </div>
        </div>

        <!-- 下表示エリア（中央線と被らないよう余白追加） -->
        <div class="absolute bottom-0 w-full flex px-10 gap-20 justify-start pt-24">
          <div
            v-for="event in bottomEvents"
            :key="event.id"
            class="flex flex-col-reverse items-center"
            :style="{ transform: `translateX(${event.globalIndex * 80}px)` }"
          >
            <EventCard
              :event="event"
              position="bottom"
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
  components: {
    EventCard
  },
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
      let result = [...this.events];
      if (this.sortKey === 'title') {
        result.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      return result.map((event, i) => ({ ...event, globalIndex: i }));
    },
    topEvents() {
      return this.sortedEvents.filter((_, i) => i % 2 === 0);
    },
    bottomEvents() {
      return this.sortedEvents.filter((_, i) => i % 2 === 1);
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
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
}
</style>