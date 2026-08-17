// =====================================
// EDIT YOUR GALLERY HERE
// =====================================
// You can add your own photos by placing them in the assets/images/gallery folder (create it if needed).
// Supported formats: .jpg, .jpeg, .png, .webp (WebP recommended for faster loading).
// To add more photos, simply add another object to this array.
// Example:
// {
//     image: "../assets/images/gallery/myphoto.jpg",
//     title: "My Title",
//     caption: "My memory description."
// }

const galleryItems = [
    {
        image: "../assets/images/gallery/shona1.jpeg",
        title: "Your Bright Smile",
        tag: "Memory 01",
        caption: "The smile that lights up my whole world."
    },
    {
        image: "../assets/images/gallery/shona2.jpeg",
        title: "Cherished Moment",
        tag: "Memory 02",
        caption: "Every single second spent with you becomes a favorite memory."
    },
    {
        image: "../assets/images/gallery/shona3.jpeg",
        title: "My Favorite View",
        tag: "Memory 03",
        caption: "Looking at you makes everything else simply fade away."
    },
    {
        image: "../assets/images/gallery/shona4.jpeg",
        title: "Pure Grace & Happiness",
        tag: "Memory 04",
        caption: "Your warmth and joy bring endless light into my life."
    },
    {
        image: "../assets/images/gallery/shona5.jpeg",
        title: "Forever Special",
        tag: "Memory 05",
        caption: "No words can ever capture how truly special you are to me."
    },
    {
        image: "../assets/images/gallery/shona6.jpeg",
        title: "My Heart's Joy",
        tag: "Memory 06",
        caption: "With you, every single day feels like a beautiful dream come true."
    },
    {
        image: "../assets/images/gallery/imagination1.jpeg",
        title: "Imagining Us Together",
        tag: "Imagination 💭",
        caption: "How I picture us together in my dreams, without even having met yet."
    },
    {
        image: "../assets/images/gallery/imagination2.jpeg",
        title: "Our Unwritten Story",
        tag: "Imagination 💭",
        caption: "A glimpse of the beautiful future I dream of building with you."
    }
];

// =====================================
// GALLERY LOGIC (DO NOT EDIT BELOW)
// =====================================

document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;

  // Render Gallery Items dynamically
  galleryItems.forEach((item, index) => {
    const itemNum = (index + 1).toString().padStart(2, '0');
    const figure = document.createElement('figure');
    figure.className = 'gallery-masonry-item';
    figure.tabIndex = 0;
    figure.dataset.index = index;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', `View photo: ${item.title}. Press Enter or Space to open lightbox`);

    figure.innerHTML = `
      <img class="gallery-img" loading="lazy" decoding="async" src="${item.image}" alt="${item.title} memory photograph" />
      <figcaption class="gallery-overlay">
        <span class="gallery-item-tag">${item.tag || ('Memory ' + itemNum)}</span>
        <h2 class="gallery-item-title">${item.title}</h2>
      </figcaption>
    `;
    galleryContainer.appendChild(figure);
  });

  // Lightbox Implementation
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxText = lightbox.querySelector('.lightbox-text');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');
  
  let currentIndex = 0;
  
  function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    
    lightboxImg.src = item.image;
    lightboxTitle.textContent = item.title;
    if (lightboxText) lightboxText.textContent = item.caption || "";
    lightboxCounter.textContent = `Memory ${currentIndex + 1} of ${galleryItems.length}`;
    
    lightbox.classList.add('visible');
    lightbox.focus();
  }
  
  function closeLightbox() {
    lightbox.classList.remove('visible');
    // Return focus to the clicked item for accessibility
    const items = document.querySelectorAll('.gallery-masonry-item');
    if (items[currentIndex]) {
      items[currentIndex].focus();
    }
  }
  
  function showPrev() {
    if (currentIndex > 0) {
      openLightbox(currentIndex - 1);
    } else {
      openLightbox(galleryItems.length - 1);
    }
  }
  
  function showNext() {
    if (currentIndex < galleryItems.length - 1) {
      openLightbox(currentIndex + 1);
    } else {
      openLightbox(0);
    }
  }

  // Event Delegation for opening lightbox
  galleryContainer.addEventListener('click', (e) => {
    const figure = e.target.closest('.gallery-masonry-item');
    if (figure) {
      const idx = parseInt(figure.dataset.index, 10);
      openLightbox(idx);
    }
  });

  galleryContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const figure = e.target.closest('.gallery-masonry-item');
      if (figure) {
        e.preventDefault();
        const idx = parseInt(figure.dataset.index, 10);
        openLightbox(idx);
      }
    }
  });

  // Lightbox Controls
  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnPrev) btnPrev.addEventListener('click', showPrev);
  if (btnNext) btnNext.addEventListener('click', showNext);
  
  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-img-wrap')) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation within lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible')) return;
    
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showPrev();
    else if (e.key === 'ArrowRight') showNext();
  });
  
  // Mobile swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const minSwipeDistance = 50;
    if (touchEndX < touchStartX - minSwipeDistance) {
      showNext();
    } else if (touchEndX > touchStartX + minSwipeDistance) {
      showPrev();
    }
  }
});
