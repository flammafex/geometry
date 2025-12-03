#!/usr/bin/env node
/**
 * Build script for Euclid's Geometry
 * Concatenates modular HTML sections into a single index.html
 */

const fs = require('fs');
const path = require('path');

// Directories
const SRC_DIR = path.join(__dirname, 'src');
const PARTIALS_DIR = path.join(SRC_DIR, 'partials');
const SECTIONS_DIR = path.join(SRC_DIR, 'sections');
const OUTPUT_FILE = path.join(__dirname, 'index.html');

/**
 * Read all HTML files from a directory recursively, sorted alphabetically
 */
function readSectionFiles(dir) {
  const files = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    // Sort entries alphabetically
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Build the complete HTML file
 */
function build() {
  console.log('🔨 Building Euclid\'s Geometry...\n');

  // Read partials
  const head = fs.readFileSync(path.join(PARTIALS_DIR, 'head.html'), 'utf8');
  const header = fs.readFileSync(path.join(PARTIALS_DIR, 'header.html'), 'utf8');
  const footer = fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8');

  console.log('✓ Loaded partials');

  // Read all section files
  const sectionFiles = readSectionFiles(SECTIONS_DIR);
  console.log(`✓ Found ${sectionFiles.length} section files`);

  // Concatenate sections
  const sectionsContent = sectionFiles.map(file => {
    const relativePath = path.relative(SECTIONS_DIR, file);
    console.log(`  - ${relativePath}`);
    return fs.readFileSync(file, 'utf8');
  }).join('\n\n');

  // Assemble final HTML
  const output = `${head}
${header}
${sectionsContent}
${footer}`;

  // Write output
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

  const stats = fs.statSync(OUTPUT_FILE);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  console.log(`\n✅ Built index.html (${sizeMB} MB, ${sectionFiles.length} sections)`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
}

// Run build
try {
  build();
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
