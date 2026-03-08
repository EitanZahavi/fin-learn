<template>
  <div class="app">
    <MainWindow v-if="!isStudying" @start="startStudy" :stats="stats" />
    <SpellingWindow v-else @back="stopStudy" :category="currentCategory" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import MainWindow from './components/MainWindow.vue';
import SpellingWindow from './components/SpellingWindow.vue';
import { useLocalStorage } from './services/storage.js';

export default {
  components: {
    MainWindow,
    SpellingWindow
  },
  setup() {
    const isStudying = ref(false);
    const currentCategory = ref(null);
    const wordsList = ref([]);
    const progress = ref({});

    const { loadProgress, saveProgress, loadLastStudyDate } = useLocalStorage();

    onMounted(async () => {
      // Load words dictionary
      const response = await fetch('/words.json');
      const data = await response.json();
      wordsList.value = data;

      // Load progress
      progress.value = loadProgress();

      // Initialize new words if first time or new words added
      initializeNewWords(data);
    });

    const initializeNewWords = (data) => {
      const lastDate = loadLastStudyDate();
      data.categories.forEach(category => {
        category.words.forEach(word => {
          const key = `${category.name}|${word.finnish}`;
          if (!progress.value[key]) {
            progress.value[key] = {
              successCount: 0,
              dateIntroduced: word.dateIntroduced
            };
          }
        });
      });
      saveProgress(progress.value);
    };

    const stats = computed(() => {
      let totalWords = 0;
      let learnedWords = 0;

      wordsList.value?.categories?.forEach(category => {
        category.words.forEach(word => {
          totalWords++;
          const key = `${category.name}|${word.finnish}`;
          if (progress.value[key]?.successCount >= 4) {
            learnedWords++;
          }
        });
      });

      return {
        totalWords,
        learnedWords,
        lastUpdated: wordsList.value?.lastUpdated || 'N/A'
      };
    });

    const categories = computed(() => {
      return wordsList.value?.categories?.map(cat => ({
        ...cat,
        learnedCount: cat.words.filter(w => {
          const key = `${cat.name}|${w.finnish}`;
          return progress.value[key]?.successCount >= 4;
        }).length
      })) || [];
    });

    const startStudy = (selectedCategory) => {
      currentCategory.value = selectedCategory;
      isStudying.value = true;
    };

    const stopStudy = () => {
      isStudying.value = false;
      currentCategory.value = null;
    };

    return {
      isStudying,
      currentCategory,
      stats,
      categories,
      startStudy,
      stopStudy,
      progress
    };
  }
};
</script>

<style scoped>
.app {
  width: 100%;
}
</style>
