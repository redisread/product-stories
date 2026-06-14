import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const STORIES_DIR = 'src/content/stories';

function getAllStories() {
  const stories = [];
  const dirs = readdirSync(STORIES_DIR, { withFileTypes: true });
  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const files = readdirSync(join(STORIES_DIR, dir.name));
      for (const file of files) {
        if (file.endsWith('.mdx')) {
          stories.push(join(STORIES_DIR, dir.name, file));
        }
      }
    }
  }
  return stories;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      // Remove quotes
      if ((value.startsWith("'") && value.endsWith("'")) || 
          (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
      fm[key] = value;
    }
  }
  return fm;
}

function countWords(content) {
  // Remove frontmatter
  const body = content.replace(/^---[\s\S]*?---/, '');
  // Remove markdown/HTML syntax
  const clean = body.replace(/[#*`()\[\]{}<>]/g, ' ').replace(/https?:\/\/\S+/g, '');
  // Count: Chinese chars + English words
  const chineseChars = (clean.match(/[一-龥]/g) || []).length;
  const englishWords = clean.replace(/[一-]/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
  return chineseChars + englishWords;
}

function estimateReadingTime(wordCount) {
  // Mixed Chinese/English: ~300 chars/words per minute
  return Math.ceil(wordCount / 300);
}

const stories = getAllStories();
console.log(`Found ${stories.length} stories\n`);

let totalWords = 0;
let warnings = [];
let errors = [];

for (const story of stories) {
  const content = readFileSync(story, 'utf-8');
  const fm = parseFrontmatter(content);
  
  if (!fm) {
    errors.push(`${story}: Missing frontmatter`);
    continue;
  }
  
  const words = countWords(content);
  const readingTime = estimateReadingTime(words);
  totalWords += words;
  
  // Check required fields
  if (!fm.title) errors.push(`${story}: Missing title`);
  if (!fm.date) errors.push(`${story}: Missing date`);
  if (!fm.products) errors.push(`${story}: Missing products`);
  if (!fm.cover) warnings.push(`${story}: Missing cover image`);
  
  // Check cover URL format
  if (fm.cover && !fm.cover.startsWith('https://')) {
    errors.push(`${story}: Cover URL must be https: ${fm.cover}`);
  }
  
  // Check reading time
  if (fm.readingTime) {
    const fmTime = parseInt(fm.readingTime);
    if (Math.abs(fmTime - readingTime) > 2) {
      warnings.push(`${story}: Reading time mismatch (frontmatter: ${fmTime}min, calculated: ${readingTime}min)`);
    }
  } else {
    warnings.push(`${story}: Missing readingTime in frontmatter`);
  }
  
  // Check tags count
  if (fm.tags) {
    const tagCount = fm.tags.split(',').length;
    if (tagCount > 8) {
      warnings.push(`${story}: Too many tags (${tagCount}), max is 8`);
    }
  }
}

console.log('=== Statistics ===');
console.log(`Total stories: ${stories.length}`);
console.log(`Total words: ${totalWords}`);
console.log(`Average words per story: ${Math.round(totalWords / stories.length)}`);
console.log();

if (errors.length > 0) {
  console.log(`=== Errors (${errors.length}) ===`);
  for (const error of errors) console.log(error);
}

if (warnings.length > 0) {
  console.log(`\n=== Warnings (${warnings.length}) ===`);
  for (const warning of warnings) console.log(warning);
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('All checks passed!');
}

process.exit(errors.length > 0 ? 1 : 0);
