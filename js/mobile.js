/* js/mobile.js */


/* =========================================================
   MOBILE LAYOUT
   ========================================================= */

let mobileLayoutInitialized = false;


/* =========================================================
   MOBILE MEDIA QUERY
   ========================================================= */

const mobileMediaQuery =
  window.matchMedia(
    "(max-width: 768px)",
  );


/* =========================================================
   UPDATE MOBILE CONTENT POSITION
   =========================================================

   Everything below the search box starts at this position.

   Search box:
       fixed at top

   Search results / restaurant details:
       fixed below search box
   ========================================================= */

function updateMobileContentPosition() {
  if (
    !mobileMediaQuery.matches
  ) {
    return;
  }

  const searchContainer =
    document.querySelector(
      ".search-container",
    );

  if (!searchContainer) {
    return;
  }

  const rect =
    searchContainer.getBoundingClientRect();

  /*
   * Add a small gap below the search box.
   */
  const gap = 8;

  const contentTop =
    rect.bottom + gap;

  document.documentElement.style.setProperty(
    "--mobile-content-top",
    `${contentTop}px`,
  );
}


/* =========================================================
   UPDATE MOBILE VIEWPORT
   =========================================================

   visualViewport changes when the mobile keyboard opens.

   Example:

       Keyboard closed
       visual viewport ≈ full screen
       keyboard height = 0

       Keyboard open
       visual viewport becomes smaller
       keyboard height > 0

   The CSS then uses:

       bottom: var(--keyboard-height)
   ========================================================= */

function updateMobileViewport() {
  if (
    !mobileMediaQuery.matches
  ) {
    return;
  }

  const viewport =
    window.visualViewport;

  if (!viewport) {
    document.documentElement.style.setProperty(
      "--keyboard-height",
      "0px",
    );

    updateMobileContentPosition();

    return;
  }

  /*
   * Calculate the part of the layout viewport
   * hidden by the keyboard.
   */
  const keyboardHeight =
    Math.max(
      0,
      window.innerHeight -
        viewport.height -
        viewport.offsetTop,
    );

  document.documentElement.style.setProperty(
    "--keyboard-height",
    `${keyboardHeight}px`,
  );

  document.documentElement.style.setProperty(
    "--visual-viewport-height",
    `${viewport.height}px`,
  );

  updateMobileContentPosition();
}


/* =========================================================
   HANDLE VISUAL VIEWPORT CHANGES
   ========================================================= */

function initializeMobileViewport() {
  updateMobileViewport();

  if (window.visualViewport) {
    window.visualViewport.addEventListener(
      "resize",
      updateMobileViewport,
    );

    window.visualViewport.addEventListener(
      "scroll",
      updateMobileViewport,
    );
  }

  window.addEventListener(
    "resize",
    updateMobileViewport,
  );

  window.addEventListener(
    "orientationchange",
    () => {
      /*
       * Wait until the browser finishes
       * rotating/recalculating dimensions.
       */
      setTimeout(
        updateMobileViewport,
        100,
      );
    },
  );
}


/* =========================================================
   KEEP SEARCH BAR / CONTENT POSITIONED
   ========================================================= */

function initializeMobileSearchPosition() {
  const searchContainer =
    document.querySelector(
      ".search-container",
    );

  if (!searchContainer) {
    return;
  }

  /*
   * Recalculate after fonts/images/layout
   * have had a chance to settle.
   */
  requestAnimationFrame(
    updateMobileContentPosition,
  );

  window.addEventListener(
    "resize",
    updateMobileContentPosition,
  );

  if (window.visualViewport) {
    window.visualViewport.addEventListener(
      "resize",
      updateMobileContentPosition,
    );
  }
}


/* =========================================================
   CLOSE SEARCH RESULTS
   ========================================================= */

function closeMobileSearchResults() {
  const panel =
    document.getElementById(
      "searchResults",
    );

  if (!panel) {
    return;
  }

  panel.style.display =
    "none";
}


/* =========================================================
   MOBILE RESULT SHEET
   =========================================================

   IMPORTANT:

   We deliberately do NOT attach touchmove to
   #searchResults.

   #resultsList must remain completely scrollable.

   Previously, touchmove on the entire sheet caused
   scrolling to accidentally trigger:

       display: none

   That behavior is intentionally removed.
   ========================================================= */

function initializeMobileResultSheet() {
  const sheet =
    document.getElementById(
      "searchResults",
    );

  if (!sheet) {
    return;
  }

  /*
   * Only the handle/header may be used
   * for a downward dismiss gesture.
   */
  const handle =
    sheet.querySelector(
      ".sheet-handle",
    );

  const header =
    sheet.querySelector(
      ".sheet-header",
    );

  let startY = null;

  function touchStart(e) {
    if (
      !e.touches ||
      !e.touches.length
    ) {
      return;
    }

    startY =
      e.touches[0].clientY;
  }

  function touchMove(e) {
    if (
      startY === null ||
      !e.touches ||
      !e.touches.length
    ) {
      return;
    }

    const currentY =
      e.touches[0].clientY;

    const distance =
      currentY - startY;

    /*
     * Downward swipe only.
     */
    if (distance > 120) {
      closeMobileSearchResults();

      startY = null;
    }
  }

  function touchEnd() {
    startY = null;
  }

  if (handle) {
    handle.addEventListener(
      "touchstart",
      touchStart,
      { passive: true },
    );

    handle.addEventListener(
      "touchmove",
      touchMove,
      { passive: true },
    );

    handle.addEventListener(
      "touchend",
      touchEnd,
      { passive: true },
    );
  }

  if (header) {
    header.addEventListener(
      "touchstart",
      touchStart,
      { passive: true },
    );

    header.addEventListener(
      "touchmove",
      touchMove,
      { passive: true },
    );

    header.addEventListener(
      "touchend",
      touchEnd,
      { passive: true },
    );
  }
}


/* =========================================================
   MOBILE DETAIL PANEL
   ========================================================= */

function initializeMobileDetailPanel() {
  const details =
    document.getElementById(
      "restaurantDetails",
    );

  if (!details) {
    return;
  }

  /*
   * The detail panel itself does not need special
   * positioning JavaScript.
   *
   * mobile.css handles:
   *
   * top    = below search box
   * bottom = visible viewport
   */
}


/* =========================================================
   MOBILE INITIALIZATION
   ========================================================= */

function initializeMobileLayout() {
  if (
    !mobileMediaQuery.matches
  ) {
    return;
  }

  if (mobileLayoutInitialized) {
    updateMobileViewport();

    return;
  }

  mobileLayoutInitialized = true;

  initializeMobileViewport();

  initializeMobileSearchPosition();

  initializeMobileResultSheet();

  initializeMobileDetailPanel();
}


/* =========================================================
   DEVICE/LAYOUT CHANGE
   ========================================================= */

function handleMobileLayoutChange() {
  if (
    mobileMediaQuery.matches
  ) {
    initializeMobileLayout();

    updateMobileViewport();
  }
}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      initializeMobileLayout();
    },
    {
      once: true,
    },
  );
} else {
  initializeMobileLayout();
}


mobileMediaQuery.addEventListener(
  "change",
  handleMobileLayoutChange,
);