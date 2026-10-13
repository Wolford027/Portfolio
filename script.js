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
    "apbs": {
      "title": "APBS — AttendeePay Business Suite",
      "tag": "Payroll & HR",
      "description": "AttendeePay Business Suite (APBS) brings employee records, RFID attendance, leave management, and payroll together. It supports earnings, deductions, Philippine statutory contributions, payroll cycles, payslips, reports, and an audit trail. These interface screenshots use sample data.",
      "stack": [
        "React",
        "Express",
        "MySQL",
        "Material UI"
      ],
      "slides": [
        {
          "src": "assets/projects/apbs/01-dashboard.webp",
          "caption": "Workforce dashboard"
        },
        {
          "src": "assets/projects/apbs/02-employees.webp",
          "caption": "Employee directory"
        },
        {
          "src": "assets/projects/apbs/03-attendance.webp",
          "caption": "Attendance records"
        },
        {
          "src": "assets/projects/apbs/04-payroll.webp",
          "caption": "Payroll runs"
        },
        {
          "src": "assets/projects/apbs/05-overview.webp",
          "caption": "Product overview"
        }
      ]
    },
    "signoff": {
      "title": "Signoff",
      "tag": "QA & releases",
      "description": "Signoff helps small teams organize test suites and prioritized test cases, run checks with pass, fail, or blocked results, and connect failures to Jira or GitHub tickets. It includes AI-assisted test-case drafts from a specification or code diff and shareable release reports. These interface previews use sample data.",
      "stack": [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "PostgreSQL"
      ],
      "slides": [
        {
          "src": "assets/projects/signoff/01-overview.webp",
          "caption": "Product overview"
        },
        {
          "src": "assets/projects/signoff/02-suites.webp",
          "caption": "Test suites"
        },
        {
          "src": "assets/projects/signoff/03-test-cases.webp",
          "caption": "Prioritized test cases"
        },
        {
          "src": "assets/projects/signoff/04-test-run.webp",
          "caption": "Test execution"
        },
        {
          "src": "assets/projects/signoff/05-release-report.webp",
          "caption": "Release report"
        }
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
    modal.dataset.project = projectId;

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
      if (event.target.closest("a[href]:not([aria-disabled='true'])")) return;
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
