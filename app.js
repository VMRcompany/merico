(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    function setMenuOpen(open) {
      menuToggle.classList.toggle("is-open", open);
      mobileMenu.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    }

    menuToggle.addEventListener("click", function () {
      setMenuOpen(!menuToggle.classList.contains("is-open"));
    });

    mobileMenu.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });
  }

  function resetTariffForm() {
    const form = document.querySelector("#tariff-modal .js-lead-form");
    if (!form) {
      return;
    }
    form.reset();
    const success = form.querySelector("[data-success]");
    const error = form.querySelector("[data-error]");
    const consent = form.querySelector(".js-consent");
    const submit = form.querySelector('button[type="submit"]');
    const title = document.getElementById("tariff-title");
    const subtitle = document.getElementById("tariff-subtitle");
    if (title) {
      title.textContent = "Заказать тариф";
    }
    if (subtitle) {
      subtitle.classList.remove("hidden");
    }
    if (success) {
      success.classList.add("hidden");
      success.textContent = "Спасибо. Заявка на тариф принята. Наш менеджер свяжется с вами в ближайшее время.";
    }
    if (error) {
      error.classList.add("hidden");
    }
    if (consent) {
      consent.checked = false;
    }
    if (submit) {
      submit.disabled = true;
    }
  }

  function openModal(id, tariff) {
    const modal = document.getElementById(id);
    if (!modal) {
      return;
    }
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (id === "tariff-modal") {
      resetTariffForm();
      if (tariff === "Зафиксировать условия") {
        document.getElementById("tariff-title").textContent = "Зафиксировать условия";
        document.getElementById("tariff-subtitle").classList.add("hidden");
        const success = document.querySelector("#tariff-modal [data-success]");
        if (success) {
          success.textContent = "Спасибо. Заявка принята. Наш менеджер свяжется с вами в ближайшее время.";
        }
        document.getElementById("tariff-input").value = tariff;
      } else if (tariff) {
        document.getElementById("tariff-name").textContent = tariff;
        document.getElementById("tariff-input").value = tariff;
      }
    }
  }

  function closeModal(modal) {
    if (modal.id === "tariff-modal") {
      resetTariffForm();
    }
    modal.classList.add("hidden");
    if (!document.querySelector(".modal:not(.hidden)")) {
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openModal(btn.getAttribute("data-open-modal"), btn.getAttribute("data-tariff"));
    });
  });

  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", function () {
        closeModal(modal);
      });
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal:not(.hidden)").forEach(closeModal);
    }
  });

  function maskPhone(input) {
    input.addEventListener("input", function () {
      let digits = input.value.replace(/\D/g, "");
      if (digits.startsWith("8")) {
        digits = "7" + digits.slice(1);
      }
      if (!digits.startsWith("7")) {
        digits = "7" + digits;
      }
      digits = digits.slice(0, 11);
      const rest = digits.slice(1);
      let formatted = "+7";
      if (rest.length) {
        formatted += " (" + rest.slice(0, 3);
      }
      if (rest.length >= 3) {
        formatted += ") " + rest.slice(3, 6);
      }
      if (rest.length >= 6) {
        formatted += "-" + rest.slice(6, 8);
      }
      if (rest.length >= 8) {
        formatted += "-" + rest.slice(8, 10);
      }
      input.value = formatted;
    });
  }

  document.querySelectorAll(".js-phone").forEach(maskPhone);

  function isPhoneValid(value) {
    return value.replace(/\D/g, "").length === 11;
  }

  function bindConsent(form) {
    const checkbox = form.querySelector(".js-consent");
    const submit = form.querySelector('button[type="submit"]');
    if (!checkbox || !submit) {
      return;
    }
    function sync() {
      submit.disabled = !checkbox.checked;
    }
    checkbox.addEventListener("change", sync);
    sync();
  }

  document.querySelectorAll(".js-lead-form, #quiz-form").forEach(bindConsent);

  function isHoneypotFilled(form) {
    const trap = form.querySelector('input[name="user_web_url"]');
    return Boolean(trap && trap.value.trim());
  }

  function showLeadSuccess(form) {
    if (form.id === "quiz-form") {
      const live = document.querySelector("#quiz .quiz-live");
      const done = document.querySelector("#quiz .quiz-complete");
      if (live) {
        live.classList.add("hidden");
      }
      if (done) {
        done.classList.remove("hidden");
      }
      return;
    }
    const success = form.querySelector("[data-success]");
    const submit = form.querySelector('button[type="submit"]');
    if (success) {
      success.classList.remove("hidden");
    }
    if (submit) {
      submit.disabled = true;
    }
  }

  function sendLead(form) {
    showLeadSuccess(form);
  }

  function handleLeadSubmit(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const phone = form.querySelector(".js-phone");
      const error = form.querySelector("[data-error]");
      const success = form.querySelector("[data-success]");
      error.classList.add("hidden");
      success.classList.add("hidden");
      if (isHoneypotFilled(form)) {
        showLeadSuccess(form);
        return;
      }
      if (!phone || !isPhoneValid(phone.value)) {
        error.textContent = "Укажите корректный номер телефона.";
        error.classList.remove("hidden");
        return;
      }
      sendLead(form);
    });
  }

  document.querySelectorAll(".js-lead-form").forEach(handleLeadSubmit);

  const quizForm = document.getElementById("quiz-form");
  let quizStep = 1;

  function showQuizStep(step) {
    quizStep = step;
    for (let i = 1; i <= 4; i += 1) {
      document.getElementById("quiz-step-" + i).classList.toggle("hidden", i !== step);
    }
    document.getElementById("quiz-progress").style.width = String(step * 25) + "%";
    document.getElementById("quiz-step-label").textContent = String(step);
  }

  quizForm.querySelectorAll("[data-quiz-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (quizStep === 1 && !quizForm.cleaningType.value) {
        return;
      }
      if (quizStep === 2 && !quizForm.area.value) {
        return;
      }
      showQuizStep(quizStep + 1);
    });
  });

  quizForm.querySelectorAll("[data-quiz-prev]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showQuizStep(quizStep - 1);
    });
  });

  handleLeadSubmit(quizForm);

  const cookieBanner = document.getElementById("cookie-banner");
  const cookieKey = "merico_cookies_accepted";
  if (localStorage.getItem(cookieKey) !== "1") {
    cookieBanner.classList.remove("hidden");
  }
  document.getElementById("cookie-accept").addEventListener("click", function () {
    localStorage.setItem(cookieKey, "1");
    cookieBanner.classList.add("hidden");
  });

  document.querySelectorAll(".lux-card-more").forEach(function (toggle) {
    const details = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!details) {
      return;
    }
    details.classList.add("hidden");
    details.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        details.classList.remove("hidden");
        details.classList.add("is-open");
      } else {
        details.classList.remove("is-open");
        details.classList.add("hidden");
      }
    });
  });

  const chatSlider = document.getElementById("reviews-chat-slider");
  const chatDots = document.getElementById("reviews-chat-dots");
  if (chatSlider && chatDots) {
    const slides = chatSlider.querySelectorAll(".reviews-chat-slide");
    const dots = chatDots.querySelectorAll(".reviews-chat-dot");

    function activeSlideIndex() {
      const center = chatSlider.scrollLeft + chatSlider.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach(function (slide, index) {
        const mid = slide.offsetLeft + slide.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      return best;
    }

    function syncChatDots() {
      const active = activeSlideIndex();
      dots.forEach(function (dot, index) {
        dot.classList.toggle("is-active", index === active);
      });
    }

    chatSlider.addEventListener("scroll", syncChatDots, { passive: true });
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        slides[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });

    function cardStep() {
      const slide = slides[0];
      const gap = parseFloat(window.getComputedStyle(chatSlider).gap) || 0;
      return slide ? slide.getBoundingClientRect().width + gap : 360;
    }

    const nextBtn = document.getElementById("reviews-chat-next");
    const prevBtn = document.getElementById("reviews-chat-prev");

    function syncChatArrows() {
      if (!prevBtn) {
        return;
      }
      const atStart = chatSlider.scrollLeft <= 8;
      prevBtn.classList.toggle("is-disabled", atStart);
      prevBtn.setAttribute("aria-disabled", String(atStart));
    }

    chatSlider.addEventListener("scroll", syncChatArrows, { passive: true });
    syncChatArrows();

    if (nextBtn) {
      nextBtn.addEventListener("click", function (event) {
        event.preventDefault();
        chatSlider.scrollBy({ left: cardStep(), behavior: "smooth" });
      });
    }
  }

  window.mericoChatPrev = function (event) {
    if (event) {
      event.preventDefault();
    }
    var slider = document.getElementById("reviews-chat-slider");
    if (!slider) {
      return;
    }
    var slide = slider.querySelector(".reviews-chat-slide");
    var gap = parseFloat(window.getComputedStyle(slider).columnGap || window.getComputedStyle(slider).gap) || 0;
    var amount = slide ? slide.getBoundingClientRect().width + gap : 360;
    slider.scrollTo({ left: Math.max(0, slider.scrollLeft - amount), behavior: "smooth" });
  };

  var prevArrow = document.getElementById("reviews-chat-prev");
  var chatRow = document.querySelector("#reviews-chat .reviews-chat-row");
  if (prevArrow) {
    prevArrow.onclick = window.mericoChatPrev;
  }
  if (chatRow && prevArrow) {
    chatRow.addEventListener("click", function (event) {
      if (prevArrow.contains(event.target)) {
        return;
      }
      var box = prevArrow.getBoundingClientRect();
      if (
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom
      ) {
        window.mericoChatPrev(event);
      }
    }, true);
  }
})();
