/* AZARIYA LLC — shared behavior */

(function () {
  "use strict";

  /* Random hero video — one of the six landscapes, chosen fresh each load */
  var HERO_CLIPS = [
    { mp4: "https://videos.pexels.com/video-files/4250075/4250075-hd_1920_1080_30fps.mp4",   poster: "https://images.pexels.com/videos/4250075/free-video-4250075.jpg?auto=compress&cs=tinysrgb&w=1600" },
    { mp4: "https://videos.pexels.com/video-files/5720750/5720750-hd_1920_1080_30fps.mp4",   poster: "https://images.pexels.com/videos/5720750/free-video-5720750.jpg?auto=compress&cs=tinysrgb&w=1600" },
    { mp4: "https://videos.pexels.com/video-files/34305681/14533327_2560_1440_60fps.mp4",    poster: "https://images.pexels.com/videos/34305681/free-video-34305681.jpg?auto=compress&cs=tinysrgb&w=1600" },
    { mp4: "https://videos.pexels.com/video-files/5091109/5091109-hd_1920_1080_25fps.mp4",   poster: "https://images.pexels.com/videos/5091109/free-video-5091109.jpg?auto=compress&cs=tinysrgb&w=1600" },
    { mp4: "https://videos.pexels.com/video-files/12004398/12004398-uhd_2560_1440_24fps.mp4", poster: "https://images.pexels.com/videos/12004398/free-video-12004398.jpg?auto=compress&cs=tinysrgb&w=1600" },
    { mp4: "https://videos.pexels.com/video-files/30820445/13181562_2560_1440_60fps.mp4",    poster: "https://images.pexels.com/videos/30820445/free-video-30820445.jpg?auto=compress&cs=tinysrgb&w=1600" }
  ];
  var heroRandom = document.querySelector("[data-hero-random]");
  if (heroRandom) {
    var clip = HERO_CLIPS[Math.floor(Math.random() * HERO_CLIPS.length)];
    var v = document.createElement("video");
    v.muted = true; v.loop = true; v.autoplay = true; v.preload = "auto";
    v.setAttribute("playsinline", ""); v.setAttribute("muted", "");
    v.poster = clip.poster;
    var src = document.createElement("source");
    src.src = clip.mp4; src.type = "video/mp4";
    v.appendChild(src);
    heroRandom.appendChild(v);   /* rotator init below picks this up: fade-in + slow rate */
  }

  /* Nav background on scroll */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav toggle */
  var navToggle = document.querySelector(".nav-toggle");
  if (navToggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    navToggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("open"));
    });
    Array.prototype.forEach.call(
      nav.querySelectorAll(".nav-links a"),
      function (a) {
        a.addEventListener("click", function () { setOpen(false); });
      }
    );
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* Reveal-on-scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Rotating video backdrop.
     Container: [data-rotator] holding <video> elements.
     Videos crossfade every INTERVAL ms; only the active pair plays. */
  var rotators = document.querySelectorAll("[data-rotator]");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  rotators.forEach(function (wrap) {
    var vids = Array.prototype.slice.call(wrap.querySelectorAll("video"));
    if (!vids.length) return;

    var idx = 0;
    var INTERVAL = parseInt(wrap.getAttribute("data-interval") || "9000", 10);
    var RATE = parseFloat(wrap.getAttribute("data-rate") || "1");

    function setRate(v) {
      try { v.playbackRate = RATE; } catch (e) { /* noop */ }
    }

    function tryPlay(v) {
      setRate(v);
      v.addEventListener("loadedmetadata", function () { setRate(v); });
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked — poster remains */ });
    }

    function show(i) {
      vids.forEach(function (v, k) {
        if (k === i) {
          v.classList.add("visible");
          tryPlay(v);
        } else {
          v.classList.remove("visible");
        }
      });
      /* Warm up the next clip */
      var next = vids[(i + 1) % vids.length];
      if (next.preload !== "auto") next.preload = "auto";
    }

    show(0);

    if (!reduced && vids.length > 1) {
      setInterval(function () {
        idx = (idx + 1) % vids.length;
        show(idx);
      }, INTERVAL);
    }

    if (reduced) {
      vids.forEach(function (v) { v.pause(); });
    }
  });
})();
