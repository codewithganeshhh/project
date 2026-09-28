/**
 * homepage-pro.js
 * Professional effects, animations & interactions for Zaheer Ansari IT Training Institute
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. STATS / METRICS NUMBER COUNTER ANIMATION
  // =========================================================
  const counterElements = document.querySelectorAll('.metric-number[data-target]');

  if (counterElements.length > 0) {
    const runCounter = (el) => {
      const targetStr = el.getAttribute('data-target');
      const isDecimal = targetStr.includes('.');
      const target = parseFloat(targetStr);
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeProgress;

        if (isDecimal) {
          el.textContent = currentVal.toFixed(1);
        } else {
          el.textContent = Math.floor(currentVal).toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCount);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // =========================================================
  // 2. FAQ ACCORDION INTERACTIVITY
  // =========================================================
  const faqItems = document.querySelectorAll('.faq-card-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    if (btn && panel) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other open panels
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherPanel = other.querySelector('.faq-answer-panel');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        // Toggle current panel
        if (!isActive) {
          item.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          panel.style.maxHeight = null;
        }
      });
    }
  });

  // Open first FAQ item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstPanel = firstItem.querySelector('.faq-answer-panel');
    firstItem.classList.add('active');
    if (firstPanel) {
      firstPanel.style.maxHeight = firstPanel.scrollHeight + 'px';
    }
  }

  // =========================================================
  // 3. BACK TO TOP BUTTON
  // =========================================================
  const backTopBtn = document.getElementById('backToTopBtn');

  if (backTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backTopBtn.classList.add('show');
      } else {
        backTopBtn.classList.remove('show');
      }
    });

    backTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================
  // 4. INFINITE MARQUEE CLONER
  // =========================================================
  const marqueeTrack = document.getElementById('hiringMarqueeTrack');
  if (marqueeTrack) {
    const clone = marqueeTrack.cloneNode(true);
    clone.id = 'hiringMarqueeTrackClone';
    marqueeTrack.parentNode.appendChild(clone);
  }
});
