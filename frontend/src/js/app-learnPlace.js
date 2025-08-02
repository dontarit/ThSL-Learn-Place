// src/utils/uiEvents.js

export function initUIEvents(lpMain, lpSetting, comfirmSetting, navigate, authToken, isTokenExpired) {
  if (!authToken && isTokenExpired()) {
    navigate('/home');
    return () => {}; // return empty cleanup
  }

  // Run all event attachment code here
  // (copy your existing code and paste it here, but with minimal use of variables from outside)

  // Example: attach button animation
  const animateButtons = () => {
    document.querySelectorAll('.btnAnimate').forEach(element => {
      element.addEventListener('click', () => {
        element.transition = 'transform 100ms';
        element.style.transform = 'translateY(-5%) scale(1.02)';
        setTimeout(() => {
          element.style.transform = 'translateY(0%) scale(1)';
        }, 100);
      });
    });
  };

  animateButtons();

  // ...rest of your listeners and setup logic

  // === CLEANUP ===
  return function cleanup() {
    // remove all window event listeners you added
    window.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("click", clickHandler);
    window.removeEventListener("scroll", scrollHandler);
    window.removeEventListener("load", loadHandler);

    // optionally remove specific listeners on elements
    // or reset state if needed
  };

  // These must be declared separately for cleanup to work
  function keydownHandler(e) {
    if (e.key === "Escape" && document.getElementById('sideMenu')?.getAttribute('aria-hidden') === 'false') {
      closeMenu();
    }
  }

  function clickHandler(e) {
    const sideMenu = document.getElementById('sideMenu');
    const searchCon = document.getElementById('search-container');
    if (sideMenu?.getAttribute('aria-hidden') === 'false' && !sideMenu.contains(e.target)) {
      closeMenu();
    }
    if (!searchCon?.contains(e.target) && e.target?.id !== 'activateSearch') {
      closeSearch();
    }
  }

  function scrollHandler() {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu?.getAttribute('aria-hidden') === 'false') {
      closeMenu();
    }
  }

  function loadHandler() {
    // your load-related animations
  }
}
