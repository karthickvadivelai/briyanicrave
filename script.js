/* ==========================================================================
   BIRYANI CRAVE - INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------
  // 1. Preloader Fade-out
  // ---------------------------------------------------------
  const loader = document.getElementById('loader');
  if (loader) {
    // Keep loader visible for at least 800ms to show the steam animation
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 1000);
  }

  // Global helper for carousel order button redirection
  window.addCarouselItemToForm = (name) => {
    const btn = document.querySelector(`.add-to-form-btn[data-name="${name}"]`);
    if (btn) {
      btn.click();
    } else {
      console.warn(`Could not find menu item button for: ${name}`);
    }
  };

  // ---------------------------------------------------------
  // Carousel Slideshow Logic
  // ---------------------------------------------------------
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const carouselContainer = document.getElementById('home');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 5000; // 5 seconds

  function showSlide(index) {
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }

    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopSlideShow() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startSlideShow();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startSlideShow();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-slide'));
      showSlide(targetIndex);
      startSlideShow();
    });
  });

  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopSlideShow);
    carouselContainer.addEventListener('mouseleave', startSlideShow);
  }

  // Initialize carousel
  if (slides.length > 0) {
    showSlide(currentSlide);
    startSlideShow();
  }


  // ---------------------------------------------------------
  // 2. Mobile Menu Navigation
  // ---------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when clicking any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('mobile-open');
        
        // Update active class immediately on click
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  // ---------------------------------------------------------
  // 3. Navigation Active Link Spy on Scroll
  // ---------------------------------------------------------
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // offset navigation bar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // ---------------------------------------------------------
  // 4. Digital Menu Filter Logic
  // ---------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuGrid = document.getElementById('menuGrid');
  const menuCards = document.querySelectorAll('.menu-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active chip class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Fade-out menu grid briefly
      menuGrid.style.opacity = '0';

      setTimeout(() => {
        menuCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        // Fade-in menu grid
        menuGrid.style.opacity = '1';
      }, 250);
    });
  });

  // ---------------------------------------------------------
  // 5. Lightbox Modal for Physical Menu Card
  // ---------------------------------------------------------
  const modal = document.getElementById('lightboxModal');
  const menuCardContainer = document.getElementById('menuCardContainer');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  if (menuCardContainer && modal) {
    menuCardContainer.addEventListener('click', () => {
      const imgElement = menuCardContainer.querySelector('.physical-menu-img');
      modal.style.display = 'block';
      modalImg.src = imgElement.src;
      modalCaption.innerHTML = imgElement.alt + ' - Registration: FSSAI Certified & MSME Registered';
      document.body.style.overflow = 'hidden'; // stop background scroll
    });

    // Close on click close mark
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; // restore scroll
    });

    // Close on click overlay background
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // ---------------------------------------------------------
  // 6. Interactive Custom Order Form (Cart System)
  // ---------------------------------------------------------
  let cart = [];

  const addToFormBtns = document.querySelectorAll('.add-to-form-btn');
  const selectedItemsContainer = document.getElementById('selectedItemsContainer');
  const orderSummaryRow = document.getElementById('orderSummaryRow');
  const summaryTotal = document.getElementById('summaryTotal');

  addToFormBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const itemName = btn.getAttribute('data-name');
      const itemPrice = parseInt(btn.getAttribute('data-price'));

      // Check if item is already in cart
      const existingItem = cart.find(item => item.name === itemName);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          name: itemName,
          price: itemPrice,
          quantity: 1
        });
      }

      // Re-render UI
      renderCart();

      // Show small toast alert or animation cue
      btn.textContent = 'Added ✔';
      btn.style.backgroundColor = 'rgba(39, 174, 96, 0.2)';
      btn.style.borderColor = 'var(--color-veg)';
      
      setTimeout(() => {
        btn.textContent = 'Add to Form';
        btn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      }, 1000);

      // Auto-scroll to form if it was the first item added
      if (cart.length === 1 && cart[0].quantity === 1) {
        setTimeout(() => {
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    });
  });

  function renderCart() {
    selectedItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      selectedItemsContainer.innerHTML = `<p class="empty-cart-msg">No items added yet. Click "Add to Form" on any menu item above to build your order!</p>`;
      orderSummaryRow.classList.add('hidden');
      return;
    }

    orderSummaryRow.classList.remove('hidden');
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItemEl = document.createElement('div');
      cartItemEl.className = 'cart-item';
      cartItemEl.innerHTML = `
        <span class="cart-item-name">${item.name}</span>
        <div class="cart-item-controls">
          <button type="button" class="quantity-btn minus-btn" data-index="${index}">&minus;</button>
          <span class="quantity-val">${item.quantity}</span>
          <button type="button" class="quantity-btn plus-btn" data-index="${index}">+</button>
          <span class="cart-item-price">₹${itemTotal}</span>
          <button type="button" class="remove-item-btn" data-index="${index}">&times;</button>
        </div>
      `;

      selectedItemsContainer.appendChild(cartItemEl);
    });

    summaryTotal.textContent = `₹${total}`;

    // Add listeners to new controls
    document.querySelectorAll('.minus-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        renderCart();
      });
    });

    document.querySelectorAll('.plus-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        cart[index].quantity += 1;
        renderCart();
      });
    });

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        cart.splice(index, 1);
        renderCart();
      });
    });
  }

  // ---------------------------------------------------------
  // 7. Order Form Submit Handler (WhatsApp Compiler)
  // ---------------------------------------------------------
  const orderForm = document.getElementById('orderForm');

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert('Please select at least one item from the digital menu before submitting your order!');
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Gather input values
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      const paymentMode = document.getElementById('paymentMode').value;

      // Compile items list
      let itemsListStr = '';
      let grandTotal = 0;

      cart.forEach(item => {
        const cost = item.price * item.quantity;
        grandTotal += cost;
        itemsListStr += `• ${item.quantity}x ${item.name} (₹${cost})\n`;
      });

      // WhatsApp Message Formatting
      const waMessage = 
`*NEW DELIVERY ORDER - BIRYANI CRAVE*
----------------------------------------
*Customer Details:*
• *Name:* ${name}
• *Phone:* ${phone}
• *Delivery Address:* ${address}
• *Payment Mode:* ${paymentMode}

*Items Ordered:*
${itemsListStr}
*Grand Total:* *₹${grandTotal}*
----------------------------------------
Thank you! Please confirm my order placement.`;

      // Compile WhatsApp API URI (WhatsApp Number: 9975361445)
      const encodedMsg = encodeURIComponent(waMessage);
      const waURL = `https://wa.me/919975361445?text=${encodedMsg}`;

      // Clear Cart and reset form on submit
      cart = [];
      renderCart();
      orderForm.reset();

      // Open in new tab
      window.open(waURL, '_blank');
    });
  }

});
