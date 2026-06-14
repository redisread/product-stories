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

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const lines = match[1].split('\n');
  const fm = {};
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      fm[key.trim()] = valueParts.join(':').trim();
    }
  }
  return fm;
}

function validateImages(content, file) {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const images = [];
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({ url: match[1], file });
  }
  return images;
}

function countWords(text) {
  // Remove frontmatter
  const content = text.replace(/^---[\s\S]*?---/, '');
  // Remove markdown syntax
  const clean = content.replace(/[#*`\[\]()]/g, ' ');
  // Count words (Chinese characters count as 1 word each, English words separated by spaces)
  const chineseChars = (clean.match(/[一-龥]/g) || []).length;
  const englishWords = clean.replace(/[一-龥]/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
  return chineseChars + englishWords;
}

function estimateReadingTime(wordCount) {
  // Average reading speed: 200 words per minute for mixed Chinese/English
  return Math.ceil(wordCount / 200);
}

const stories = getAllStories();
console.log(`Found ${stories.length} stories\n`);

let totalWords = 0;
let totalImages = 0;
let issues = [];

for (const story of stories) {
  const content = readFileSync(story, 'utf-8');
  const fm = extractFrontmatter(content);
  const words = countWords(content);
  const readingTime = estimateReadingTime(words);
  const images = validateImages(content, story);
  
  totalWords += words;
  totalImages += images.length;
  
  // Check reading time in frontmatter
  if (fm.readingTime) {
    const fmTime = parseInt(fm.readingTime);
    if (Math.abs(fmTime - readingTime) > 1) {
      issues.push(`${story}: Reading time mismatch (frontmatter: ${fmTime}min, calculated: ${readingTime}min)`);
    }
  }
}

console.log('=== Statistics ===');
console.log(`Total stories: ${stories.length}`);
console.log(`Total words: ${totalWords}`);
console.log(`Total images: ${totalImages}`);
console.log(`Average words per story: ${Math.round(totalWords / stories.length)}`);
console.log();

if (issues.length > 0) {
  console.log('=== Issues ===');
  for (const issue of issues) {
    console.log(issue);
  }
} else {
  console.log('No issues found!');
}
