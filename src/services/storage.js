/**
 * Local storage service for managing word progress
 */

const PROGRESS_KEY = "fin-learn:progress";
const LAST_STUDY_DATE_KEY = "fin-learn:lastStudyDate";

export function useLocalStorage() {
  const loadProgress = () => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load progress:", e);
      return {};
    }
  };

  const saveProgress = (progress) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  };

  const updateWordProgress = (categoryName, finnish, isCorrect) => {
    const progress = loadProgress();
    const key = `${categoryName}|${finnish}`;

    if (!progress[key]) {
      progress[key] = {
        successCount: 0,
        dateIntroduced: new Date().toISOString().split("T")[0],
      };
    }

    if (isCorrect) {
      progress[key].successCount++;
    } else {
      progress[key].successCount = Math.max(0, progress[key].successCount - 1);
    }

    saveProgress(progress);
    updateLastStudyDate();
    return progress[key];
  };

  const getWordProgress = (categoryName, finnish) => {
    const progress = loadProgress();
    const key = `${categoryName}|${finnish}`;
    return (
      progress[key] || {
        successCount: 0,
        dateIntroduced: new Date().toISOString().split("T")[0],
      }
    );
  };

  const resetAllProgress = () => {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(LAST_STUDY_DATE_KEY);
  };

  const updateLastStudyDate = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(LAST_STUDY_DATE_KEY, today);
  };

  const loadLastStudyDate = () => {
    return localStorage.getItem(LAST_STUDY_DATE_KEY) || null;
  };

  return {
    loadProgress,
    saveProgress,
    updateWordProgress,
    getWordProgress,
    resetAllProgress,
    updateLastStudyDate,
    loadLastStudyDate,
  };
}
