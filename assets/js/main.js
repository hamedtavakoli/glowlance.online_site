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
    .then(function (markup) {
      target.outerHTML = markup;
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
