document.addEventListener('DOMContentLoaded', function () {
  // =========================================================
  // HERO SLIDER
  // =========================================================
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;

    const activeSlide = slides[index];
    if (activeSlide.dataset.type === 'video') {
      const iframe = activeSlide.querySelector('iframe');
      if (iframe) {
        const src = iframe.src;
        iframe.src = src;
      }
    }
  }

  function nextSlide() {
    if (slides.length === 0) return;
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function prevSlide() {
    if (slides.length === 0) return;
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }

  function startSlider() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', function () {
      stopSlider();
      goToSlide(index);
      startSlider();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      stopSlider();
      prevSlide();
      startSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      stopSlider();
      nextSlide();
      startSlider();
    });
  }

  const slider = document.getElementById('heroSlider');
  if (slider) {
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);
    startSlider();
  }

  // =========================================================
  // COURSE CATEGORY SLIDER
  // =========================================================
  const categoryTrack = document.getElementById('categoryTrack');
  const prevCategory = document.getElementById('prevCategory');
  const nextCategory = document.getElementById('nextCategory');
  let categoryPosition = 0;
  let categoryVisible = 4;

  function getCategoryVisible() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  }

  function updateCategorySlider() {
    if (!categoryTrack) return;
    categoryVisible = getCategoryVisible();
    const cards = categoryTrack.querySelectorAll('.category-card-pro');
    const maxPosition = Math.max(0, cards.length - categoryVisible);
    if (categoryPosition > maxPosition) categoryPosition = maxPosition;
    const cardWidth = cards[0]?.offsetWidth + 20 || 270;
    categoryTrack.style.transform = `translateX(-${categoryPosition * cardWidth}px)`;
    updateCategoryButtons();
  }

  function updateCategoryButtons() {
    if (!categoryTrack) return;
    const cards = categoryTrack.querySelectorAll('.category-card-pro');
    const maxPosition = Math.max(0, cards.length - categoryVisible);
    if (prevCategory) prevCategory.style.display = categoryPosition > 0 ? 'flex' : 'none';
    if (nextCategory) nextCategory.style.display = categoryPosition < maxPosition ? 'flex' : 'none';
  }

  if (prevCategory && nextCategory && categoryTrack) {
    prevCategory.addEventListener('click', function () {
      if (categoryPosition > 0) {
        categoryPosition--;
        updateCategorySlider();
      }
    });

    nextCategory.addEventListener('click', function () {
      const cards = categoryTrack.querySelectorAll('.category-card-pro');
      const maxPosition = Math.max(0, cards.length - categoryVisible);
      if (categoryPosition < maxPosition) {
        categoryPosition++;
        updateCategorySlider();
      }
    });

    window.addEventListener('resize', updateCategorySlider);
    setTimeout(updateCategorySlider, 100);
  }

  // =========================================================
  // GALLERY SLIDER
  // =========================================================
  const galleryTrack = document.getElementById('galleryTrack');
  const prevGallery = document.getElementById('prevGallery');
  const nextGallery = document.getElementById('nextGallery');
  const galleryDots = document.getElementById('galleryDots');
  let galleryPosition = 0;
  let galleryVisible = 3;

  function getGalleryVisible() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }

  function updateGallerySlider() {
    if (!galleryTrack) return;
    galleryVisible = getGalleryVisible();
    const items = galleryTrack.querySelectorAll('.gallery-item');
    const maxPosition = Math.max(0, items.length - galleryVisible);
    if (galleryPosition > maxPosition) galleryPosition = maxPosition;
    const itemWidth = items[0]?.offsetWidth + 20 || 320;
    galleryTrack.style.transform = `translateX(-${galleryPosition * itemWidth}px)`;
    updateGalleryButtons();
    updateGalleryDots();
  }

  function updateGalleryButtons() {
    if (!galleryTrack) return;
    const items = galleryTrack.querySelectorAll('.gallery-item');
    const maxPosition = Math.max(0, items.length - galleryVisible);
    if (prevGallery) prevGallery.style.display = galleryPosition > 0 ? 'flex' : 'none';
    if (nextGallery) nextGallery.style.display = galleryPosition < maxPosition ? 'flex' : 'none';
  }

  function updateGalleryDots() {
    if (!galleryDots || !galleryTrack) return;
    const items = galleryTrack.querySelectorAll('.gallery-item');
    const totalDots = Math.ceil(items.length / galleryVisible);
    galleryDots.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === Math.floor(galleryPosition / galleryVisible) ? ' active' : '');
      dot.addEventListener('click', function () {
        galleryPosition = i * galleryVisible;
        updateGallerySlider();
      });
      galleryDots.appendChild(dot);
    }
  }

  if (prevGallery && nextGallery && galleryTrack) {
    prevGallery.addEventListener('click', function () {
      if (galleryPosition > 0) {
        galleryPosition--;
        updateGallerySlider();
      }
    });

    nextGallery.addEventListener('click', function () {
      const items = galleryTrack.querySelectorAll('.gallery-item');
      const maxPosition = Math.max(0, items.length - galleryVisible);
      if (galleryPosition < maxPosition) {
        galleryPosition++;
        updateGallerySlider();
      }
    });

    window.addEventListener('resize', updateGallerySlider);
    setTimeout(updateGallerySlider, 100);
  }

  // =========================================================
  // NAVBAR SCROLL EFFECT
  // =========================================================
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.main-navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
        navbar.style.background = 'rgba(10, 10, 46, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
      } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        navbar.style.background = '#0a0a2e';
        navbar.style.backdropFilter = 'none';
      }
    }
  });

  // =========================================================
  // CSRF HELPER
  // =========================================================
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // =========================================================
  // INDEX PAGE ENROLLMENT FORM → POST to /enroll/
  // =========================================================
  const enrollForm = document.getElementById('enrollmentForm');
  if (enrollForm) {
    enrollForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = enrollForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';

      const formData = new FormData();
      formData.append('name', document.getElementById('enrollName').value.trim());
      formData.append('email', document.getElementById('enrollEmail').value.trim());
      formData.append('phone', document.getElementById('enrollPhone').value.trim());
      formData.append('course', document.getElementById('enrollCourse').value);
      formData.append('message', document.getElementById('enrollMessage').value.trim());
      formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
      }

      fetch(enrollForm.dataset.url || '/enroll/', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData,
      })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(({ status, data }) => {
          if (data.ok) {
            alert(data.message);
            enrollForm.reset();
          } else {
            let errMsg = '';
            if (data.errors) {
              Object.keys(data.errors).forEach(key => {
                errMsg += data.errors[key].join('\n') + '\n';
              });
            }
            alert(errMsg || 'Please fill in all required fields.');
          }
        })
        .catch(() => {
          alert('Something went wrong. Please try again.');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
          }
        });
    });
  }

  // =========================================================
  // CONTACT FORM → POST to /contact/submit/
  // =========================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';

      const formData = new FormData();
      formData.append('name', document.getElementById('contactName').value.trim());
      formData.append('email', document.getElementById('contactEmail').value.trim());
      formData.append('phone', document.getElementById('contactPhone').value.trim());
      formData.append('subject', document.getElementById('contactSubject').value.trim());
      formData.append('message', document.getElementById('contactMessage').value.trim());
      formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
      }

      fetch(contactForm.dataset.url || '/contact/submit/', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData,
      })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(({ status, data }) => {
          if (data.ok) {
            alert(data.message);
            contactForm.reset();
          } else {
            let errMsg = '';
            if (data.errors) {
              Object.keys(data.errors).forEach(key => {
                errMsg += data.errors[key].join('\n') + '\n';
              });
            }
            alert(errMsg || 'Please fill all required fields.');
          }
        })
        .catch(() => {
          alert('Something went wrong. Please try again.');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
          }
        });
    });
  }

  // =========================================================
  // COURSE PAGE ENROLLMENT MODAL
  // =========================================================
  const enrollButtons = document.querySelectorAll('.enroll-btn');
  const modalCourseName = document.getElementById('modalCourseName');
  const modalEnrollForm = document.getElementById('modalEnrollForm');
  const isAuthenticated = document.body.dataset.authenticated === 'true';
  const currentUserName = document.body.dataset.userName || '';
  const currentUserEmail = document.body.dataset.userEmail || '';

  if (enrollButtons.length > 0 && modalCourseName) {
    enrollButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        if (!isAuthenticated) {
          e.preventDefault();
          e.stopPropagation();

          const modalEl = document.getElementById('enrollModal');
          if (modalEl) {
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
          }

          alert('Please login first to enroll in a course.');

          const course = this.getAttribute('data-course') || '';
          try {
            sessionStorage.setItem('pendingCourse', course);
          } catch (err) { /* ignore */ }

          window.location.href = '/login/?next=/courses/';
          return;
        }

        const course = this.getAttribute('data-course');
        modalCourseName.value = course || '';

        const modalName = document.getElementById('modalName');
        const modalEmail = document.getElementById('modalEmail');
        if (modalName && !modalName.value) modalName.value = currentUserName;
        if (modalEmail && !modalEmail.value) modalEmail.value = currentUserEmail;
      });
    });
  }

  if (modalEnrollForm) {
    modalEnrollForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!isAuthenticated) {
        alert('Please login first to enroll in a course.');
        window.location.href = '/login/?next=/courses/';
        return;
      }

      const submitBtn = modalEnrollForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';

      const formData = new FormData();
      formData.append('course', document.getElementById('modalCourseName').value);
      formData.append('name', document.getElementById('modalName').value.trim());
      formData.append('email', document.getElementById('modalEmail').value.trim());
      formData.append('phone', document.getElementById('modalPhone').value.trim());
      formData.append('batch', document.getElementById('modalBatch').value);
      formData.append('message', document.getElementById('modalMessage').value.trim());
      formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
      }

      fetch(modalEnrollForm.dataset.url || '/enroll/course/', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData,
      })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(({ status, data }) => {
          const modalEl = document.getElementById('enrollModal');
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();

          if (data.ok) {
            setTimeout(() => { alert(data.message); }, 400);
            modalEnrollForm.reset();
          } else {
            let errMsg = '';
            if (data.errors) {
              Object.keys(data.errors).forEach(key => {
                errMsg += data.errors[key].join('\n') + '\n';
              });
            }
            setTimeout(() => { alert(errMsg || 'Please fill in all required fields.'); }, 400);
          }
        })
        .catch(() => {
          alert('Something went wrong. Please try again.');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
          }
        });
    });
  }

  // =========================================================
  // COURSE FILTER
  // =========================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseItems = document.querySelectorAll('.course-item');
  const noCoursesMsg = document.getElementById('noCoursesMsg');

  if (filterButtons.length > 0 && courseItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        let visibleCount = 0;

        courseItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('hide');
            item.style.display = '';
            visibleCount++;
          } else {
            item.classList.add('hide');
            item.style.display = 'none';
          }
        });

        if (noCoursesMsg) {
          noCoursesMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    });
  }

  // =========================================================
  // STATS COUNTER
  // =========================================================
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    let countersStarted = false;

    function animateCounters() {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }

    function checkCounters() {
      if (countersStarted) return;
      const statsSection = document.querySelector('.stats-section');
      if (!statsSection) return;
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50 && rect.bottom > 0) {
        countersStarted = true;
        animateCounters();
      }
    }

    window.addEventListener('scroll', checkCounters);
    window.addEventListener('resize', checkCounters);
    window.addEventListener('load', checkCounters);
    setTimeout(checkCounters, 200);
    setTimeout(checkCounters, 800);
  }

  // =========================================================
  // AUTO-DISMISS DJANGO MESSAGES AFTER 4s
  // =========================================================
  const messageAlerts = document.querySelectorAll('.django-messages .alert');
  if (messageAlerts.length > 0) {
    setTimeout(() => {
      messageAlerts.forEach(alertEl => {
        alertEl.style.transition = 'opacity 0.5s ease';
        alertEl.style.opacity = '0';
        setTimeout(() => alertEl.remove(), 500);
      });
    }, 4000);
  }
});

// =========================================================
// FULLSCREEN IMAGE
// =========================================================
function openFullscreen(element) {
  const img = element.querySelector('img');
  const modal = document.getElementById('fullscreenModal');
  const modalImg = document.getElementById('fullscreenImg');

  if (!modal || !modalImg || !img) return;

  modal.style.display = 'block';
  modalImg.src = img.src;
  document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
  const modal = document.getElementById('fullscreenModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeFullscreen();
  }
});

// =========================================================
// PASSWORD TOGGLE
// =========================================================
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  } else {
    input.type = 'password';
    if (icon) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
}