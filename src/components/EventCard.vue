<template>
  <div>
    <!-- 吹き出し本体 -->
    <div
      class="relative bg-blue-100 p-4 rounded-lg shadow-md max-w-xs group after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent"
      :class="{
        'after:top-full after:border-t-blue-100': position === 'top',
        'after:bottom-full after:border-b-blue-100': position === 'bottom'
      }"
    >
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
        <h3 class="font-bold text-lg">{{ event.title }}</h3>
        <p class="text-sm text-gray-700">{{ event.description }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formattedDate }}</p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: ['event', 'position'],
  data() {
    return {
      isEditing: false,
      editableEvent: { ...this.event }
    };
  },
  watch: {
    event(newVal) {
      this.editableEvent = { ...newVal };
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.event.date);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  methods: {
    startEditing() {
      this.isEditing = true;
    },
    saveEdit() {
      this.$emit('update-event', { ...this.editableEvent });
      this.isEditing = false;
    }
  }
};
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
