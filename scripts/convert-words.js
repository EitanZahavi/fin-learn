#!/usr/bin/env node

/**
 * Convert words.md to words.json
 * Parses markdown format and creates JSON with categories, dates, and word pairs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wordsMarkdownPath = path.join(__dirname, "../words.md");
const wordsJsonPath = path.join(__dirname, "../public/words.json");

// Ensure public directory exists
const publicDir = path.dirname(wordsJsonPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const content = fs.readFileSync(wordsMarkdownPath, "utf-8");
const lines = content.split("\n");

const categories = [];
let currentCategory = null;
const dateIntroduced = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

for (const line of lines) {
  const trimmed = line.trim();

  // Skip empty lines
  if (!trimmed) continue;

  // Category heading (# Category Name)
  if (trimmed.startsWith("#")) {
    if (currentCategory && currentCategory.words.length > 0) {
      categories.push(currentCategory);
    }
    const categoryName = trimmed.replace(/^#+\s*/, "").trim();
    currentCategory = {
      name: categoryName,
      dateIntroduced,
      words: [],
    };
    continue;
  }

  // Skip if no category yet
  if (!currentCategory) continue;

  // Parse word pairs
  // Handles pipes (|) as separate pairs and semicolons (;) for ignoring partitive flavors
  const pairs = trimmed.split("|").map((p) => p.trim());

  for (const pair of pairs) {
    if (!pair.includes("=")) continue;

    // Remove partitive flavor (after semicolon)
    const cleanPair = pair.split(";")[0].trim();
    const [finnish, english] = cleanPair.split("=").map((s) => s.trim());

    if (!finnish || !english) continue;

    // Split English translations by comma
    const englishTranslations = english
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    currentCategory.words.push({
      finnish,
      english: englishTranslations,
      dateIntroduced,
    });
  }
}

// Add last category
if (currentCategory && currentCategory.words.length > 0) {
  categories.push(currentCategory);
}

// Create output JSON
const output = {
  version: "1.0",
  lastUpdated: dateIntroduced,
  categories,
};

// Write to file
fs.writeFileSync(wordsJsonPath, JSON.stringify(output, null, 2), "utf-8");

console.log(`✓ Converted ${categories.length} categories`);
let totalWords = 0;
categories.forEach((cat) => {
  console.log(`  - ${cat.name}: ${cat.words.length} words`);
  totalWords += cat.words.length;
});
console.log(`✓ Total: ${totalWords} words`);
console.log(`✓ Written to: ${wordsJsonPath}`);
