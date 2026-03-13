(function () {
  var OLD_DOMAIN = "multipayment.co.uk";
  var NEW_DOMAIN = "paywithquick.co.uk";
  var OLD_EMAIL = "info@multipayment.co.uk";
  var NEW_EMAIL = "info@paywithquick.co.uk";

  function applyRebrandRuntime() {
    if (document.title) {
      document.title = document.title.replace(/multipayment\.co\.uk/gi, NEW_DOMAIN);
    }

    var candidates = document.querySelectorAll("a, img, source, link, meta, form");
    candidates.forEach(function (el) {
      ["href", "src", "content", "action", "srcset"].forEach(function (attr) {
        var value = el.getAttribute(attr);
        if (!value) return;
        var next = value
          .replace(/https?:\/\/multipayment\.co\.uk/gi, "https://" + NEW_DOMAIN)
          .replace(/multipayment\.co\.uk/gi, NEW_DOMAIN)
          .replace(/info@multipayment\.co\.uk/gi, NEW_EMAIL)
          .replace(/multipaymentservices\.wordpress\.com/gi, NEW_DOMAIN);
        if (next !== value) el.setAttribute(attr, next);
      });
    });

    var footerEmailLinks = document.querySelectorAll('a[href^="mailto:"]');
    footerEmailLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.toLowerCase().indexOf(OLD_EMAIL) >= 0) {
        link.setAttribute("href", "mailto:" + NEW_EMAIL);
        link.textContent = NEW_EMAIL;
      }
    });
  }

  function improveAccessibility() {
    var images = document.querySelectorAll("img");
    images.forEach(function (img) {
      var alt = img.getAttribute("alt");
      if (alt && alt.trim() !== "") return;
      img.setAttribute("alt", "Quick payment service illustration");
    });
  }

  function addDevelopersLink() {
    var navLists = document.querySelectorAll(".wp-block-navigation__container");
    navLists.forEach(function (list) {
      if (!list || list.querySelector('a[href="/docs/"], a[href="../docs/index.html"], a[href="/docs/index.html"]')) {
        return;
      }
      var li = document.createElement("li");
      li.className = "wp-block-navigation-item wp-block-navigation-link";
      li.innerHTML =
        '<a class="wp-block-navigation-item__content quick-docs-cta" href="/docs/"><span class="wp-block-navigation-item__label">Developers</span></a>';
      list.appendChild(li);
    });
  }

  function softenHeadingHierarchy() {
    var footerSiteTitles = document.querySelectorAll("footer .wp-block-site-title");
    footerSiteTitles.forEach(function (el) {
      if (el.tagName.toLowerCase() !== "h1") return;
      var replacement = document.createElement("p");
      replacement.className = el.className;
      replacement.innerHTML = el.innerHTML;
      el.parentNode.replaceChild(replacement, el);
    });
  }

  function staticContactFallback() {
    var form = document.querySelector("form.jetpack-contact-form__form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = (form.querySelector('input[name="g82-name"]') || {}).value || "";
      var email = (form.querySelector('input[name="g82-email"]') || {}).value || "";
      var message = (form.querySelector('textarea[name="g82-message"]') || {}).value || "";
      var subject = encodeURIComponent("Website contact from " + (name || "visitor"));
      var body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Message:\n" + message
      );

      var info = document.createElement("div");
      info.className = "quick-contact-fallback";
      info.textContent =
        "Thanks. Your email app is opening so you can send this message to " + NEW_EMAIL + ".";
      form.prepend(info);

      window.location.href = "mailto:" + NEW_EMAIL + "?subject=" + subject + "&body=" + body;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyRebrandRuntime();
    improveAccessibility();
    addDevelopersLink();
    softenHeadingHierarchy();
    staticContactFallback();
  });
})();
