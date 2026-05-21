/* ============================================
   PORTFOLIO JAVASCRIPT — script.js
   Rijki Aditiya Personal Portfolio
   ============================================ */

/* ----------------------------------------
   IMAGE UPLOAD HELPER FUNCTIONS
   ---------------------------------------- */

/**
 * Membuka file picker untuk elemen input tertentu
 * @param {string} inputId  - ID dari <input type="file">
 */
function triggerUpload(inputId) {
  document.getElementById(inputId).click();
}

/**
 * Preview gambar yang dipilih ke dalam <img> target
 * @param {HTMLInputElement} input       - input file element
 * @param {string}           imgId       - ID dari <img> tujuan
 * @param {string|null}      placeholderId - ID placeholder yang akan disembunyikan (opsional)
 */
function previewImage(input, imgId, placeholderId) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var imgEl = document.getElementById(imgId);
    if (imgEl) {
      imgEl.src = e.target.result;
      imgEl.style.display = "block";
    }
    if (placeholderId) {
      var ph = document.getElementById(placeholderId);
      if (ph) ph.style.display = "none";
    }
  };
  reader.readAsDataURL(input.files[0]);
}



  /* ----------------------------------------
     1. NAVBAR — scroll shrink & hamburger
     ---------------------------------------- */
  const navbar   = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");

  // Sticky scroll style
  window.addEventListener("scroll", function () {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Hamburger toggle (mobile)
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
  }

  // Close nav when a link is clicked (mobile)
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
    });
  });

  /* ----------------------------------------
     2. DROPDOWN MENU (Resources)
     ---------------------------------------- */
  const dropdownToggle = document.querySelector(".dropdown > a");
  const dropdownMenu   = document.getElementById("dropdownMenu");

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", function (e) {
      e.preventDefault();
      dropdownMenu.classList.toggle("open");
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove("open");
      }
    });
  }

  /* ----------------------------------------
     3. SKILL PROGRESS BARS — IntersectionObserver (FIXED)
     ---------------------------------------- */
  var bars = document.querySelectorAll(".progress-bar");

  function fireBar(bar) {
    if (bar.dataset.animated) return;
    bar.dataset.animated = "true";
    var pct = bar.getAttribute("data-pct") || "0";
    // reset dulu ke 0, lalu set ke target agar transisi selalu jalan
    bar.style.width = "0%";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bar.style.width = pct + "%";
        bar.classList.add("animated");
      });
    });
  }

  if ("IntersectionObserver" in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fireBar(entry.target);
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    bars.forEach(function (bar) { barObserver.observe(bar); });
  } else {
    // Fallback: langsung tampilkan semua
    bars.forEach(function (bar) { fireBar(bar); });
  }

  // Safety fallback: jika setelah 1.5 detik bar belum jalan, paksa semua
  setTimeout(function () {
    bars.forEach(function (bar) { fireBar(bar); });
  }, 1500);

  /* ----------------------------------------
     MODAL LOGIN / SIGN UP
     ---------------------------------------- */
  var modalOverlay = document.getElementById("modalOverlay");
  var signupBtn    = document.getElementById("signupBtn");
  var modalClose   = document.getElementById("modalClose");
  var tabLogin     = document.getElementById("tabLogin");
  var tabSignup    = document.getElementById("tabSignup");
  var formLogin    = document.getElementById("formLogin");
  var formSignup   = document.getElementById("formSignup");
  var goSignup     = document.getElementById("goSignup");
  var goLogin      = document.getElementById("goLogin");

  function openModal(showForm) {
    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    switchForm(showForm || "login");
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function switchForm(which) {
    if (which === "login") {
      formLogin.classList.remove("hidden");
      formSignup.classList.add("hidden");
      tabLogin.classList.add("active");
      tabSignup.classList.remove("active");
    } else {
      formSignup.classList.remove("hidden");
      formLogin.classList.add("hidden");
      tabSignup.classList.add("active");
      tabLogin.classList.remove("active");
    }
  }

  if (signupBtn)  signupBtn.addEventListener("click", function () { openModal("signup"); });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (tabLogin)   tabLogin.addEventListener("click", function () { switchForm("login"); });
  if (tabSignup)  tabSignup.addEventListener("click", function () { switchForm("signup"); });
  if (goSignup)   goSignup.addEventListener("click", function () { switchForm("signup"); });
  if (goLogin)    goLogin.addEventListener("click",  function () { switchForm("login"); });

  // Klik di luar modal = tutup
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // ESC = tutup
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });


     /*---------------------------------------- */
  const revealElements = document.querySelectorAll(
    ".project-card, .skill-card, .about-inner, .contact-item"
  );

  // Add initial hidden state via JS (graceful degradation if JS off)
  revealElements.forEach(function (el) {
    el.style.opacity  = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
  });

  function revealOnScroll() {
    revealElements.forEach(function (el, i) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60 && el.style.opacity === "0") {
        setTimeout(function () {
          el.style.opacity  = "1";
          el.style.transform = "translateY(0)";
        }, (i % 4) * 80); // stagger within viewport batch
      }
    });
  }

  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll, { passive: true });

  /* ----------------------------------------
     5. ACTIVE NAV LINK on scroll
     ---------------------------------------- */
  const sections = document.querySelectorAll("section[id]");

  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
      const id    = section.getAttribute("id");
      const top   = section.offsetTop;
      const height = section.offsetHeight;
      const link  = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = "#ffffff";
        } else {
          link.style.color = "";
        }
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });

  /* ----------------------------------------
     6. SMOOTH SCROLL for anchor links
     ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 68;
        const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    });
  });

  /* ----------------------------------------
     7. PROJECT CARD hover tilt effect (subtle)
     ---------------------------------------- */
  document.querySelectorAll(".project-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = "translateY(-6px) rotateX(" + (-y * 4) + "deg) rotateY(" + (x * 4) + "deg)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
      card.style.transition = "transform 0.4s ease";
    });
    card.addEventListener("mouseenter", function () {
      card.style.transition = "transform 0.08s ease";
    });
  });
