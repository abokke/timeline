<template>
  <div>
    <div
      class="relative bg-blue-100 p-4 rounded-lg shadow-md max-w-xs group"
      :class="{
        'after:content-[\'\'] after:absolute after:left-1/2 after:-translate-x-1/2 after:border-8': true,
        'after:top-full after:border-transparent after:border-t-blue-100': position === 'top',
        'after:bottom-full after:border-transparent after:border-b-blue-100': position === 'bottom'
      }"
    >
      <!-- ✖️ 削除ボタン（右上・ホバー時のみ表示） -->
      <button
        @click="$emit('delete-event', event.id)"
        class="absolute top-0 right-0 mt-1 mr-1 text-red-500 hover:text-red-700 text-sm hidden group-hover:block"
      >
        ✕
      </button>

      <!-- サムネイル画像（ある場合のみ表示） -->
      <div v-if="event.thumbnail" class="mb-2">
        <img :src="event.thumbnail" alt="thumbnail" class="w-full max-h-40 object-cover rounded-md" />
      </div>

      <h3 class="font-bold text-lg">{{ event.title }}</h3>
      <p class="text-sm text-gray-700">{{ event.description }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ formattedDate }}</p>
    </div>

    <!-- 編集ボタンは下に表示 -->
    <div class="flex justify-end mt-2 space-x-2">
      <button @click="$emit('update-event', event)" class="text-blue-500 text-sm">編集</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: ['event', 'position'],
  computed: {
    formattedDate() {
      const date = new Date(this.event.date);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
:host {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/**** 中央線をタイトル分だけ下にずらす ****/
.absolute.top-1\/2.left-0.border-t-2.border-gray-300.z-0 {
  top: calc(50% + 6rem);
}
</style>