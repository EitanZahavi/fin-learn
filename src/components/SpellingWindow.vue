<template>
  <div class="spelling-window">
    <div class="header">
      <button class="back-btn" @click="goBack">← Back</button>
      <div class="category-title">{{ category.name }}</div>
      <div class="progress-info">
        {{ currentWordIndex + 1 }} / {{ wordsInCategory.length }}
      </div>
    </div>

    <div class="direction-control">
      <button 
        :class="{ active: direction === 'f2e' }"
        @click="direction = 'f2e'"
      >
        🇫🇮 Finnish → English
      </button>
      <button 
        :class="{ active: direction === 'e2f' }"
        @click="direction = 'e2f'"
      >
        English → 🇫🇮 Finnish
      </button>
    </div>

    <div class="word-card">
      <div class="instruction">
        Type the {{ direction === 'f2e' ? 'English' : 'Finnish' }} translation:
      </div>
      <div class="word-display">
        {{ direction === 'f2e' ? currentWord.finnish : currentWord.english.join(' / ') }}
      </div>
    </div>

    <div class="input-section">
      <input 
        v-model="userAnswer"
        @keyup.enter="checkAnswer"
        :disabled="showResult"
        type="text"
        placeholder="Type your answer..."
        class="answer-input"
        autocomplete="off"
        ref="inputRef"
      />
      
      <button 
        @click="checkAnswer"
        :disabled="!userAnswer.trim() || showResult"
        class="check-btn"
      >
        Check
      </button>
    </div>

    <div v-if="showResult" class="result" :class="{ correct: isCorrect }">
      <div v-if="isCorrect" class="result-icon">✓</div>
      <div v-else class="result-icon">✗</div>
      
      <div class="result-text">
        <div v-if="isCorrect" class="correct-msg">Correct! 🎉</div>
        <div v-else class="incorrect-msg">
          <div>Incorrect!</div>
          <div class="correct-answer">
            Correct answer{{ expectedAnswers.length > 1 ? 's' : '' }}: <strong>{{ expectedAnswers.join(', ') }}</strong>
          </div>
        </div>
      </div>

      <button @click="nextWord" class="next-btn">
        {{ currentWordIndex < wordsInCategory.length - 1 ? 'Next Word →' : 'Back' }}
      </button>
    </div>

    <div v-if="!showResult" class="keyboard">
      <button 
        v-for="letter in 'abcdefghijklmnopqrstuvwxyzäöå'" 
        :key="letter"
        @click="userAnswer += letter"
        class="key"
      >
        {{ letter }}
      </button>
      <button @click="userAnswer = userAnswer.slice(0, -1)" class="key key-special">
        ← Backspace
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useLocalStorage } from '../services/storage.js';

export default {
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  emits: ['back'],
  setup(props, { emit }) {
    const direction = ref('f2e');
    const userAnswer = ref('');
    const showResult = ref(false);
    const isCorrect = ref(false);
    const currentWordIndex = ref(0);
    const inputRef = ref(null);

    const { updateWordProgress, getWordProgress } = useLocalStorage();

    // Get words sorted by lowest success count (weighted random selection)
    const wordsInCategory = computed(() => {
      if (!props.category.words || props.category.words.length === 0) {
        return [];
      }

      const withProgress = props.category.words.map(word => ({
        ...word,
        progress: getWordProgress(props.category.name, word.finnish)
      }));

      // Sort by successCount (lowest first) for priority learning
      return withProgress.sort((a, b) => 
        a.progress.successCount - b.progress.successCount
      );
    });

    const currentWord = computed(() => {
      return wordsInCategory.value[currentWordIndex.value];
    });

    const expectedAnswers = computed(() => {
      if (!currentWord.value) return [];
      return direction.value === 'f2e' 
        ? currentWord.value.english 
        : [currentWord.value.finnish];
    });

    onMounted(() => {
      nextTick(() => {
        inputRef.value?.focus();
      });
    });

    const normalizeAnswer = (answer) => {
      return answer.toLowerCase().trim();
    };

    const checkAnswer = () => {
      if (!userAnswer.value.trim()) return;

      const normalized = normalizeAnswer(userAnswer.value);
      const expectedNormalized = expectedAnswers.value.map(ans => normalizeAnswer(ans));

      isCorrect.value = expectedNormalized.includes(normalized);
      updateWordProgress(props.category.name, currentWord.value.finnish, isCorrect.value);
      showResult.value = true;
    };

    const nextWord = () => {
      if (currentWordIndex.value < wordsInCategory.value.length - 1) {
        currentWordIndex.value++;
        userAnswer.value = '';
        showResult.value = false;
        nextTick(() => {
          inputRef.value?.focus();
        });
      } else {
        emit('back');
      }
    };

    const goBack = () => {
      emit('back');
    };

    return {
      direction,
      userAnswer,
      showResult,
      isCorrect,
      currentWordIndex,
      wordsInCategory,
      currentWord,
      expectedAnswers,
      checkAnswer,
      nextWord,
      goBack,
      inputRef
    };
  }
};
</script>

<style scoped>
.spelling-window {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #667eea;
  font-weight: bold;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f0f4ff;
}

.category-title {
  flex: 1;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.progress-info {
  font-size: 0.9rem;
  color: #888;
  min-width: 80px;
  text-align: right;
}

.direction-control {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.direction-control button {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.direction-control button.active {
  border-color: #667eea;
  background: #f0f4ff;
  color: #667eea;
}

.word-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  text-align: center;
}

.instruction {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 16px;
}

.word-display {
  font-size: 2.5rem;
  font-weight: bold;
  word-break: break-word;
}

.input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.answer-input {
  flex: 1;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.answer-input:focus {
  outline: none;
  border-color: #667eea;
}

.answer-input:disabled {
  background: #f5f5f5;
  color: #888;
}

.check-btn {
  padding: 16px 32px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.check-btn:hover:not(:disabled) {
  background: #764ba2;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.check-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result {
  background: #f9f9f9;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  border-left: 4px solid #4caf50;
}

.result.incorrect {
  border-left-color: #ff6b6b;
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.result .correct {
  color: #4caf50;
}

.result.incorrect {
  color: #ff6b6b;
}

.correct-msg {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4caf50;
}

.incorrect-msg {
  color: #ff6b6b;
}

.incorrect-msg .correct-answer {
  margin-top: 12px;
  font-size: 0.95rem;
  color: #333;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.next-btn {
  margin-top: 16px;
  padding: 12px 32px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.next-btn:hover {
  background: #764ba2;
}

.keyboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 8px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
}

.key {
  padding: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.key:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.key-special {
  grid-column: span 2;
}

@media (max-width: 600px) {
  .spelling-window {
    padding: 16px;
  }

  .word-display {
    font-size: 1.8rem;
  }

  .keyboard {
    grid-template-columns: repeat(auto-fit, minmax(35px, 1fr));
    gap: 6px;
  }
}
</style>
