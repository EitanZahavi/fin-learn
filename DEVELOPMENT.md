# Fin Learn - Development Guide

## Project Structure

```
fin-learn/
├── src/
│   ├── main.js                 # Vue app entry point
│   ├── App.vue                 # Root component
│   ├── components/
│   │   ├── MainWindow.vue      # Dictionary selection & stats screen
│   │   └── SpellingWindow.vue  # Spelling practice screen
│   └── services/
│       └── storage.js          # LocalStorage management for progress
├── scripts/
│   └── convert-words.js        # Converts words.md → words.json
├── public/
│   └── words.json              # Generated dictionary (341 words)
├── dist/                       # Production build output
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── netlify.toml                # Netlify deployment config
└── package.json                # Dependencies & scripts
```

## How It Works

### 1. Dictionary Conversion

- **Input**: `words.md` (manually maintained)
- **Process**: `scripts/convert-words.js` parses:
  - Markdown sections (grouped by `#`)
  - Word pairs: `Finnish = English`
  - Multiple translations: `Finnish = english1, english2`
  - Pipe separators: `Word1 = trans1 | Word2 = trans2`
  - Ignores text after `;` (partitive flavors)
- **Output**: `public/words.json` (and copied to `dist/`)
- **Run**: `npm run build` triggers the conversion

### 2. App Structure

#### MainWindow Component

- Shows statistics: learned words / total words / last update date
- Lists all categories with word counts
- "All Words" button for studying all categories together
- Reset button to clear all progress

#### SpellingWindow Component

- Direction toggle: Finnish→English or English→Finnish
- Word card displays current word
- Text input for user answer
- "Check" button validates answer
- Mobile keyboard with Finnish letters (äöå)
- Progress tracking (X / Total)
- Sorts words by lowest success count for adaptive learning

### 3. Progress Tracking (LocalStorage)

**Storage Keys**:

- `fin-learn:progress` - Word-by-word success counts
- `fin-learn:lastStudyDate` - Last study session date

**Word Record**:

```javascript
{
  "CategoryName|FinnishWord": {
    "successCount": 2,           // 0-4, incremented on correct, decremented on wrong (min 0)
    "dateIntroduced": "2026-03-08"
  }
}
```

**Algorithm**:

1. Words sorted by lowest `successCount` (reinforces weakest words)
2. Randomly selected from lowest-scoring words in category
3. Correct answers: `successCount++`
4. Incorrect answers: `successCount = max(0, successCount - 1)`
5. When `successCount >= 4`: word marked as "learned"
6. Statistics updated in real-time

## Development

### Run Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Creates optimized `dist/` folder for deployment

### Deploy to Netlify

Option 1: Direct GitHub Integration

1. Push code to GitHub
2. Connect repo to Netlify
3. Deploy (automatic on push)

Option 2: Manual Deploy

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## Technology Stack

- **Frontend**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Scoped CSS
- **Data**: JSON + LocalStorage
- **Deployment**: Netlify

## Future Enhancements

- [ ] Audio pronunciation
- [ ] Add more words/categories
- [ ] Spaced repetition algorithm
- [ ] Statistics dashboard
- [ ] Multiple languages (not just Finnish→English)
- [ ] Dark mode
- [ ] Export/import progress

## Dictionary Stats

- **Total Words**: 341
- **Categories**: 12
  - Question Words and Reference: 13 words
  - Geography and Countries: 29 words
  - Kitchen Related: 45 words
  - Food and Eating: 36 words
  - Occupations: 3 words
  - Nouns: 7 words
  - Verbs: 27 words
  - Adjectives: 104 words
  - Family and Kids: 20 words
  - Basic Body: 32 words
  - Animals: 15 words
  - Numbers: 10 words

## Notes

- All progress is stored locally in the browser (no server needed)
- Can be used offline after first load
- Works on all modern browsers and mobile devices
- Finnish special characters (ä, ö, å) available in on-screen keyboard
