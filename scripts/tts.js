// Text-to-Speech functionality using built-in OS TTS
// Multilingual support

function extractMultilingualChunks(el) {
  const chunks = [];

  function walk(node, currentLang = 'en-US') {
    if (node.nodeType === Node.TEXT_NODE) {
      const trimmed = node.textContent.trim();
      if (trimmed.length > 0) {
        chunks.push({ text: trimmed, lang: currentLang });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.getAttribute('aria-hidden') === 'true') return;

      const newLang = node.getAttribute('lang') || currentLang;

      // If this node has an aria-label, prefer it over any content inside
      if (node.hasAttribute('aria-label')) {
        const labelText = node.getAttribute('aria-label').trim();
        if (labelText.length > 0) {
          chunks.push({ text: labelText, lang: newLang });
          return; // Skip children — aria-label takes priority
        }
      }

      for (const child of node.childNodes) {
        walk(child, newLang);
      }
    }
  }

  walk(el);
  return chunks;
}

let currentlySpeakingElement = null;
let ttsCancelled = false;

// Read aloud a given element
function readAloud(element) {
  // Stop current playback if already speaking this element
  if (speechSynthesis.speaking && currentlySpeakingElement === element) {
    ttsCancelled = true;
    speechSynthesis.cancel();
    currentlySpeakingElement = null;
    return;
  }

  const chunks = extractMultilingualChunks(element);
  if (chunks.length === 0) return;

  ttsCancelled = false;
  speechSynthesis.cancel();
  currentlySpeakingElement = element;

  function speakNext(index) {
    if (ttsCancelled || index >= chunks.length) {
      currentlySpeakingElement = null;
      return;
    }

    const chunk = chunks[index];
    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.lang = chunk.lang;
    utterance.rate = 1;

    utterance.onend = () => setTimeout(() => speakNext(index + 1), 50);
    utterance.onerror = () => setTimeout(() => speakNext(index + 1), 50);

    speechSynthesis.speak(utterance);
    setTimeout(() => speechSynthesis.resume(), 0);
  }

  setTimeout(() => speakNext(0), 100);
}

// Add TTS Buttons
function addVerseTTSButtons() {
  const chapters = document.querySelectorAll('.chapter');

  chapters.forEach(chapter => {
    const btn = document.createElement('button');
    btn.textContent = '🎧';
    btn.className = 'verse-tts-button';
    btn.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', () => readAloud(chapter.parentNode));

    chapter.insertBefore(btn, chapter.firstChild);
  });

  const subchapters = document.querySelectorAll('.subchapter');

  subchapters.forEach(subchapter => {
    const btn = document.createElement('button');
    btn.textContent = '🎧';
    btn.className = 'verse-tts-button';
    btn.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', () => readAloud(subchapter.parentNode));

    subchapter.insertBefore(btn, subchapter.firstChild);
  });

  const verses = document.querySelectorAll('.verse');

  verses.forEach(verse => {
    const btn = document.createElement('button');
    btn.textContent = '🎧';
    btn.className = 'verse-tts-button';
    btn.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', () => readAloud(verse));

    verse.insertBefore(btn, verse.firstChild);
  });
}

document.addEventListener('DOMContentLoaded', addVerseTTSButtons);
