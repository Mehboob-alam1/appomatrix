(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".reveal").forEach((el) => {
    if (reduce) {
      el.classList.add("is-visible");
      return;
    }
  });

  if (!reduce) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    document.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.05, 0.4) + "s";
      observer.observe(el);
    });
  }

  const panel = document.getElementById("testimonials-home");
  if (!panel) return;

  const slides = panel.querySelectorAll(".testimonial-slide");
  const dots = panel.querySelectorAll(".testimonial-dot");
  if (slides.length < 2) return;

  let index = 0;
  let timer;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("is-active", j === index));
    dots.forEach((d, j) => d.classList.toggle("is-active", j === index));
  }

  function startAuto() {
    clearInterval(timer);
    if (reduce) return;
    timer = setInterval(() => goTo(index + 1), 6000);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.slide));
      startAuto();
    });
  });

  goTo(0);
  startAuto();
})();
