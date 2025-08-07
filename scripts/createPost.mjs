import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import readline from 'readline';
import { slugify } from './utils/slugify.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (q) => new Promise(resolve => rl.question(q, resolve));

const now = new Date();
const isoDatetime = now.toISOString();
const year = now.getFullYear();
const folderPath = path.join('src', 'data', 'blog', String(year));

async function main() {
  // eslint-disable-next-line no-console
  console.log('📝 Create a new blog post (full metadata)\n');

  const title = await requiredInput('Title (required): ');
  const description = await requiredInput('Description (required): ');

  const pubDatetime = isoDatetime;
  const modDatetime = await optionalInput('Modified datetime (optional, press Enter to skip): ') || '';

  const author = await optionalInput('Author (press Enter to use default Shinkai Kung): ') || 'Shinkai Kung';
  const slug = slugify(title);
  const customSlug = await optionalInput(`Slug (press Enter to use auto "${slug}"): `) || slug;

  const featured = await booleanInput('Featured on homepage? (y/N): ', false);
  const draft = await booleanInput('Is draft? (y/N): ', false);
  const tagsInput = await optionalInput('Tags (comma-separated, default: others): ') || 'others';
  const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);

  const ogImage = await optionalInput('OG Image URL or relative path (optional): ') || '';
  const canonicalURL = await optionalInput('Canonical URL (optional): ') || '';
  const hideEditPost = await booleanInput('Hide edit button? (y/N): ', false);
  const timezone = await optionalInput('Timezone (IANA format, optional): ') || '';

  const frontmatter = `---
title: ${title}
description: ${description}
pubDatetime: ${pubDatetime}
${modDatetime ? `modDatetime: ${modDatetime}` : ''}
author: ${author}
slug: ${customSlug}
featured: ${featured}
draft: ${draft}
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
${ogImage ? `ogImage: "${ogImage}"` : '# ogImage: https://example.org/remote-image.png'}
${canonicalURL ? `canonicalURL: "${canonicalURL}"` : ''}
hideEditPost: ${hideEditPost}
${timezone ? `timezone: ${timezone}` : ''}
---
`;

  const fileName = `${customSlug}.md`;
  const fullPath = path.join(folderPath, fileName);

  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
    // eslint-disable-next-line no-console
    console.log(`📁 Created folder: ${folderPath}`);
  }

  await writeFile(fullPath, frontmatter + '\n## Table of contents\n', 'utf8');
  // eslint-disable-next-line no-console
  console.log(`✅ Post created at: ${fullPath}`);
  rl.close();
}

async function requiredInput(promptText) {
  let input = '';
  while (!input) {
    input = await question(promptText);
    // eslint-disable-next-line no-console
    if (!input) console.log('⚠️  This field is required.');
  }
  return input;
}

async function optionalInput(promptText) {
  const input = await question(promptText);
  return input;
}

async function booleanInput(promptText, defaultValue = false) {
  const input = (await question(promptText)).toLowerCase();
  if (input === 'y' || input === 'yes') return true;
  if (input === 'n' || input === 'no') return false;
  return defaultValue;
}

main();
