<template>
  <div class="timeline p-6 space-y-6">
    <EventCard v-for="(event, index) in events" :key="index" :event="event" />
  </div>
</template>

<script>
import EventCard from './EventCard.vue';

export default {
  components: {
    EventCard,
  },
  data() {
    return {
      events: [
        {
          title: '初配信',
          date: '2023/01/01',
          description: '最初の配信が始まりました！',
          detailedDescription: '配信の詳細やエピソードについての詳細な説明。',
          icon: 'https://via.placeholder.com/50', // 画像URL（任意）
        },
        {
          title: 'コラボ配信',
          date: '2023/04/01',
          description: '他のVTuberとコラボ！',
          detailedDescription: 'コラボの詳細や配信内容。',
          icon: 'https://via.placeholder.com/50', // 画像URL（任意）
        },
      ],
    };
  },
};
</script>

<style scoped>
.timeline {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>
