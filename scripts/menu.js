// Menu button and reading mode functionality
document.addEventListener("DOMContentLoaded", function () {
    const tocButton = document.getElementById("menu-toggle");
    const floatingMenu = document.getElementById("floating-menu");
    const chapter1 = document.getElementById("chapter-1");
    let userHasScrolled = false;
    let lastScrollPosition = 0;
    let scrollTimeoutId = null;

    // Ensure TOC button is hidden on load
    tocButton.style.opacity = "0";
    tocButton.style.pointerEvents = "none";
    floatingMenu.style.opacity = "0";
    floatingMenu.style.pointerEvents = "none";

    tocButton.addEventListener('click', () => {
        floatingMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('#floating-menu a, #floating-menu button').forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                floatingMenu.classList.add('hidden');
            }, 150);
        });
    });

    document.getElementById('toggle-reading-mode').addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
    });

    function handleScroll() {
        userHasScrolled = true; // User has scrolled at least once

        // Determine scroll direction
        if (window.scrollY > lastScrollPosition) {
            // Scrolling down
            tocButton.style.opacity = "0";
            tocButton.style.pointerEvents = "none";
            floatingMenu.style.opacity = "0";
            floatingMenu.style.pointerEvents = "none";
        } else {
            tocButton.style.opacity = "1.0";
            tocButton.style.pointerEvents = "auto";
            floatingMenu.style.opacity = "1.0";
            floatingMenu.style.pointerEvents = "auto";
        }

        lastScrollPosition = window.scrollY;
    }

    // Initial check on page load
    if (window.scrollY < chapter1.offsetTop - 50) {
        tocButton.style.opacity = "1.0";
        tocButton.style.pointerEvents = "auto";
        floatingMenu.style.opacity = "1.0";
        floatingMenu.style.pointerEvents = "auto";
    }

    // Listen for first scroll to enable TOC button
    window.addEventListener("scroll", handleScroll, { passive: true });
});
