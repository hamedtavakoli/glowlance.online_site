var LOCAL_PREVIEW_PARTIALS = {
  "partials/header.html": [
    '<a class="skip-link" href="#main-content">Skip to content</a>',
    '<header class="site-header">',
    '  <div class="container">',
    '    <div class="header-shell">',
    '      <a class="brand" href="index.html" aria-label="VocabGlow home">',
    '        <img src="assets/images/logo-placeholder.png" alt="VocabGlow logo placeholder" width="40" height="40">',
    '        <span>VocabGlow</span>',
    '      </a>',
    '      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">',
    '        <span class="nav-toggle-bar"></span>',
    '        <span class="nav-toggle-bar"></span>',
    '        <span class="nav-toggle-bar"></span>',
    '        <span class="sr-only">Toggle navigation</span>',
    '      </button>',
    '      <nav class="site-nav" id="site-nav" aria-label="Primary navigation">',
    '        <a href="index.html" data-nav-link="home">Home</a>',
    '        <a href="features.html" data-nav-link="features">Features</a>',
    '        <a href="how-it-works.html" data-nav-link="how-it-works">How It Works</a>',
    '        <a href="whats-new.html" data-nav-link="whats-new">What\'s New</a>',
    '        <a href="help.html" data-nav-link="help">Help</a>',
    '        <a href="privacy.html" data-nav-link="privacy">Privacy</a>',
    '        <a class="button button-primary button-nav" href="https://chromewebstore.google.com/detail/vocabglow-%E2%80%93-learn-words-a/imljijnchlopikoipiolikeoeolhlbgb" target="_blank" rel="noopener noreferrer">Add to Chrome</a>',
    '      </nav>',
    '    </div>',
    '  </div>',
    '</header>'
  ].join("\n"),
  "partials/footer.html": [
    '<footer class="site-footer">',
    '  <div class="container footer-grid">',
    '    <div>',
    '      <h2 class="footer-title">VocabGlow</h2>',
    '      <p class="footer-copy">A focused vocabulary companion for learning while you browse.</p>',
    '      <p class="footer-copy">&copy; 2026 VocabGlow. Built by Glowlance.</p>',
    '    </div>',
    '    <nav class="footer-links" aria-label="Footer navigation">',
    '      <a href="help.html">Help</a>',
    '      <a href="privacy.html">Privacy</a>',
    '      <a href="whats-new.html">What\'s New</a>',
    '      <a href="https://chromewebstore.google.com/detail/vocabglow-%E2%80%93-learn-words-a/imljijnchlopikoipiolikeoeolhlbgb" target="_blank" rel="noopener noreferrer">Chrome Store</a>',
    '      <a href="https://www.paypal.com/donate/?business=YBML53DRW2X3C&amount=2&no_recurring=0&item_name=Hey%21+I%E2%80%99m+Hamed.+Your+support+keeps+the+coffee+flowing+and+VocabGlow+growing%21+Thanks+for+the+high-five%21&currency_code=AUD" target="_blank" rel="noopener noreferrer">Support the project</a>',
    '    </nav>',
    '  </div>',
    '</footer>'
  ].join("\n")
};

function injectPartialMarkup(target, markup) {
  target.outerHTML = markup;
}

function loadPartial(target) {
  var partialPath = target.getAttribute("data-include");

  if (!partialPath) {
    return Promise.resolve();
  }

  return fetch(partialPath)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Unable to load partial: " + partialPath);
      }

      return response.text();
    })
    .catch(function (error) {
      if (window.location.protocol === "file:" && LOCAL_PREVIEW_PARTIALS[partialPath]) {
        console.warn(
          "Using built-in preview markup for " + partialPath + " because local file security blocked loading partials.",
          error
        );
        return LOCAL_PREVIEW_PARTIALS[partialPath];
      }

      throw new Error("Unable to load partial: " + partialPath);
    })
    .then(function (markup) {
      injectPartialMarkup(target, markup);
    })
    .catch(function (error) {
      console.error(error);
    });
}

function setActiveNavLink() {
  var currentPage = document.body.getAttribute("data-page");

  if (!currentPage) {
    return;
  }

  document.querySelectorAll("[data-nav-link]").forEach(function (link) {
    if (link.getAttribute("data-nav-link") === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initNavigation() {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.addEventListener("click", function () {
    var isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initFaqAccordion() {
  var faqItems = document.querySelectorAll("[data-faq-list] details");

  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) {
        return;
      }

      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var partialTargets = document.querySelectorAll("[data-include]");
  var loaders = Array.prototype.map.call(partialTargets, loadPartial);

  Promise.all(loaders).then(function () {
    setActiveNavLink();
    initNavigation();
    initFaqAccordion();
  });
});
