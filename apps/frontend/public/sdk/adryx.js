/**
 * Adryx Publisher SDK v1.0.0
 * Tracks impressions and clicks for ad placements.
 * Usage: loaded automatically by the embed snippet generated in the dashboard.
 */
(function (global) {
  "use strict";

  var API_BASE = "https://adryx.vercel.app/api/v1"; // overridable via data-api attribute

  function getScript() {
    return (
      document.currentScript || document.querySelector("script[data-adryx]")
    );
  }

  function resolveApi() {
    var el = getScript();
    return (el && el.getAttribute("data-api")) || API_BASE;
  }

  function post(endpoint, body) {
    var base = resolveApi();
    return fetch(base + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(function () {
      // Silently fail — never break the publisher's page
    });
  }

  function trackImpression(placementId, campaignId) {
    post("/interactions/impression", {
      placementId: placementId,
      campaignId: campaignId,
    });
  }

  function trackClick(placementId, campaignId, publisherWallet, targetUrl) {
    post("/interactions/click", {
      placementId: placementId,
      campaignId: campaignId,
      publisherWallet: publisherWallet,
    }).then(function () {
      if (targetUrl) window.open(targetUrl, "_blank", "noopener");
    });
  }

  function renderAd(container, config) {
    var placementId = config.placementId;
    var campaignId = config.campaignId;
    var publisherWallet = config.publisherWallet;
    var format = config.format || "banner";
    var creativeUrl = config.creativeUrl;
    var targetUrl = config.targetUrl;
    var width = config.width || "100%";
    var height = config.height || (format === "banner" ? "90px" : "250px");

    if (!creativeUrl) {
      // Placeholder when no creative is set
      container.style.cssText =
        "display:flex;align-items:center;justify-content:center;background:#0d0d1a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;width:" +
        width +
        ";height:" +
        height +
        ";";
      container.innerHTML =
        '<span style="color:rgba(255,255,255,0.3);font-size:12px;font-family:sans-serif;">Ad by Adryx</span>';
    } else {
      var img = document.createElement("img");
      img.src = creativeUrl;
      img.alt = "Advertisement";
      img.style.cssText =
        "width:" +
        width +
        ";height:" +
        height +
        ";object-fit:cover;display:block;cursor:pointer;border-radius:8px;";
      img.addEventListener("click", function (e) {
        e.preventDefault();
        trackClick(placementId, campaignId, publisherWallet, targetUrl);
      });
      container.appendChild(img);
    }

    // Track impression once visible (IntersectionObserver)
    var impressionSent = false;
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !impressionSent) {
              impressionSent = true;
              trackImpression(placementId, campaignId);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 },
      );
      observer.observe(container);
    } else {
      // Fallback: track immediately
      trackImpression(placementId, campaignId);
    }
  }

  /**
   * Public API
   * Adryx.init({ placementId, campaignId, publisherWallet, format, creativeUrl, targetUrl })
   */
  global.Adryx = {
    init: function (config) {
      var containerId = "adryx-placement-" + config.placementId;
      var container = document.getElementById(containerId);
      if (!container) {
        console.warn("[Adryx] Container #" + containerId + " not found.");
        return;
      }
      renderAd(container, config);
    },
  };
})(window);
