/**
 * Motilal Oswal Web Application - Core Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initSearchBox();
  initDematForms();
  initSipCalculator();
  initCarousel();
  initModals();
  initFloatingBar();
  initAccordions();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header-wrapper');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const menuIcon = document.querySelector('.menu-icon');
  const overlay = document.getElementById('mobileNavOverlay');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!menuIcon || !overlay || !drawer) return;

  function openDrawer() {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuIcon.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close when clicking internal links
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. Live Search & Category Filtering
   ========================================================================== */
function initSearchBox() {
  const searchInput = document.getElementById('mo-search-input');
  const searchContainer = document.getElementById('navbar-search-container');
  const categoryItems = document.querySelectorAll('.mo-search-category-list li');
  const resultBlocks = document.querySelectorAll('.mo-search-result-block');
  const backBtn = document.querySelector('.mo-search-back-btn');

  if (!searchInput || !searchContainer) return;

  // Show dropdown on focus
  searchInput.addEventListener('focus', () => {
    searchContainer.classList.add('active');
  });

  // Hide on back button or outside click
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      searchContainer.classList.remove('active');
      searchInput.blur();
    });
  }

  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
      searchContainer.classList.remove('active');
    }
  });

  // Category Tab Switching
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      categoryItems.forEach(c => c.classList.remove('active'));
      item.classList.add('active');

      const category = item.getAttribute('data-category');
      resultBlocks.forEach(block => {
        if (block.getAttribute('data-category-list') === category) {
          block.classList.add('mo-result-show');
          block.style.display = 'block';
        } else {
          block.classList.remove('mo-result-show');
          block.style.display = 'none';
        }
      });
    });
  });

  // Live filter query
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const activeBlock = document.querySelector('.mo-search-result-block.mo-result-show') || resultBlocks[0];
    if (!activeBlock) return;

    const listItems = activeBlock.querySelectorAll('.mo-search-result-data li:not(.loader)');
    let matches = 0;

    listItems.forEach(li => {
      const text = li.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        li.style.display = 'block';
        matches++;
      } else {
        li.style.display = 'none';
      }
    });

    const loader = activeBlock.querySelector('.loader');
    if (loader) {
      loader.style.display = matches === 0 && query ? 'block' : 'none';
      if (matches === 0 && query) {
        loader.textContent = `No results found for "${query}"`;
      }
    }
  });
}

/* ==========================================================================
   4. Demat Registration Forms & OTP Simulation
   ========================================================================== */
function initDematForms() {
  const homeForm = document.querySelector('.landing-demat-form-wrapper form');
  if (homeForm) {
    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleDematSubmit(homeForm);
    });
  }

  const swipeForm = document.querySelector('.floating-demat-bar form') || document.querySelector('.swipe-form form');
  if (swipeForm) {
    swipeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleDematSubmit(swipeForm);
    });
  }
}

function handleDematSubmit(formElement) {
  const nameInput = formElement.querySelector('#contactname') || formElement.querySelector('#swipename') || formElement.querySelector('input[type="text"]');
  const mobileInput = formElement.querySelector('#contactmob') || formElement.querySelector('#swipemob') || formElement.querySelector('input[type="tel"]');
  const submitBtn = formElement.querySelector('.submit-btn') || formElement.querySelector('.swipe-button') || formElement.querySelector('button[type="submit"]');

  const nameVal = nameInput ? nameInput.value.trim() : '';
  const mobileVal = mobileInput ? mobileInput.value.trim() : '';

  // Validation
  if (nameInput && nameVal.length < 2) {
    showToast('Please enter your full name', 'error');
    nameInput.focus();
    return;
  }

  if (!/^[6-9]\d{9}$/.test(mobileVal)) {
    showToast('Please enter a valid 10-digit mobile number starting with 6-9', 'error');
    if (mobileInput) mobileInput.focus();
    return;
  }

  // Button loading state
  const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;margin-right:8px;"></span> Verifying...';
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
    // Open OTP Verification Modal
    openOtpModal(mobileVal, nameVal);
  }, 700);
}

function openOtpModal(mobile, name) {
  const otpModal = document.getElementById('otpVerificationModal');
  const otpMobileSpan = document.getElementById('otpMobileNumber');
  if (!otpModal) return;

  if (otpMobileSpan) {
    otpMobileSpan.textContent = `+91 ${mobile}`;
  }

  openModal('otpVerificationModal');

  // Auto focus first OTP box
  const firstOtp = otpModal.querySelector('.otp-digit-input');
  if (firstOtp) {
    firstOtp.value = '';
    setTimeout(() => firstOtp.focus(), 150);
  }
}

/* ==========================================================================
   5. Interactive SIP & Wealth Financial Calculator
   ========================================================================== */
function initSipCalculator() {
  const amountSlider = document.getElementById('sipAmountSlider');
  const rateSlider = document.getElementById('sipRateSlider');
  const yearsSlider = document.getElementById('sipYearsSlider');

  const amountDisplay = document.getElementById('sipAmountVal');
  const rateDisplay = document.getElementById('sipRateVal');
  const yearsDisplay = document.getElementById('sipYearsVal');

  const investedDisplay = document.getElementById('sipInvestedTotal');
  const returnsDisplay = document.getElementById('sipReturnsTotal');
  const wealthDisplay = document.getElementById('sipWealthTotal');

  const investedBar = document.getElementById('sipBarInvested');
  const returnsBar = document.getElementById('sipBarReturns');

  if (!amountSlider || !rateSlider || !yearsSlider) return;

  function calculateSip() {
    const P = parseFloat(amountSlider.value);
    const annualRate = parseFloat(rateSlider.value);
    const years = parseFloat(yearsSlider.value);

    const i = (annualRate / 12) / 100;
    const n = years * 12;

    // SIP Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    let totalWealth = 0;
    if (i > 0) {
      totalWealth = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      totalWealth = P * n;
    }

    const totalInvested = P * n;
    const estimatedReturns = Math.max(0, totalWealth - totalInvested);

    // Update displays
    if (amountDisplay) amountDisplay.textContent = `₹${P.toLocaleString('en-IN')}`;
    if (rateDisplay) rateDisplay.textContent = `${annualRate}%`;
    if (yearsDisplay) yearsDisplay.textContent = `${years} ${years === 1 ? 'Year' : 'Years'}`;

    if (investedDisplay) investedDisplay.textContent = `₹${Math.round(totalInvested).toLocaleString('en-IN')}`;
    if (returnsDisplay) returnsDisplay.textContent = `₹${Math.round(estimatedReturns).toLocaleString('en-IN')}`;
    if (wealthDisplay) wealthDisplay.textContent = `₹${Math.round(totalWealth).toLocaleString('en-IN')}`;

    // Update visual bars
    if (investedBar && returnsBar && totalWealth > 0) {
      const investedPct = (totalInvested / totalWealth) * 100;
      const returnsPct = (estimatedReturns / totalWealth) * 100;
      investedBar.style.width = `${investedPct.toFixed(1)}%`;
      returnsBar.style.width = `${returnsPct.toFixed(1)}%`;
    }
  }

  amountSlider.addEventListener('input', calculateSip);
  rateSlider.addEventListener('input', calculateSip);
  yearsSlider.addEventListener('input', calculateSip);

  // Initial calculation
  calculateSip();
}

/* ==========================================================================
   6. Highlights Carousel Slider
   ========================================================================== */
function initCarousel() {
  const wrap = document.getElementById('highlightsCarousel') || document.querySelector('.highlights-carousel-wrap');
  if (!wrap) return;

  const track = wrap.querySelector('.highlights-slides-track');
  const slides = wrap.querySelectorAll('.highlights-slide');
  const dots = wrap.querySelectorAll('.hl-dot');

  if (!slides.length || !track) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  function updateCarousel(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    updateCarousel(currentIndex + 1);
  }

  function prevSlide() {
    updateCarousel(currentIndex - 1);
  }

  function startAuto() {
    stopAuto();
    autoplayTimer = setInterval(nextSlide, 3500);
  }

  function stopAuto() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateCarousel(idx);
      startAuto();
    });
  });

  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);

  // Touch Swipe Support
  let startX = 0;
  wrap.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  wrap.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAuto();
  }, { passive: true });

  updateCarousel(0);
  startAuto();
}

/* ==========================================================================
   7. Modals (Demat, OTP, Login)
   ========================================================================== */
function initModals() {
  // Bind all demat trigger buttons
  document.querySelectorAll('[data-open-modal="dematModal"], a[href*="open-demat-account"], button[data-href*="open-demat"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('dematModal');
    });
  });

  // Bind login trigger buttons
  document.querySelectorAll('[data-open-modal="loginModal"], .login-button, .partner-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('loginModal');
    });
  });

  // Close buttons
  document.querySelectorAll('.mo-modal-close, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.mo-modal-backdrop');
      if (modal) closeModal(modal.id);
    });
  });

  // Backdrop click
  document.querySelectorAll('.mo-modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.mo-modal-backdrop.open').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });

  // OTP Digits auto-advance
  const otpInputs = document.querySelectorAll('.otp-digit-input');
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length >= 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  const otpVerifyBtn = document.getElementById('verifyOtpBtn');
  if (otpVerifyBtn) {
    otpVerifyBtn.addEventListener('click', () => {
      let otp = '';
      otpInputs.forEach(i => otp += i.value);
      if (otp.length < 4) {
        showToast('Please enter the 4-digit OTP code', 'error');
        return;
      }
      otpVerifyBtn.disabled = true;
      otpVerifyBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:6px;"></span> Verifying...';

      setTimeout(() => {
        otpVerifyBtn.disabled = false;
        otpVerifyBtn.innerHTML = 'Verified Successfully ✓';
        closeModal('otpVerificationModal');
        showToast('🎉 Congratulations! Your Demat application has been initiated. Our investment advisor will connect with you shortly.', 'success', 6000);
      }, 1000);
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ==========================================================================
   8. Floating Bottom Demat Bar
   ========================================================================== */
function initFloatingBar() {
  const bar = document.querySelector('.floating-demat-bar');
  const closeBtn = document.querySelector('.floating-demat-close');
  if (!bar) return;

  let isClosed = false;

  window.addEventListener('scroll', () => {
    if (isClosed) return;
    if (window.scrollY > 350) {
      bar.classList.remove('hidden');
    } else {
      bar.classList.add('hidden');
    }
  }, { passive: true });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      isClosed = true;
      bar.classList.add('hidden');
    });
  }
}

/* ==========================================================================
   9. Accordions (FAQ & Footer directories)
   ========================================================================== */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      parent.classList.toggle('active');
      const body = parent.querySelector('.accordion-body');
      if (body) {
        body.style.display = parent.classList.contains('active') ? 'block' : 'none';
      }
    });
  });

  // FAQ Accordions
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const isActive = item.classList.contains('active');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');

      if (isActive) {
        item.classList.remove('active');
        if (answer) answer.style.display = 'none';
        if (icon) icon.textContent = '+';
      } else {
        item.classList.add('active');
        if (answer) answer.style.display = 'block';
        if (icon) icon.textContent = '−';
      }
    });
  });
}

/* ==========================================================================
   10. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.mo-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'mo-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `mo-toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
