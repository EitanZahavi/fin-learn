<template>
  <div class="main-window">
    <div class="header">
      <h1>🇫🇮 Fin Learn</h1>
      <p class="subtitle">Learn Finnish - Spelling Practice</p>
    </div>

    <div class="stats-panel">
      <div class="stat">
        <div class="stat-value">{{ stats.learnedWords }}</div>
        <div class="stat-label">Learned</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ stats.totalWords }}</div>
        <div class="stat-label">Total Words</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ stats.lastUpdated }}</div>
        <div class="stat-label">Updated</div>
      </div>
    </div>

    <div class="categories-section">
      <h2>Select Category</h2>
      <button class="category-btn all-btn" @click="startWithAll">
        <span class="name">All Words</span>
        <span class="count">{{ stats.totalWords }} words</span>
      </button>
      
      <div class="categories-list">
        <button 
          v-for="(category, idx) in categories" 
          :key="idx"
          class="category-btn"
          @click="startWithCategory(category)"
        >
          <span class="name">{{ category.name }}</span>
          <span class="count">{{ category.words.length }} words</span>
          <span v-if="category.learnedCount > 0" class="learned">{{ category.learnedCount }} learned</span>
        </button>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-danger" @click="resetProgress">
        Reset All Statistics
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    stats: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['start'],
  setup(props, { emit }) {
    const startWithAll = () => {
      emit('start', { name: 'All Words', words: [] });
    };

    const startWithCategory = (category) => {
      emit('start', category);
    };

    const resetProgress = () => {
      if (confirm('Are you sure? This will reset all your progress.')) {
        localStorage.removeItem('fin-learn:progress');
        window.location.reload();
      }
    };

    return {
      startWithAll,
      startWithCategory,
      resetProgress
    };
  }
};
</script>

<style scoped>
.main-window {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 8px;
}

.subtitle {
  color: #888;
  font-size: 1rem;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #888;
  margin-top: 4px;
}

.categories-section {
  margin-bottom: 32px;
}

.categories-section h2 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 16px;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.category-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.category-btn:hover {
  border-color: #667eea;
  background: #f0f4ff;
  transform: translateX(4px);
}

.all-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  margin-bottom: 16px;
  font-weight: bold;
}

.all-btn:hover {
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.name {
  font-weight: 500;
}

.count {
  color: #888;
  font-size: 0.9rem;
}

.learned {
  color: #4caf50;
  font-weight: bold;
  font-size: 0.85rem;
}

.actions {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-danger {
  background: #ff6b6b;
  color: white;
}

.btn-danger:hover {
  background: #ff5252;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

@media (max-width: 600px) {
  .main-window {
    padding: 20px 16px;
  }

  .header h1 {
    font-size: 2rem;
  }

  .stats-panel {
    grid-template-columns: 1fr;
  }
}
</style>
