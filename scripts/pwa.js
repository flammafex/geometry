// Progressive Web App service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service worker registered.', reg))
    .catch(err => console.error('Service worker registration failed:', err));
}
