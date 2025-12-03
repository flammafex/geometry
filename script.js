// Main loader - imports all modular scripts
// This file coordinates the loading of all application modules

// Core modules are loaded via script tags in index.html:
// 1. scripts/pwa.js - Progressive Web App setup
// 2. scripts/menu.js - Menu and reading mode
// 3. scripts/tts.js - Text-to-speech functionality
// 4. scripts/figures.js - Figure registry and helpers
// 5. scripts/figures/*.js - Individual figure initializers

// Hidden reveal utility (small standalone feature)
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".hidden-reveal").forEach(span => {
        span.addEventListener("click", () => {
            span.classList.toggle("clicked");
        });
    });
});
