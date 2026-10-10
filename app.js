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

  function openModal(id, tariff) {
    const modal = document.getElementById(id);
    if (!modal) {
      return;
    }
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (id === "tariff-modal" && tariff) {
      document.getElementById("tariff-name").textContent = tariff;
      document.getElementById("tariff-input").value = tariff;
    }
  }

  function closeModal(modal) {
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

  function handleLeadSubmit(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const phone = form.querySelector(".js-phone");
      const error = form.querySelector("[data-error]");
      const success = form.querySelector("[data-success]");
      error.classList.add("hidden");
      success.classList.add("hidden");
      if (!phone || !isPhoneValid(phone.value)) {
        error.textContent = "Укажите корректный номер телефона.";
        error.classList.remove("hidden");
        return;
      }
      success.classList.remove("hidden");
      form.querySelector('button[type="submit"]').disabled = true;
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
    if (step === 4) {
      const type = quizForm.cleaningType.value;
      const extras = Array.from(quizForm.querySelectorAll('input[name="extras"]:checked')).length;
      const base = { Генеральная: 9900, Люкс: 24900, "После ремонта": 14900, Эко: 9900 }[type] || 9900;
      const total = base + extras * 1000;
      document.getElementById("quiz-estimate").textContent =
        "Ориентир стоимости: от " + total.toLocaleString("ru-RU") + " руб.";
    }
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

  const luxToggle = document.getElementById("lux-details-toggle");
  const luxDetails = document.getElementById("lux-details");
  if (luxToggle && luxDetails) {
    luxToggle.addEventListener("click", function () {
      const open = luxToggle.classList.toggle("is-open");
      luxDetails.classList.toggle("is-open", open);
      luxToggle.setAttribute("aria-expanded", String(open));
    });
  }
})();
