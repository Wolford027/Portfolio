/* ==========================================================================
   Joshua — Portfolio
   Mobile nav, scroll-reveal, active section highlighting,
   project modal + screenshot carousel, footer year.
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ========================================================================
     PROJECT DATA
     To use real screenshots: set `src` to your image path, e.g.
       { src: "images/payroll-dashboard.png", caption: "Dashboard overview" }
     Slides with src: null render as styled placeholders.
     ======================================================================== */
  const PROJECTS = {
    "payroll": {
      title: "Payroll & Attendance Platform",
      tag: "Multi-tenant",
      description:
        "A multi-tenant payroll and attendance management system built for " +
        "companies with layered responsibilities. Role-based access control " +
        "separates what Owners, Admins, HR, Accountants, and Employees can " +
        "see and do. Attendance is verified through camera capture and " +
        "geolocation, while payroll supports configurable deductions, " +
        "contributions, and pay schedules — all computed server-side so the " +
        "numbers are always consistent.",
      stack: ["Laravel", "Vue 3", "MySQL", "RBAC"],
      slides: [
        { src: null, caption: "Dashboard overview" },
        { src: null, caption: "Attendance — camera & geolocation check-in" },
        { src: null, caption: "Payroll run with configurable deductions" },
        { src: null, caption: "Role & permission management" },
        { src: null, caption: "Employee self-service portal" }
      ]
    },
    "sessionsync": {
      title: "SessionSync-AI",
      tag: "AI tooling",
      description:
        "A developer tool for keeping AI-assisted coding sessions in sync. " +
        "It captures project context, prompts, and session state so that " +
        "work can continue seamlessly across sessions and machines — no " +
        "more re-explaining the codebase every time a new session starts.",
      stack: ["JavaScript", "Node.js", "GitHub"],
      slides: [
        { src: null, caption: "Session overview" },
        { src: null, caption: "Context capture in action" },
        { src: null, caption: "Prompt history & search" },
        { src: null, caption: "Sync across machines" },
        { src: null, caption: "Settings & configuration" }
      ]
    },
    "mux-video": {
      title: "Video Platform Integration",
      tag: "API integration",
      description:
        "Integration of the Mux video API into a Laravel application — " +
        "secure uploads, asset processing, and playback. The work included " +
        "hardening SSL certificate verification for outbound API calls and " +
        "refactoring the HTTP client options into reusable service methods " +
        "so every integration point behaves consistently.",
      stack: ["Laravel", "Mux API", "cURL"],
      slides: [
        { src: null, caption: "Video upload flow" },
        { src: null, caption: "Asset processing status" },
        { src: null, caption: "Playback page" },
        { src: null, caption: "API service layer (code)" },
        { src: null, caption: "Error handling & retries" }
      ]
    },
    "netlify-auth": {
      title: "Static Site & Auth Flow",
      tag: "Deployment",
      description:
        "Diagnosis and rebuild of a Netlify-hosted application's login " +
        "flow. Root causes included missing redirect rules in netlify.toml " +
        "and serverless storage misconfiguration. The fix covered redirect " +
        "rules, environment configuration, and storage handling to get " +
        "authentication working reliably in production.",
      stack: ["Netlify", "JavaScript", "Serverless"],
      slides: [
        { src: null, caption: "Login screen" },
        { src: null, caption: "Redirect rules configuration" },
        { src: null, caption: "Environment settings" },
        { src: null, caption: "Deploy pipeline" },
        { src: null, caption: "Working auth flow" }
      ]
    },
    "react-app": {
      title: "React Web Application",
      tag: "React",
      description:
        "A single-page application built with React — component-driven UI, " +
        "client-side routing, and API integration with a Node.js and " +
        "Express backend on PostgreSQL. " +
        "(Replace this with your project's real name and description.)",
      stack: ["React", "Node.js", "Express", "PostgreSQL"],
      slides: [
        { src: null, caption: "Home / landing view" },
        { src: null, caption: "Main feature screen" },
        { src: null, caption: "Data list & filtering" },
        { src: null, caption: "Detail view" },
        { src: null, caption: "Mobile layout" }
      ]
    },
    "nextjs-app": {
      title: "Next.js Web Application",
      tag: "Next.js",
      description:
        "A full-stack application built with Next.js — server-side " +
        "rendering for fast loads and SEO, API routes for backend logic, " +
        "and a PostgreSQL data layer. " +
        "(Replace this with your project's real name and description.)",
      stack: ["Next.js", "React", "PostgreSQL"],
      slides: [
        { src: null, caption: "Home / landing view" },
        { src: null, caption: "Server-rendered content page" },
        { src: null, caption: "Dashboard" },
        { src: null, caption: "API-backed feature" },
        { src: null, caption: "Mobile layout" }
      ]
    }
  };

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest(".nav-link")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");

  const linkFor = (id) =>
    document.querySelector(`.nav-menu .nav-link[href="#${id}"]`);

  if (sections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => link.classList.remove("is-active"));
          const active = linkFor(entry.target.id);
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ========================================================================
     PROJECT MODAL + CAROUSEL
     ======================================================================== */
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const dialog = modal.querySelector(".modal-dialog");
  const closeBtn = modal.querySelector(".modal-close");
  const track = modal.querySelector(".carousel-track");
  const dotsWrap = modal.querySelector(".carousel-dots");
  const counter = modal.querySelector(".carousel-counter");
  const prevBtn = modal.querySelector(".carousel-prev");
  const nextBtn = modal.querySelector(".carousel-next");
  const titleEl = modal.querySelector("#modal-title");
  const tagEl = modal.querySelector(".modal-tag");
  const descEl = modal.querySelector(".modal-desc");
  const stackEl = modal.querySelector(".modal-stack");

  let currentIndex = 0;
  let slideCount = 0;
  let lastFocused = null;

  const pad = (n) => String(n).padStart(2, "0");

  function buildSlide(slide, index, total) {
    const li = document.createElement("div");
    li.className = "carousel-slide";
    li.setAttribute("aria-roledescription", "slide");
    li.setAttribute("aria-label", `${index + 1} of ${total}: ${slide.caption}`);

    if (slide.src) {
      const img = document.createElement("img");
      img.src = slide.src;
      img.alt = slide.caption;
      img.loading = "lazy";
      li.appendChild(img);
    } else {
      li.innerHTML =
        '<div class="media-placeholder carousel-placeholder">' +
        '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
        '<rect x="3" y="4" width="18" height="16" rx="2"/>' +
        '<circle cx="8.5" cy="9.5" r="1.5"/>' +
        '<path d="M21 15l-5-5-9 9"/></svg>' +
        `<span>IMG.PENDING ${pad(index + 1)} / ${pad(total)}</span>` +
        `<strong>${slide.caption}</strong>` +
        "</div>";
    }
    return li;
  }

  function goTo(index) {
    currentIndex = (index + slideCount) % slideCount;
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    counter.textContent = `${pad(currentIndex + 1)} / ${pad(slideCount)}`;
    dotsWrap.querySelectorAll(".carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentIndex);
      dot.setAttribute("aria-selected", String(i === currentIndex));
    });
  }

  function openModal(projectId, triggerEl) {
    const project = PROJECTS[projectId];
    if (!project) return;

    lastFocused = triggerEl || document.activeElement;

    // Populate text
    titleEl.textContent = project.title;
    tagEl.textContent = project.tag;
    descEl.textContent = project.description;
    stackEl.innerHTML = "";
    project.stack.forEach((tech) => {
      const li = document.createElement("li");
      li.textContent = tech;
      stackEl.appendChild(li);
    });

    // Build carousel
    track.innerHTML = "";
    dotsWrap.innerHTML = "";
    slideCount = project.slides.length;
    project.slides.forEach((slide, i) => {
      track.appendChild(buildSlide(slide, i, slideCount));
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Go to image ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    if (prefersReducedMotion) track.style.transition = "none";
    goTo(0);

    modal.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => modal.classList.add("is-open"));
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    const finish = () => {
      modal.hidden = true;
      if (lastFocused) lastFocused.focus();
    };
    if (prefersReducedMotion) {
      finish();
    } else {
      setTimeout(finish, 220);
    }
  }

  /* ---- Open: click or keyboard on any project card ---- */
  document.querySelectorAll(".project-card[data-project]").forEach((card) => {
    card.addEventListener("click", (event) => {
      // Let real links inside the card behave normally
      if (event.target.closest("a[href]:not([aria-disabled='true'])")) return;
      event.preventDefault();
      openModal(card.dataset.project, card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card.dataset.project, card);
      }
    });
  });

  /* ---- Close: backdrop, X button, Escape ---- */
  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft") goTo(currentIndex - 1);
    if (event.key === "ArrowRight") goTo(currentIndex + 1);

    // Simple focus trap
    if (event.key === "Tab") {
      const focusables = dialog.querySelectorAll(
        "button, [href], [tabindex]:not([tabindex='-1'])"
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  /* ---- Touch swipe support ---- */
  let touchStartX = 0;
  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0].clientX;
    },
    { passive: true }
  );
  track.addEventListener(
    "touchend",
    (event) => {
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) {
        goTo(currentIndex + (delta < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );
})();
