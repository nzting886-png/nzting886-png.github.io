const header = document.querySelector("[data-header]");
const playButton = document.querySelector("[data-play]");
const modal = document.querySelector("[data-modal]");
const closeButton = document.querySelector("[data-close]");
const modalVideo = document.querySelector("[data-modal-video]");
const modalTitle = document.querySelector("[data-modal-title]");
const revealItems = document.querySelectorAll(".reveal");
const videoTriggers = document.querySelectorAll("[data-video]");
const coverVideos = document.querySelectorAll(".video-frame video");
let activeTrigger = null;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const openModal = ({ src = "", title = "Portfolio reel", returnFocus = playButton } = {}) => {
  activeTrigger = returnFocus;
  if (modalVideo && src) {
    modalVideo.src = src;
    modalVideo.load();
  }
  if (modalTitle) modalTitle.textContent = title;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalVideo?.play().catch(() => {});
  closeButton.focus();
};

const closeModal = () => {
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
  }
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeTrigger?.focus?.();
};

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
);

revealItems.forEach((item) => revealObserver.observe(item));
window.addEventListener("scroll", updateHeader, { passive: true });

if (playButton && modal && closeButton) {
  playButton.addEventListener("click", () => {
    document.querySelector("#index")?.scrollIntoView({ behavior: "smooth" });
  });
  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

modalVideo?.addEventListener("error", () => {
  modalTitle.textContent = `${modalTitle.textContent || "作品"} · 预览视频待接入`;
});

videoTriggers.forEach((trigger) => {
  if (trigger.tagName !== "BUTTON") {
    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
  }

  trigger.addEventListener("click", () => {
    openModal({
      src: trigger.dataset.video,
      title: trigger.dataset.title,
      returnFocus: trigger,
    });
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    trigger.click();
  });
});

coverVideos.forEach((video) => {
  if (!video.poster && video.currentSrc) {
    video.poster = video.currentSrc.replace(/\.mp4(?:$|\?.*)/, ".jpg");
  } else if (!video.poster) {
    video.poster = video.getAttribute("src")?.replace(/\.mp4(?:$|\?.*)/, ".jpg") || "";
  }

  video.addEventListener(
    "loadedmetadata",
    () => {
      if (!Number.isFinite(video.duration) || video.duration <= 2.5) return;
      video.currentTime = Math.min(2.2, video.duration * 0.12);
    },
    { once: true },
  );
});

updateHeader();
