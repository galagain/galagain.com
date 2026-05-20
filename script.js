document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".navbar nav ul li a");
  const contentTitle = document.querySelector(".content-title h1");
  const sections = document.querySelectorAll("section");
  const profile = document.querySelector(".profile");
  const profileImage = document.querySelector(".profile-img");

  function spinAvatar() {
    if (!profileImage) return;

    profileImage.classList.remove("nav-spin");
    void profileImage.offsetWidth;
    profileImage.classList.add("nav-spin");
  }

  function setAvatar(isActive) {
    if (!profileImage) return;

    const defaultAvatar = profileImage.dataset.defaultAvatar;
    const activeAvatar = profileImage.dataset.activeAvatar;
    profileImage.src = isActive ? activeAvatar : defaultAvatar;

    if (profile) {
      profile.setAttribute("aria-pressed", String(isActive));
    }
  }

  function getSavedAvatar() {
    try {
      return localStorage.getItem("selectedAvatar");
    } catch (error) {
      return null;
    }
  }

  function saveAvatar(avatarPath) {
    try {
      localStorage.setItem("selectedAvatar", avatarPath);
    } catch (error) {
      return;
    }
  }

  if (profile && profileImage) {
    const defaultAvatar = profileImage.dataset.defaultAvatar;
    const activeAvatar = profileImage.dataset.activeAvatar;
    const savedAvatar = getSavedAvatar();
    const isActiveAvatar = savedAvatar === activeAvatar;

    new Image().src = defaultAvatar;
    new Image().src = activeAvatar;
    setAvatar(isActiveAvatar);

    function toggleAvatar() {
      const nextIsActive = profileImage.src.endsWith(defaultAvatar);
      setAvatar(nextIsActive);
      saveAvatar(nextIsActive ? activeAvatar : defaultAvatar);
      spinAvatar();
    }

    profile.addEventListener("click", toggleAvatar);
    profile.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleAvatar();
    });
  }

  sections.forEach((section) => section.classList.add("hidden"));
  document.querySelector(".about").classList.remove("hidden");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const sectionClass = this.textContent.trim().toLowerCase();

      contentTitle.textContent =
        this.textContent.trim() === "About" ? "About Me" : this.textContent;

      sections.forEach((section) => section.classList.add("hidden"));

      const activeSection = document.querySelector(`.${sectionClass}`);
      if (activeSection) {
        activeSection.classList.remove("hidden");
        window.dispatchEvent(new Event("refreshReveal"));
      }

      if (
        sectionClass === "contact" &&
        window.contactMap &&
        window.contactMapBounds &&
        window.google
      ) {
        setTimeout(() => {
          google.maps.event.trigger(window.contactMap, "resize");
          window.contactMap.fitBounds(window.contactMapBounds);
        }, 80);
      }

      spinAvatar();

      navLinks.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const professionBox = document.querySelector(".profession-box");
  if (!professionBox) return;

  const text = professionBox.textContent.trim();
  const typingSpeed = 90;
  const erasingSpeed = 45;
  const pauseAfterTyping = 1400;
  const pauseAfterErasing = 500;

  let index = 0;
  let isDeleting = false;

  professionBox.classList.add("typing");
  professionBox.textContent = "";

  function typeEffect() {
    if (!isDeleting) {
      professionBox.textContent = text.slice(0, index + 1);
      index += 1;

      if (index === text.length) {
        isDeleting = true;
        setTimeout(typeEffect, pauseAfterTyping);
        return;
      }

      setTimeout(typeEffect, typingSpeed);
      return;
    }

    professionBox.textContent = text.slice(0, index - 1);
    index -= 1;

    if (index === 0) {
      isDeleting = false;
      setTimeout(typeEffect, pauseAfterErasing);
      return;
    }

    setTimeout(typeEffect, erasingSpeed);
  }

  typeEffect();
});

document.addEventListener("DOMContentLoaded", function () {
  const revealTargets = document.querySelectorAll(
    ".content-title, .intro, .about-box, .section-header, .timeline-item, .map-container, .contact-form"
  );

  if (revealTargets.length === 0) return;

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.classList.add(`reveal-delay-${(index % 4) + 1}`);
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  function observeHiddenTargets() {
    revealTargets.forEach((element) => {
      if (
        !element.classList.contains("is-visible") &&
        !element.closest(".hidden")
      ) {
        revealObserver.observe(element);
      }
    });
  }

  observeHiddenTargets();
  window.addEventListener("refreshReveal", observeHiddenTargets);
});

document.addEventListener("DOMContentLoaded", function () {
  const teaBox = document.querySelector(".tea-box");
  const teaTrigger = document.querySelector(".tea-icon-wrap");
  if (!teaBox) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let steamTimeoutId = null;
  let nextSteamTimeoutId = null;

  function scheduleSteam() {
    const nextDelay = 4500 + Math.random() * 5000;
    nextSteamTimeoutId = setTimeout(triggerSteam, nextDelay);
  }

  function triggerSteam() {
    if (nextSteamTimeoutId) {
      clearTimeout(nextSteamTimeoutId);
      nextSteamTimeoutId = null;
    }
    if (steamTimeoutId) {
      clearTimeout(steamTimeoutId);
    }

    teaBox.classList.remove("steaming");
    void teaBox.offsetWidth;
    teaBox.classList.add("steaming");

    steamTimeoutId = setTimeout(() => {
      teaBox.classList.remove("steaming");
      steamTimeoutId = null;
      scheduleSteam();
    }, 3600);
  }

  if (teaTrigger) {
    teaTrigger.addEventListener("click", triggerSteam);
    teaTrigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      triggerSteam();
    });
  }

  setTimeout(triggerSteam, 1800);
});

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const container = document.querySelector(".container");
  const timelineLine = document.querySelector(".timeline-line");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineDots = document.querySelectorAll(".timeline-dot");
  const sectionIcon = document.querySelector(".section-icon");

  function adjustContainerPosition() {
    if (!sidebar || !container) return;

    if (window.innerWidth <= 900) {
      container.style.marginTop = "0";
      container.style.marginBottom = "0";
      container.style.minHeight = "0";
      return;
    }

    const sidebarHeight = sidebar.offsetHeight;
    const windowHeight = window.innerHeight;

    const newMarginTop = (windowHeight - sidebarHeight) / 2;
    container.style.marginTop = `${newMarginTop}px`;
    container.style.marginBottom = `${newMarginTop}px`;

    container.style.minHeight = `${sidebarHeight}px`;
  }

  function adjustTimelineHeight() {
    if (
      !timelineLine ||
      timelineItems.length === 0 ||
      timelineDots.length === 0 ||
      !sectionIcon
    )
      return;

    const iconHeight = sectionIcon.offsetHeight;
    const iconOffset = iconHeight / 2;

    const firstItem = timelineItems[0];
    const lastItem = timelineItems[timelineItems.length - 1];
    const lastDot = timelineDots[timelineDots.length - 1];

    const firstItemOffset = firstItem.offsetTop + firstItem.offsetHeight / 2;
    const lastItemOffset = lastDot.offsetTop + lastDot.offsetHeight / 2;

    timelineLine.style.top = `${firstItemOffset - iconOffset}px`;
    timelineLine.style.height = `${lastItemOffset - firstItemOffset}px`;

    timelineDots.forEach((dot, index) => {
      const itemTitle = timelineItems[index].querySelector(".timeline-title");
      if (itemTitle) {
        const titleOffset = itemTitle.offsetTop + itemTitle.offsetHeight / 2;
        dot.style.top = `${titleOffset}px`;
      }
    });
  }

  setTimeout(() => {
    adjustContainerPosition();
    adjustTimelineHeight();
  }, 100);

  window.addEventListener("resize", () => {
    adjustContainerPosition();
    adjustTimelineHeight();
  });
});

function initMap() {
  const contentColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--content-color")
    .trim();
  const boxColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--box-color")
    .trim();

  const location1 = { lat: 48.71230833667956, lng: 2.1951999169797127 };
  const location2 = { lat: 48.71075248378351, lng: 2.2180446541432963 };
  const mapElement = document.getElementById("custom-map");

  if (!mapElement || !window.google) return;

  const map = new google.maps.Map(mapElement, {
    zoom: 14,
    center: location1,
    disableDefaultUI: true,
    clickableIcons: false,
    keyboardShortcuts: false,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: contentColor }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: boxColor }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: boxColor }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: boxColor }],
      },
    ],
  });

  const bounds = new google.maps.LatLngBounds();
  bounds.extend(location1);
  bounds.extend(location2);
  map.fitBounds(bounds);
  window.contactMap = map;
  window.contactMapBounds = bounds;

  setTimeout(() => {
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-color")
      .trim();
    const accentColorEncoded = encodeURIComponent(accentColor);
    const customIcon = {
      url: `data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='40' height='40' fill='${accentColorEncoded}'><path d='M12 2C8.13 2 5 5.13 5 9c0 4.25 5 11 7 13 2-2 7-8.75 7-13 0-3.87-3.13-7-7-7z'/></svg>`,
      scaledSize: new google.maps.Size(30, 30),
    };

    new google.maps.Marker({
      position: location1,
      map,
      icon: customIcon,
    });

    new google.maps.Marker({
      position: location2,
      map,
      icon: customIcon,
    });
  }, 500);
}

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  const statusMessage = document.querySelector(".form-status");
  const submitButton = contactForm?.querySelector(".btn");

  if (!contactForm || !window.emailjs) return;

  emailjs.init("4R081FyWEBktitRy0");

  function setFormStatus(message, type) {
    if (!statusMessage) return;

    statusMessage.textContent = message;
    statusMessage.dataset.status = type;
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      from_name: this.from_name.value,
      to_name: "Calvin",
      email: this.email.value,
      message: this.message.value,
    };

    if (submitButton) {
      submitButton.disabled = true;
    }
    setFormStatus("Sending message...", "loading");

    emailjs
      .send("service_wbzgq5x", "template_6ftikvk", formData)
      .then(() => {
        setFormStatus("Message sent. I will reply soon.", "success");
        this.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        setFormStatus(
          "Message could not be sent. Please email me directly.",
          "error"
        );
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  });
});

class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.005, 0.1) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.1;
    this.minSize = 0.3;
    this.maxSizeInteger = 1.5;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 0.5 + (this.width + this.height) * 0.001;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  appear() {
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

class PixelContainer extends HTMLElement {
  static register(tag = "pixel-container") {
    if ("customElements" in window) {
      customElements.define(tag, this);
    }
  }

  connectedCallback() {
    const canvas = document.createElement("canvas");
    this.shadowroot = this.attachShadow({ mode: "open" });
    this.shadowroot.append(canvas);
    this.canvas = this.shadowroot.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.init();
    this.resizeObserver = new ResizeObserver(() => this.init());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.pixels = [];
    this.createPixels();
    this.animate();
  }

  createPixels() {
    for (let x = 0; x < this.canvas.width; x += 20) {
      for (let y = 0; y < this.canvas.height; y += 20) {
        const baseColor = getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-color")
          .trim();
        const colorVariations = [
          baseColor,
          this.adjustBrightness(baseColor, 1.5),
          this.adjustBrightness(baseColor, 0.6),
        ];
        const color =
          colorVariations[Math.floor(Math.random() * colorVariations.length)];
        this.pixels.push(
          new Pixel(this.canvas, this.ctx, x, y, color, 0.2, 300)
        );
      }
    }
  }

  adjustBrightness(hex, factor) {
    let r = parseInt(hex.substring(1, 3), 16) * factor;
    let g = parseInt(hex.substring(3, 5), 16) * factor;
    let b = parseInt(hex.substring(5, 7), 16) * factor;
    return `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pixels.forEach((pixel) => pixel.appear());
  }
}

PixelContainer.register();
