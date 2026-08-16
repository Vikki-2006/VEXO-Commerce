// VEXO Systems — Client State & Interaction Engine

const VexoStore = {
  productsRegistry: {},
  // Theme management matching useThemeStore.ts
  theme: {
    get() {
      const saved = localStorage.getItem('vexo_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    },
    set(newTheme) {
      localStorage.setItem('vexo_theme', newTheme);
      this.apply();
      VexoStore.toasts.add({
        type: 'info',
        title: `Activated ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`,
        message: `Switched visual theme to ${newTheme === 'dark' ? 'Matte Obsidian' : 'Warm Sandstone'}.`
      });
    },
    toggle() {
      const nextTheme = this.get() === 'light' ? 'dark' : 'light';
      this.set(nextTheme);
    },
    apply() {
      const current = this.get();
      const root = document.documentElement;
      if (current === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      const sunIcon = document.getElementById('theme-icon-sun');
      const moonIcon = document.getElementById('theme-icon-moon');
      if (sunIcon && moonIcon) {
        if (current === 'dark') {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
    }
  },
  
  // Cart management matching useCartStore.ts
  cart: {
    getItems() {
      try {
        return JSON.parse(localStorage.getItem('vexo_cart') || '[]');
      } catch(e) {
        return [];
      }
    },
    saveItems(items) {
      localStorage.setItem('vexo_cart', JSON.stringify(items));
      this.updateUI();
    },
    addItem(product, quantity = 1, color = '', size = '') {
      const items = this.getItems();
      const idx = items.findIndex(it => it.product.id === product.id && it.color === color && it.size === size);
      if (idx > -1) {
        items[idx].quantity += quantity;
      } else {
        items.push({ product, quantity, color, size });
      }
      this.saveItems(items);
      
      VexoStore.toasts.add({
        type: 'success',
        title: 'Added to Bag',
        message: `${quantity}x ${product.title} successfully added to your bag.`
      });
      
      VexoStore.cartDrawer.open();
    },
    removeItem(productId, color = '', size = '') {
      let items = this.getItems();
      items = items.filter(it => !(it.product.id === productId && it.color === color && it.size === size));
      this.saveItems(items);
    },
    updateQuantity(productId, quantity, color = '', size = '') {
      if (quantity <= 0) {
        this.removeItem(productId, color, size);
        return;
      }
      const items = this.getItems();
      const idx = items.findIndex(it => it.product.id === productId && it.color === color && it.size === size);
      if (idx > -1) {
        items[idx].quantity = quantity;
      }
      this.saveItems(items);
    },
    clear() {
      localStorage.removeItem('vexo_cart');
      this.removeCoupon();
      this.updateUI();
    },
    getSubtotal() {
      return this.getItems().reduce((acc, it) => acc + (it.product.price * it.quantity), 0);
    },
    getShippingFee() {
      const subtotal = this.getSubtotal();
      if (subtotal === 0) return 0;
      return subtotal >= 15000 ? 0 : 1500;
    },
    applyCoupon(code, discountAmount) {
      localStorage.setItem('vexo_coupon_code', code);
      localStorage.setItem('vexo_discount_amount', String(discountAmount));
      this.updateUI();
    },
    removeCoupon() {
      localStorage.removeItem('vexo_coupon_code');
      localStorage.removeItem('vexo_discount_amount');
      this.updateUI();
    },
    getCouponCode() {
      return localStorage.getItem('vexo_coupon_code');
    },
    getDiscountAmount() {
      return Number(localStorage.getItem('vexo_discount_amount') || '0');
    },
    getTotal() {
      const subtotal = this.getSubtotal();
      const shipping = this.getShippingFee();
      const discount = this.getDiscountAmount();
      return Math.max(0, subtotal - discount + shipping);
    },
    getItemCount() {
      return this.getItems().reduce((acc, it) => acc + it.quantity, 0);
    },
    updateUI() {
      const items = this.getItems();
      const count = this.getItemCount();
      
      const countBadge = document.getElementById('nav-cart-count-badge');
      const emptyBadge = document.getElementById('nav-cart-empty-badge');
      if (countBadge && emptyBadge) {
        if (count > 0) {
          countBadge.textContent = count;
          countBadge.classList.remove('hidden');
          emptyBadge.classList.add('hidden');
        } else {
          countBadge.classList.add('hidden');
          emptyBadge.classList.remove('hidden');
          emptyBadge.textContent = '(0)';
        }
      }
      
      const listContainer = document.getElementById('cart-items-list');
      const footerSummary = document.getElementById('cart-summary-footer');
      const itemsCountText = document.getElementById('cart-items-count-text');
      const clearBtn = document.getElementById('cart-clear-btn');
      
      if (listContainer) {
        if (items.length === 0) {
          if (clearBtn) clearBtn.classList.add('hidden');
          if (footerSummary) footerSummary.classList.add('hidden');
          if (itemsCountText) itemsCountText.textContent = '0 unique items';
          
          listContainer.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 rounded-2xl bg-warm border border-sand flex items-center justify-center mx-auto mb-4 text-stone text-2xl">
                  👜
                </div>
                <h4 class="text-base font-bold text-ink mb-1">Your shopping bag is empty</h4>
                <p class="text-xs text-stone max-w-xs mb-6 font-semibold">
                  Discover handcrafted premium architectural hardware.
                </p>
                <button onclick="VexoStore.cartDrawer.close(); window.location.href='/shop';" class="btn-matte btn-primary px-5 py-2.5 text-xs font-bold">
                  Continue Shopping
                </button>
              </div>
            </div>
          `;
        } else {
          if (clearBtn) clearBtn.classList.remove('hidden');
          if (footerSummary) footerSummary.classList.remove('hidden');
          if (itemsCountText) itemsCountText.textContent = `${items.length} unique item${items.length > 1 ? 's' : ''}`;
          
          let listHtml = '';
          items.forEach((item, idx) => {
            const isWish = VexoStore.wishlist.isWishlisted(item.product.id);
            listHtml += `
              <div class="flex gap-4 p-3.5 rounded-xl bg-warm/60 border border-sand group text-ink">
                <img src="${item.product.images[0]}" alt="${item.product.title}" class="w-16 h-16 rounded-lg object-cover border border-sand shrink-0 bg-card">
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-2">
                      <h5 class="text-xs font-bold text-ink line-clamp-1">${item.product.title}</h5>
                      <div class="flex items-center gap-1">
                        <button onclick="VexoStore.cart.moveToWishlist(${idx})" class="text-stone hover:text-ink transition-colors p-1" title="Move to Wishlist">
                          <i data-lucide="heart" class="w-3.5 h-3.5 ${isWish ? 'text-rose-500 fill-rose-500' : ''}"></i>
                        </button>
                        <button onclick="VexoStore.cart.removeItemAndRefresh('${item.product.id}', '${item.color}', '${item.size}')" class="text-stone hover:text-rose-500 transition-colors p-1" title="Remove item">
                          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                    </div>
                    <p class="text-xs font-extrabold text-gold mt-0.5">${VexoStore.formatCurrency(item.product.price)}</p>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center gap-2 bg-card border border-sand rounded-md px-2 py-0.5">
                      <button onclick="VexoStore.cart.updateQtyAndRefresh('${item.product.id}', ${item.quantity - 1}, '${item.color}', '${item.size}')" class="text-stone hover:text-ink font-bold">
                        <i data-lucide="minus" class="w-3 h-3"></i>
                      </button>
                      <span class="text-xs font-bold text-ink px-1">${item.quantity}</span>
                      <button onclick="VexoStore.cart.updateQtyAndRefresh('${item.product.id}', ${item.quantity + 1}, '${item.color}', '${item.size}')" class="text-stone hover:text-ink font-bold">
                        <i data-lucide="plus" class="w-3 h-3"></i>
                      </button>
                    </div>
                    <span class="text-xs font-black text-ink">${VexoStore.formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            `;
          });
          listContainer.innerHTML = listHtml;
          
          const subtotal = this.getSubtotal();
          const shipping = this.getShippingFee();
          const discount = this.getDiscountAmount();
          const tax = Math.round(subtotal * 0.08);
          const total = Math.max(0, subtotal - discount + shipping + tax);
          
          const subtotalElem = document.getElementById('cart-summary-subtotal');
          const taxElem = document.getElementById('cart-summary-tax');
          const shippingElem = document.getElementById('cart-summary-shipping');
          const totalElem = document.getElementById('cart-summary-total');
          
          if (subtotalElem) subtotalElem.textContent = VexoStore.formatCurrency(subtotal);
          if (taxElem) taxElem.textContent = VexoStore.formatCurrency(tax);
          if (shippingElem) shippingElem.textContent = shipping === 0 ? 'FREE' : VexoStore.formatCurrency(shipping);
          if (totalElem) totalElem.textContent = VexoStore.formatCurrency(total);
          
          const discountRow = document.getElementById('cart-summary-discount-row');
          const discountElem = document.getElementById('cart-summary-discount');
          if (discountRow && discountElem) {
            if (discount > 0) {
              discountElem.textContent = `-${VexoStore.formatCurrency(discount)}`;
              discountRow.classList.remove('hidden');
            } else {
              discountRow.classList.add('hidden');
            }
          }
          
          const couponBlock = document.getElementById('cart-coupon-block');
          const couponCode = this.getCouponCode();
          if (couponBlock) {
            if (couponCode) {
              couponBlock.innerHTML = `
                <div class="flex items-center justify-between p-2.5 rounded-lg bg-gold/15 border border-gold/30 text-gold text-xs font-bold">
                  <div class="flex items-center gap-2">
                    <i data-lucide="tag" class="w-4 h-4"></i>
                    <span>Coupon "${couponCode}" Applied</span>
                  </div>
                  <button onclick="VexoStore.cart.removeCouponAndRefresh()" class="text-rose-500 hover:underline">Remove</button>
                </div>
              `;
            } else {
              couponBlock.innerHTML = `
                <form onsubmit="VexoStore.cart.handleApplyCouponForm(event)" class="flex gap-2">
                  <input type="text" id="coupon-code-input" placeholder="Coupon code (e.g. VEXO20)" required class="minimal-input flex-1 py-1 px-3 text-xs rounded-lg">
                  <button type="submit" class="btn-matte btn-secondary py-1.5 px-4 text-[10px] font-bold">Apply</button>
                </form>
              `;
            }
          }
          
          if (window.lucide) window.lucide.createIcons();
        }
      }
      
      const threshold = 15000;
      const subtotal = this.getSubtotal();
      const amountNeeded = Math.max(0, threshold - subtotal);
      const progressPercent = Math.min(100, (subtotal / threshold) * 100);
      
      const progressText = document.getElementById('shipping-progress-text');
      const progressBar = document.getElementById('shipping-progress-bar');
      const progressPercentLabel = document.getElementById('shipping-progress-percent');
      
      if (progressText && progressBar && progressPercentLabel) {
        progressPercentLabel.textContent = `${Math.round(progressPercent)}%`;
        progressBar.style.width = `${progressPercent}%`;
        
        if (amountNeeded === 0) {
          progressText.innerHTML = '<span class="text-emerald-500 font-bold">Free Express Delivery Unlocked</span>';
        } else {
          progressText.innerHTML = `Add <strong class="text-ink">${VexoStore.formatCurrency(amountNeeded)}</strong> for Free Express Shipping`;
        }
      }
      
      if (window.updateCheckoutSummary) window.updateCheckoutSummary();
      if (window.updateAccountUI) window.updateAccountUI();
    },
    moveToWishlist(idx) {
      const items = this.getItems();
      const item = items[idx];
      if (item) {
        VexoStore.wishlist.toggle(item.product);
        this.removeItem(item.product.id, item.color, item.size);
        VexoStore.toasts.add({
          type: 'success',
          title: 'Moved to Wishlist',
          message: `${item.product.title} saved to wishlist.`
        });
      }
    },
    removeItemAndRefresh(productId, color, size) {
      this.removeItem(productId, color, size);
      VexoStore.toasts.add({
        type: 'info',
        title: 'Item Removed',
        message: 'Product removed from bag.'
      });
    },
    updateQtyAndRefresh(productId, qty, color, size) {
      this.updateQuantity(productId, qty, color, size);
    },
    async handleApplyCouponForm(e) {
      e.preventDefault();
      const input = document.getElementById('coupon-code-input');
      const code = input?.value?.trim();
      if (!code) return;
      
      try {
        const subtotal = this.getSubtotal();
        const res = await vexoApi.fetch(`/api/v1/coupons/validate?code=${code}&subtotal=${subtotal}`);
        this.applyCoupon(res.code, res.discountAmount);
        VexoStore.toasts.add({
          type: 'success',
          title: 'Coupon Code Applied',
          message: `Saved ${VexoStore.formatCurrency(res.discountAmount)}`
        });
      } catch (err) {
        VexoStore.toasts.add({
          type: 'error',
          title: 'Coupon Invalid',
          message: err.message || 'Invalid coupon code'
        });
      }
    },
    removeCouponAndRefresh() {
      this.removeCoupon();
      VexoStore.toasts.add({
        type: 'info',
        title: 'Coupon Removed',
        message: 'Discount code removed from order.'
      });
    }
  },
  
  // Wishlist management matching useWishlistStore.ts
  wishlist: {
    getItems() {
      try {
        return JSON.parse(localStorage.getItem('vexo_wishlist') || '[]');
      } catch(e) {
        return [];
      }
    },
    toggle(product) {
      const items = this.getItems();
      const exists = items.some(p => p.id === product.id);
      let updated;
      if (exists) {
        updated = items.filter(p => p.id !== product.id);
        VexoStore.toasts.add({
          type: 'info',
          title: 'Removed from Wishlist',
          message: product.title
        });
      } else {
        updated = [...items, product];
        VexoStore.toasts.add({
          type: 'success',
          title: 'Saved to Wishlist',
          message: product.title
        });
      }
      localStorage.setItem('vexo_wishlist', JSON.stringify(updated));
      this.updateUI();
    },
    isWishlisted(productId) {
      return this.getItems().some(p => p.id === productId);
    },
    updateUI() {
      const count = this.getItems().length;
      const countLabel = document.getElementById('nav-wishlist-count');
      if (countLabel) {
        countLabel.textContent = count;
        if (count > 0) countLabel.classList.remove('hidden');
        else countLabel.classList.add('hidden');
      }
      
      if (window.updateWishlistPage) window.updateWishlistPage();
      this.updateHeartIcons();
    },
    updateHeartIcons() {
      document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
        const id = btn.getAttribute('data-wishlist-id');
        const isWish = this.isWishlisted(id);
        const icon = btn.querySelector('i');
        if (isWish) {
          btn.className = 'absolute top-3 right-3 p-2 rounded-full border transition-all z-10 bg-ink text-ivory border-ink shadow-md';
          if (icon) {
            icon.classList.add('fill-ivory');
          }
        } else {
          btn.className = 'absolute top-3 right-3 p-2 rounded-full border transition-all z-10 bg-card/90 text-stone hover:text-ink border-sand hover:bg-card';
          if (icon) {
            icon.classList.remove('fill-ivory');
          }
        }
      });
      if (window.lucide) window.lucide.createIcons();
    }
  },
  
  // Compare management matching useCompareStore.ts
  compare: {
    items: [],
    toggle(product) {
      const exists = this.items.some(p => p.id === product.id);
      if (exists) {
        this.items = this.items.filter(p => p.id !== product.id);
      } else {
        if (this.items.length >= 4) {
          VexoStore.toasts.add({
            type: 'error',
            title: 'Benchmarking Limit',
            message: 'You can compare a maximum of 4 devices.'
          });
          return;
        }
        this.items.push(product);
        VexoStore.compareDrawer.open();
      }
      this.updateUI();
    },
    isCompared(productId) {
      return this.items.some(p => p.id === productId);
    },
    clear() {
      this.items = [];
      this.updateUI();
    },
    updateUI() {
      const count = this.items.length;
      
      const compareBtn = document.getElementById('nav-compare-btn');
      const compareCount = document.getElementById('nav-compare-count');
      if (compareBtn && compareCount) {
        compareCount.textContent = count;
        if (count > 0) compareBtn.classList.remove('hidden');
        else compareBtn.classList.add('hidden');
      }
      
      if (window.updateComparePage) window.updateComparePage();
      VexoStore.compareDrawer.render();
      
      document.querySelectorAll('[data-compare-id]').forEach(btn => {
        const id = btn.getAttribute('data-compare-id');
        const compared = this.isCompared(id);
        if (compared) {
          btn.className = 'p-2 rounded-lg border transition-colors bg-gold text-white border-gold';
        } else {
          btn.className = 'p-2 rounded-lg border transition-colors bg-card text-stone hover:text-ink border-sand';
        }
      });
    }
  },
  
  // Command palette search matching CommandPalette.tsx
  commandPalette: {
    isOpen: false,
    open() {
      this.isOpen = true;
      const overlay = document.getElementById('command-palette-overlay');
      const box = document.getElementById('command-palette-box');
      const backdrop = document.getElementById('command-palette-backdrop');
      if (overlay && box && backdrop) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
          backdrop.classList.replace('opacity-0', 'opacity-100');
          box.classList.replace('opacity-0', 'opacity-100');
          box.classList.replace('scale-95', 'scale-100');
          box.classList.replace('translate-y-[-10px]', 'translate-y-0');
        }, 10);
        
        const input = document.getElementById('command-search-input');
        if (input) input.focus();
        this.render();
      }
    },
    close() {
      this.isOpen = false;
      const overlay = document.getElementById('command-palette-overlay');
      const box = document.getElementById('command-palette-box');
      const backdrop = document.getElementById('command-palette-backdrop');
      if (overlay && box && backdrop) {
        backdrop.classList.replace('opacity-100', 'opacity-0');
        box.classList.replace('opacity-100', 'opacity-0');
        box.classList.replace('scale-100', 'scale-95');
        box.classList.replace('translate-y-0', 'translate-y-[-10px]');
        setTimeout(() => {
          overlay.classList.add('hidden');
        }, 300);
      }
    },
    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    },
    query: '',
    results: [],
    loading: false,
    selectedIndex: 0,
    async search(q) {
      this.query = q;
      this.selectedIndex = 0;
      if (!q.trim()) {
        this.results = [];
        this.render();
        return;
      }
      this.loading = true;
      this.render();
      
      try {
        const res = await vexoApi.fetch(`/api/v1/products?search=${encodeURIComponent(q)}`);
        this.results = res.products || [];
      } catch(e) {
        console.error(e);
      } finally {
        this.loading = false;
        this.render();
      }
    },
    getRecentSearches() {
      try {
        return JSON.parse(localStorage.getItem('vexo_recent_searches') || '[]');
      } catch(e) {
        return [];
      }
    },
    saveRecentSearch(searchQuery) {
      const searches = this.getRecentSearches();
      const filtered = searches.filter(s => s !== searchQuery);
      const updated = [searchQuery, ...filtered].slice(0, 5);
      localStorage.setItem('vexo_recent_searches', JSON.stringify(updated));
    },
    clearRecentSearches() {
      localStorage.removeItem('vexo_recent_searches');
      this.render();
    },
    render() {
      const resultsContainer = document.getElementById('command-palette-results');
      if (!resultsContainer) return;
      
      let html = '';
      
      if (this.loading) {
        html = `
          <div class="py-12 text-center text-xs text-stone font-semibold">
            <div class="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Searching VEXO hardware index...
          </div>
        `;
      } else if (this.query.trim()) {
        if (this.results.length === 0) {
          html = `
            <div class="py-12 text-center text-xs text-stone font-semibold">
              No hardware devices match "${this.query}"
            </div>
          `;
        } else {
          html = `<div class="p-2 space-y-1">`;
          this.results.forEach((prod, idx) => {
            const active = idx === this.selectedIndex;
            html += `
              <div onclick="VexoStore.commandPalette.selectProduct(${idx})" class="flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-colors ${active ? 'bg-warm text-ink border border-sand' : 'text-stone hover:text-ink hover:bg-warm/50 border border-transparent'}" style="margin: 2px 0;">
                <div class="flex items-center gap-3">
                  <img src="${prod.images[0]}" alt="" class="w-10 h-10 rounded-lg object-cover border border-sand shrink-0 bg-card">
                  <div>
                    <h5 class="font-bold text-ink line-clamp-1">${prod.title}</h5>
                    <p class="text-[10px] text-stone font-semibold">${prod.subtitle || ''}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black text-gold">${VexoStore.formatCurrency(prod.price)}</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-gold shrink-0"></i>
                </div>
              </div>
            `;
          });
          html += `</div>`;
        }
      } else {
        const recents = this.getRecentSearches();
        html = `<div class="p-4 space-y-6">`;
        
        if (recents.length > 0) {
          html += `
            <div>
              <div class="flex items-center justify-between text-[10px] font-bold text-stone uppercase tracking-widest mb-2">
                <span>Recent Searches</span>
                <button onclick="VexoStore.commandPalette.clearRecentSearches()" class="hover:text-ink transition-colors flex items-center gap-1">
                  <i data-lucide="trash-2" class="w-3 h-3"></i> Clear
                </button>
              </div>
              <div class="space-y-1">
          `;
          recents.forEach(s => {
            html += `
              <div onclick="document.getElementById('command-search-input').value='${s}'; VexoStore.commandPalette.search('${s}');" class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-warm/50 text-xs text-stone hover:text-ink cursor-pointer font-semibold">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                <span>${s}</span>
              </div>
            `;
          });
          html += `
              </div>
            </div>
          `;
        }
        
        html += `
          <div>
            <div class="text-[10px] font-bold text-stone uppercase tracking-widest mb-2">Quick Navigation</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="/shop" class="flex items-center gap-3 p-3 rounded-xl bg-warm border border-sand hover:border-ink transition-all text-xs font-bold text-ink">
                <i data-lucide="shopping-bag" class="w-4 h-4 text-ink"></i>
                <span>Explore Full Index</span>
              </a>
              <a href="/compare" class="flex items-center gap-3 p-3 rounded-xl bg-warm border border-sand hover:border-ink transition-all text-xs font-bold text-ink">
                <i data-lucide="sliders-horizontal" class="w-4 h-4 text-gold"></i>
                <span>Compare Hardware Specs</span>
              </a>
              <a href="/account" class="flex items-center gap-3 p-3 rounded-xl bg-warm border border-sand hover:border-ink transition-all text-xs font-bold text-ink">
                <i data-lucide="user" class="w-4 h-4 text-stone"></i>
                <span>User Account & Orders</span>
              </a>
              <a href="/admin" class="flex items-center gap-3 p-3 rounded-xl bg-warm border border-sand hover:border-ink transition-all text-xs font-bold text-ink">
                <i data-lucide="shield-check" class="w-4 h-4 text-titanium"></i>
                <span>Admin Command Center</span>
              </a>
            </div>
          </div>
        `;
        html += `</div>`;
      }
      
      resultsContainer.innerHTML = html;
      if (window.lucide) window.lucide.createIcons();
    },
    selectProduct(idx) {
      const prod = this.results[idx];
      if (prod) {
        this.saveRecentSearch(this.query || prod.title);
        this.close();
        window.location.href = `/product/${prod.slug}`;
      }
    },
    handleKeyDown(e) {
      if (this.results.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
        this.render();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
        this.render();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.selectProduct(this.selectedIndex);
      }
    }
  },
  
  // Cart Drawer show/hide
  cartDrawer: {
    isOpen: false,
    open() {
      this.isOpen = true;
      const overlay = document.getElementById('cart-drawer-overlay');
      const panel = document.getElementById('cart-drawer-panel');
      const backdrop = document.getElementById('cart-drawer-backdrop');
      if (overlay && panel && backdrop) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
          backdrop.classList.replace('opacity-0', 'opacity-100');
          panel.classList.replace('translate-x-full', 'translate-x-0');
        }, 10);
        VexoStore.cart.updateUI();
      }
    },
    close() {
      this.isOpen = false;
      const overlay = document.getElementById('cart-drawer-overlay');
      const panel = document.getElementById('cart-drawer-panel');
      const backdrop = document.getElementById('cart-drawer-backdrop');
      if (overlay && panel && backdrop) {
        backdrop.classList.replace('opacity-100', 'opacity-0');
        panel.classList.replace('translate-x-0', 'translate-x-full');
        setTimeout(() => {
          overlay.classList.add('hidden');
        }, 300);
      }
    },
    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    }
  },
  
  // Compare Drawer benchmark modal
  compareDrawer: {
    open() {
      const modal = document.getElementById('compare-drawer-modal');
      const box = document.getElementById('compare-drawer-box');
      const backdrop = document.getElementById('compare-drawer-backdrop');
      if (modal && box && backdrop) {
        modal.classList.remove('hidden');
        setTimeout(() => {
          backdrop.classList.replace('opacity-0', 'opacity-100');
          box.classList.replace('opacity-0', 'opacity-100');
          box.classList.replace('scale-95', 'scale-100');
        }, 10);
        this.render();
      }
    },
    close() {
      const modal = document.getElementById('compare-drawer-modal');
      const box = document.getElementById('compare-drawer-box');
      const backdrop = document.getElementById('compare-drawer-backdrop');
      if (modal && box && backdrop) {
        backdrop.classList.replace('opacity-100', 'opacity-0');
        box.classList.replace('opacity-100', 'opacity-0');
        box.classList.replace('scale-100', 'scale-95');
        setTimeout(() => {
          modal.classList.add('hidden');
        }, 300);
      }
    },
    render() {
      const container = document.getElementById('compare-drawer-items');
      const benchmarkingText = document.getElementById('compare-benchmarking-text');
      if (!container) return;
      
      const items = VexoStore.compare.items;
      if (benchmarkingText) {
        benchmarkingText.innerHTML = `Benchmarking <strong class="text-ink">${items.length}</strong> of 4 hardware devices`;
      }
      
      let html = '';
      items.forEach(prod => {
        html += `
          <div class="p-4 rounded-xl bg-warm border border-sand flex flex-col justify-between">
            <div>
              <div class="relative aspect-square rounded-lg overflow-hidden bg-white border border-sand mb-3">
                <img src="${prod.images[0]}" alt="${prod.title}" class="w-full h-full object-cover">
                <button onclick='VexoStore.compare.toggle(${JSON.stringify(prod).replace(/'/g, "&#39;")})' class="absolute top-2 right-2 p-1 rounded-full bg-ink/70 text-white hover:bg-ink">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
              </div>
              <h4 class="text-xs font-bold text-ink line-clamp-1">${prod.title}</h4>
              <p class="text-xs font-black text-gold mt-0.5">${VexoStore.formatCurrency(prod.price)}</p>
              
              <div class="mt-4 space-y-2 border-t border-sand pt-3 text-[11px]">
                <div>
                  <span class="text-stone block font-bold uppercase text-[9px]">Category</span>
                  <span class="font-semibold text-ink">${prod.category?.name || 'Hardware'}</span>
                </div>
                <div>
                  <span class="text-stone block font-bold uppercase text-[9px]">Rating</span>
                  <span class="font-bold text-ink">★ ${prod.rating}</span>
                </div>
                <div>
                  <span class="text-stone block font-bold uppercase text-[9px]">Stock</span>
                  <span class="font-semibold text-emerald-700">${prod.stock} units</span>
                </div>
              </div>
            </div>
            
            <button onclick="VexoStore.compareDrawer.close(); window.location.href='/product/${prod.slug}';" class="btn-matte btn-secondary py-1.5 px-3 text-[10px] font-bold w-full mt-4">
              View Details
            </button>
          </div>
        `;
      });
      container.innerHTML = html;
      if (window.lucide) window.lucide.createIcons();
    }
  },

  // Quick View Modal matching QuickViewModal.tsx
  quickView: {
    isOpen: false,
    product: null,
    selectedImage: 0,
    quantity: 1,
    open(product) {
      this.product = product;
      this.selectedImage = 0;
      this.quantity = 1;
      this.isOpen = true;
      
      const overlay = document.getElementById('quickview-modal-overlay');
      const box = document.getElementById('quickview-modal-box');
      const backdrop = document.getElementById('quickview-modal-backdrop');
      if (overlay && box && backdrop) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
          backdrop.classList.replace('opacity-0', 'opacity-100');
          box.classList.replace('opacity-0', 'opacity-100');
          box.classList.replace('scale-95', 'scale-100');
        }, 10);
        this.render();
      }
    },
    close() {
      this.isOpen = false;
      const overlay = document.getElementById('quickview-modal-overlay');
      const box = document.getElementById('quickview-modal-box');
      const backdrop = document.getElementById('quickview-modal-backdrop');
      if (overlay && box && backdrop) {
        backdrop.classList.replace('opacity-100', 'opacity-0');
        box.classList.replace('opacity-100', 'opacity-0');
        box.classList.replace('scale-100', 'scale-95');
        setTimeout(() => {
          overlay.classList.add('hidden');
        }, 300);
      }
    },
    selectImage(idx) {
      this.selectedImage = idx;
      this.render();
    },
    updateQty(qty) {
      this.quantity = Math.max(1, qty);
      const qtyVal = document.getElementById('quickview-qty-val');
      if (qtyVal) qtyVal.textContent = this.quantity;
    },
    addToCart() {
      if (this.product) {
        VexoStore.cart.addItem(this.product, this.quantity);
        this.close();
      }
    },
    buyNow() {
      if (this.product) {
        VexoStore.cart.addItem(this.product, this.quantity);
        this.close();
        window.location.href = '/checkout';
      }
    },
    toggleWishlist() {
      if (this.product) {
        VexoStore.wishlist.toggle(this.product);
        this.render();
      }
    },
    render() {
      const box = document.getElementById('quickview-modal-box');
      if (!box || !this.product) return;
      
      const isWish = VexoStore.wishlist.isWishlisted(this.product.id);
      const mainImg = this.product.images[this.selectedImage] || this.product.images[0];
      
      let thumbsHtml = '';
      if (this.product.images.length > 1) {
        thumbsHtml = `<div class="flex gap-2 overflow-x-auto pb-1">`;
        this.product.images.forEach((img, idx) => {
          const active = idx === this.selectedImage;
          thumbsHtml += `
            <button onclick="VexoStore.quickView.selectImage(${idx})" class="w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${active ? 'border-ink' : 'border-sand opacity-60 hover:opacity-100'}">
              <img src="${img}" alt="" class="w-full h-full object-cover">
            </button>
          `;
        });
        thumbsHtml += `</div>`;
      }
      
      let starsHtml = '';
      const floorRating = Math.floor(this.product.rating);
      for (let i = 0; i < 5; i++) {
        starsHtml += `
          <i data-lucide="star" class="w-3.5 h-3.5 ${i < floorRating ? 'fill-gold text-gold' : 'text-sand'}"></i>
        `;
      }
      
      box.innerHTML = `
        <button onclick="VexoStore.quickView.close()" class="absolute top-4 right-4 p-1.5 rounded-full text-stone hover:text-ink hover:bg-warm transition-colors z-10">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-ink">
          <!-- Left Gallery -->
          <div class="md:col-span-6 flex flex-col gap-3">
            <div class="relative aspect-square rounded-xl overflow-hidden bg-warm border border-sand">
              <img src="${mainImg}" alt="${this.product.title}" class="w-full h-full object-cover">
            </div>
            ${thumbsHtml}
          </div>
          <!-- Right Info -->
          <div class="md:col-span-6 flex flex-col justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[9px] font-extrabold text-gold uppercase tracking-wider">${this.product.category?.name || 'Hardware'}</span>
                ${this.product.stock > 0 ? `
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider">IN STOCK (${this.product.stock})</span>
                ` : `
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[9px] font-extrabold text-rose-500 uppercase tracking-wider">OUT OF STOCK</span>
                `}
              </div>
              <h2 class="text-2xl font-black text-ink tracking-tight font-serif">${this.product.title}</h2>
              <p class="text-xs text-stone mt-1 font-semibold">${this.product.subtitle || ''}</p>
              
              <!-- Rating -->
              <div class="flex items-center gap-2 mt-3">
                <div class="flex items-center text-gold gap-0.5">
                  ${starsHtml}
                </div>
                <span class="text-xs font-bold text-ink">${this.product.rating}</span>
                <span class="text-xs text-stone">(${this.product.reviewsCount} verified reviews)</span>
              </div>
              
              <!-- Price -->
              <div class="flex items-baseline gap-3 my-4">
                <span class="text-3xl font-black text-ink">${VexoStore.formatCurrency(this.product.price)}</span>
                ${this.product.compareAtPrice ? `
                  <span class="text-sm text-stone line-through font-semibold">${VexoStore.formatCurrency(this.product.compareAtPrice)}</span>
                ` : ''}
              </div>
              
              <p class="text-xs text-stone leading-relaxed line-clamp-3 mb-4">${this.product.description || ''}</p>
              
              <!-- Quantity Selector -->
              <div class="flex items-center gap-3 mb-6">
                <span class="text-xs font-bold text-stone uppercase tracking-wider">Quantity</span>
                <div class="flex items-center rounded-lg border border-sand bg-warm p-1">
                  <button onclick="VexoStore.quickView.updateQty(VexoStore.quickView.quantity - 1)" class="w-7 h-7 flex items-center justify-center font-bold text-ink hover:bg-card rounded">-</button>
                  <span id="quickview-qty-val" class="w-8 text-center text-xs font-bold text-ink">${this.quantity}</span>
                  <button onclick="VexoStore.quickView.updateQty(VexoStore.quickView.quantity + 1)" class="w-7 h-7 flex items-center justify-center font-bold text-ink hover:bg-card rounded">+</button>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="space-y-3 pt-4 border-t border-sand">
              <div class="flex gap-3">
                <button onclick="VexoStore.quickView.addToCart()" class="btn-matte btn-primary flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                  <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add to Bag
                </button>
                <button onclick="VexoStore.quickView.buyNow()" class="btn-matte btn-accent flex-1 py-3 text-xs font-black uppercase tracking-wider cursor-pointer">Buy Now</button>
                <button onclick="VexoStore.quickView.toggleWishlist()" class="p-3.5 rounded-lg border transition-all ${isWish ? 'bg-ink text-white border-ink' : 'bg-card text-stone hover:text-ink border-sand'}" title="${isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                  <i data-lucide="heart" class="w-4 h-4 ${isWish ? 'fill-white text-white' : ''}"></i>
                </button>
              </div>
              <button onclick="VexoStore.quickView.close(); window.location.href='/product/${this.product.slug}';" class="w-full text-xs font-bold text-stone hover:text-ink flex items-center justify-center gap-1 transition-colors py-1 uppercase tracking-wider">
                View Full Specifications <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-gold"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  },

  getBadgeLabel(product) {
    const badges = [
      'JUST ARRIVED',
      'BEST SELLER',
      'LIMITED',
      "EDITOR'S PICK",
      'PREMIUM',
      'HOT',
      'TRENDING',
      'EXCLUSIVE',
    ];
    if (product.price > 120000) return 'EXCLUSIVE';
    if (product.isNew) return 'JUST ARRIVED';
    if (product.rating >= 4.9) return 'BEST SELLER';
    if (product.reviewsCount > 150) return "EDITOR'S PICK";
    if (product.stock < 5) return 'LIMITED';
    const charCodeSum = String(product.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return badges[charCodeSum % badges.length];
  },
  
  renderProductCardHTML(product) {
    const isWish = this.wishlist.isWishlisted(product.id);
    const compared = this.compare.isCompared(product.id);
    const badgeLabel = this.getBadgeLabel(product);
    
    return `
      <div 
        data-product-card-id="${product.id}"
        onmousemove="VexoStore.handleProductCardMouseMove(event, this)"
        onmouseleave="VexoStore.handleProductCardMouseLeave(this)"
        class="group relative studio-card rounded-xl p-4 flex flex-col justify-between border border-sand bg-card hover:border-gold/40 hover:shadow-modal transition-all duration-300 overflow-hidden text-ink theme-transition scroll-reveal"
      >
        <div class="relative aspect-square rounded-lg overflow-hidden bg-warm mb-4 border border-sand/60">
          <a href="/product/${product.slug}">
            <img 
              src="${product.images[0]}" 
              alt="${product.title}" 
              class="w-full h-full object-cover transition-transform duration-300 product-card-image"
              loading="lazy"
              decoding="async"
              style="transform: translate3d(0px, 0px, 0) scale(1);"
            >
          </a>
          
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[9px] font-extrabold text-gold uppercase tracking-wider">${badgeLabel}</span>
          </div>
          
          <button 
            onclick="VexoStore.handleProductCardWishlist(event, '${product.id}')"
            class="absolute top-3 right-3 p-2 rounded-full border transition-all z-10 ${isWish ? 'bg-ink text-ivory border-ink shadow-md' : 'bg-card/90 text-stone hover:text-ink border-sand hover:bg-card'}"
            title="${isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}"
          >
            <i data-lucide="heart" class="w-3.5 h-3.5 ${isWish ? 'fill-ivory' : ''}"></i>
          </button>
          
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button 
              onclick="VexoStore.handleProductCardQuickView(event, '${product.id}')"
              class="flex-1 py-2 px-3 rounded-lg bg-ink hover:bg-titanium text-ivory text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-subtle cursor-pointer"
            >
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Quick View
            </button>
            
            <button 
              onclick="VexoStore.handleProductCardCompare(event, '${product.id}')"
              class="p-2 rounded-lg border transition-colors cursor-pointer ${compared ? 'bg-gold text-white border-gold' : 'bg-card text-stone hover:text-ink border-sand'}"
              title="${compared ? 'In Compare' : 'Add to Compare'}"
            >
              <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
        
        <div class="flex flex-col flex-1 justify-between gap-3">
          <div>
            <div class="flex items-center justify-between text-[10px] font-bold text-stone uppercase tracking-widest mb-1">
              <span>${product.category?.name || 'Hardware'}</span>
              <div class="flex items-center gap-1 text-ink font-extrabold">
                <i data-lucide="star" class="w-3 h-3 fill-gold text-gold"></i>
                <span>${product.rating}</span>
              </div>
            </div>
            
            <a href="/product/${product.slug}">
              <h3 class="text-sm font-bold text-ink group-hover:text-gold transition-colors line-clamp-1">${product.title}</h3>
            </a>
            <p class="text-[11px] text-stone line-clamp-1 mt-0.5 font-semibold">${product.subtitle || ''}</p>
          </div>
          
          <div class="flex items-center justify-between pt-3 border-t border-sand mt-auto">
            <div class="flex flex-col">
              <span class="text-sm font-black text-ink">${this.formatCurrency(product.price)}</span>
              ${product.compareAtPrice ? `<span class="text-[10px] text-stone line-through font-semibold">${this.formatCurrency(product.compareAtPrice)}</span>` : ''}
            </div>
            
            <button 
              onclick="VexoStore.handleProductCardAddToCart(event, '${product.id}')"
              class="p-2.5 rounded-lg bg-warm hover:bg-ink hover:text-ivory border border-sand text-ink transition-all shadow-subtle flex items-center justify-center cursor-pointer"
              title="Add to Bag"
            >
              <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  // Toast notifications matching ToastContainer.tsx
  toasts: {
    list: [],
    counter: 0,
    add({ type = 'success', title, message = '', duration = 3000 }) {
      const id = ++this.counter;
      const toast = { id, type, title, message, duration };
      this.list.push(toast);
      this.render();
      
      setTimeout(() => {
        this.remove(id);
      }, duration);
    },
    remove(id) {
      const elem = document.getElementById(`toast-item-${id}`);
      if (elem) {
        elem.classList.add('opacity-0', 'translate-y-[-10px]', 'scale-90');
        setTimeout(() => {
          this.list = this.list.filter(t => t.id !== id);
          this.render();
        }, 300);
      }
    },
    render() {
      const container = document.getElementById('toast-notification-container');
      if (!container) return;
      
      const icons = {
        success: '<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 shrink-0"></i>',
        error: '<i data-lucide="alert-circle" class="w-4 h-4 text-rose-500 shrink-0"></i>',
        info: '<i data-lucide="info" class="w-4 h-4 text-amber-500 shrink-0"></i>'
      };
      
      const barColors = {
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        info: 'bg-amber-500'
      };
      
      let html = '';
      this.list.forEach(toast => {
        const existing = document.getElementById(`toast-item-${toast.id}`);
        if (existing) {
          html += existing.outerHTML;
        } else {
          html += `
            <div id="toast-item-${toast.id}" class="pointer-events-auto relative overflow-hidden flex items-center justify-between gap-3 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-sand shadow-modal text-ink theme-transition transition-all duration-300 transform translate-y-6 opacity-0 scale-95">
              <div class="flex items-center gap-3">
                ${icons[toast.type]}
                <div>
                  <h4 class="text-xs font-bold text-ink tracking-wide">${toast.title}</h4>
                  ${toast.message ? `<p class="text-[11px] text-stone mt-0.5 font-semibold">${toast.message}</p>` : ''}
                </div>
              </div>
              <button onclick="VexoStore.toasts.remove(${toast.id})" class="text-stone hover:text-ink transition-colors p-1 rounded-full hover:bg-warm shrink-0 focus:outline-none focus:ring-1 focus:ring-gold" aria-label="Close notification">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
              </button>
              
              <div class="absolute bottom-0 left-0 h-[2px] ${barColors[toast.type]} transition-all linear" style="width: 100%; transition-duration: ${toast.duration}ms;"></div>
            </div>
          `;
          
          setTimeout(() => {
            const newElem = document.getElementById(`toast-item-${toast.id}`);
            if (newElem) {
              newElem.classList.replace('opacity-0', 'opacity-100');
              newElem.classList.replace('translate-y-6', 'translate-y-0');
              newElem.classList.replace('scale-95', 'scale-100');
              
              setTimeout(() => {
                const bar = newElem.querySelector('.absolute.bottom-0.left-0');
                if (bar) bar.style.width = '0%';
              }, 50);
            }
          }, 10);
        }
      });
      
      container.innerHTML = html;
      if (window.lucide) window.lucide.createIcons();
    }
  },
  
  // Auth state management
  auth: {
    getToken() {
      return localStorage.getItem('vexo_token');
    },
    getUser() {
      try {
        return JSON.parse(localStorage.getItem('vexo_user'));
      } catch(e) {
        return null;
      }
    },
    set(user, token) {
      localStorage.setItem('vexo_token', token);
      localStorage.setItem('vexo_user', JSON.stringify(user));
      this.updateUI();
    },
    clear() {
      localStorage.removeItem('vexo_token');
      localStorage.removeItem('vexo_user');
      this.updateUI();
    },
    isAuthenticated() {
      return !!this.getToken();
    },
    isAdmin() {
      const u = this.getUser();
      return u && u.role === 'ADMIN';
    },
    updateUI() {
      const user = this.getUser();
      const isAuth = this.isAuthenticated();
      
      const authContainer = document.getElementById('user-nav-auth');
      const dropdownMenu = document.getElementById('user-dropdown-menu');
      const mobileNavAdminLink = document.getElementById('mobile-nav-admin-link');
      
      if (mobileNavAdminLink) {
        if (this.isAdmin()) mobileNavAdminLink.classList.remove('hidden');
        else mobileNavAdminLink.classList.add('hidden');
      }
      
      if (authContainer) {
        if (isAuth && user) {
          authContainer.innerHTML = `
            <button onclick="VexoStore.auth.toggleDropdown()" class="flex items-center gap-2 p-0.5 rounded-full border border-sand hover:border-ink transition-all cursor-pointer">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover">
            </button>
          `;
          
          if (dropdownMenu) {
            dropdownMenu.innerHTML = `
              <div class="px-3 py-2 border-b border-sand mb-1">
                <p class="text-xs font-bold text-ink leading-tight">${user.name}</p>
                <p class="text-[11px] text-stone truncate">${user.email}</p>
                ${user.role === 'ADMIN' ? `
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[9px] font-extrabold text-gold uppercase tracking-wider mt-1">
                    Admin Privileges
                  </div>
                ` : ''}
              </div>

              <a href="/account" class="flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone hover:text-ink hover:bg-warm rounded-lg transition-colors">
                <i data-lucide="user" class="w-3.5 h-3.5 text-stone"></i>
                Account Settings
              </a>

              ${user.role === 'ADMIN' ? `
                <a href="/admin" class="flex items-center gap-2 px-3 py-2 text-xs font-bold text-ink hover:bg-warm rounded-lg transition-colors">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5 text-gold"></i>
                  Admin Command Center
                </a>
              ` : ''}

              <button onclick="VexoStore.auth.logout()" class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-danger hover:bg-danger/10 rounded-lg transition-colors mt-1">
                <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                Sign Out
              </button>
            `;
          }
        } else {
          authContainer.innerHTML = `
            <a href="/auth" class="p-2 rounded-full text-stone hover:text-ink hover:bg-warm transition-colors block">
              <i data-lucide="user" class="w-4 h-4 text-ink"></i>
            </a>
          `;
        }
      }
      
      const adminElements = document.querySelectorAll('.admin-only');
      adminElements.forEach(el => {
        if (this.isAdmin()) el.classList.remove('hidden');
        else el.classList.add('hidden');
      });
      
      if (window.lucide) window.lucide.createIcons();
    },
    dropdownOpen: false,
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
      const menu = document.getElementById('user-dropdown-menu');
      if (menu) {
        if (this.dropdownOpen) {
          menu.classList.remove('hidden');
          setTimeout(() => {
            menu.classList.replace('opacity-0', 'opacity-100');
            menu.classList.replace('scale-95', 'scale-100');
          }, 10);
        } else {
          menu.classList.replace('opacity-100', 'opacity-0');
          menu.classList.replace('scale-100', 'scale-95');
          setTimeout(() => {
            menu.classList.add('hidden');
          }, 200);
        }
      }
    },
    logout() {
      this.clear();
      VexoStore.toasts.add({
        type: 'info',
        title: 'Signed Out',
        message: 'You have signed out of your VEXO Session.'
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  },
  
  // Format currency helper
  formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }
};

// Global REST API Fetch client
const vexoApi = {
  async fetch(url, options = {}) {
    options.headers = options.headers || {};
    const token = VexoStore.auth.getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || data.message || 'API request failed');
    }
    return data;
  }
};

// Global action bridges for HTML nodes
window.VexoStore = VexoStore;
window.vexoApi = vexoApi;
window.toggleTheme = () => VexoStore.theme.toggle();
window.toggleCart = () => VexoStore.cartDrawer.toggle();
window.toggleMobileMenu = () => {
  const drawer = document.getElementById('mobile-menu-drawer');
  const iconOpen = document.getElementById('mobile-menu-icon-open');
  const iconClose = document.getElementById('mobile-menu-icon-close');
  if (drawer && iconOpen && iconClose) {
    const isClosed = drawer.classList.contains('max-h-0');
    if (isClosed) {
      drawer.classList.remove('max-h-0', 'opacity-0');
      drawer.classList.add('max-h-96', 'opacity-100');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
    } else {
      drawer.classList.remove('max-h-96', 'opacity-100');
      drawer.classList.add('max-h-0', 'opacity-0');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    }
  }
};

window.openCommandPalette = () => VexoStore.commandPalette.open();
window.closeCommandPalette = () => VexoStore.commandPalette.close();

window.scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

window.proceedToCheckout = () => {
  VexoStore.cartDrawer.close();
  window.location.href = '/checkout';
};

window.clearCart = () => {
  VexoStore.cart.clear();
  VexoStore.toasts.add({
    type: 'info',
    title: 'Cart Cleared',
    message: 'All items removed from cart.'
  });
};

// Initialize app behaviors on load
document.addEventListener('DOMContentLoaded', () => {
  VexoStore.theme.apply();
  VexoStore.auth.updateUI();
  VexoStore.cart.updateUI();
  VexoStore.wishlist.updateUI();
  
  // Highlight active navigation tab
  const pathname = window.location.pathname;
  if (pathname === '/') {
    const activeBg = document.querySelector('#nav-link-index .nav-active-bg');
    const textSpan = document.querySelector('#nav-link-index');
    if (activeBg) activeBg.classList.remove('hidden');
    if (textSpan) textSpan.classList.replace('text-stone', 'text-ink');
  } else if (pathname === '/shop') {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('view') === 'categories') {
      const activeBg = document.querySelector('#nav-link-categories .nav-active-bg');
      const textSpan = document.querySelector('#nav-link-categories');
      if (activeBg) activeBg.classList.remove('hidden');
      if (textSpan) textSpan.classList.replace('text-stone', 'text-ink');
    } else {
      const activeBg = document.querySelector('#nav-link-catalog .nav-active-bg');
      const textSpan = document.querySelector('#nav-link-catalog');
      if (activeBg) activeBg.classList.remove('hidden');
      if (textSpan) textSpan.classList.replace('text-stone', 'text-ink');
    }
  }
  
  // Close dropdown menu on click outside
  document.addEventListener('click', (e) => {
    const btn = document.querySelector('[onclick="VexoStore.auth.toggleDropdown()"]');
    const menu = document.getElementById('user-dropdown-menu');
    if (menu && !menu.classList.contains('hidden') && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
      VexoStore.auth.toggleDropdown();
    }
  });
});

// Throttled Scroll Management
let scrollHeightCache = 0;
let headerScrolled = false;
let backBtnVisible = false;
let isScrollThrottled = false;

function updateScrollStats() {
  if (!scrollHeightCache) {
    scrollHeightCache = document.documentElement.scrollHeight;
  }
  const currentScrollY = window.scrollY;
  const totalHeight = scrollHeightCache - window.innerHeight;
  const progress = totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0;
  
  const bar = document.getElementById('scroll-progress');
  if (bar) bar.style.width = `${progress}%`;
  
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    const shouldBeVisible = currentScrollY > 400;
    if (shouldBeVisible !== backBtnVisible) {
      backBtnVisible = shouldBeVisible;
      if (shouldBeVisible) {
        backBtn.classList.remove('scale-0', 'translate-y-4', 'opacity-0');
        backBtn.classList.add('scale-100', 'translate-y-0', 'opacity-100');
      } else {
        backBtn.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
        backBtn.classList.add('scale-0', 'translate-y-4', 'opacity-0');
      }
    }
  }
  
  const header = document.getElementById('main-header');
  if (header) {
    const shouldBeScrolled = currentScrollY > 20;
    if (shouldBeScrolled !== headerScrolled) {
      headerScrolled = shouldBeScrolled;
      if (shouldBeScrolled) {
        header.className = 'fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-ivory/95 backdrop-blur-md border-b border-sand py-3 shadow-subtle';
      } else {
        header.className = 'fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-transparent py-6';
      }
    }
  }
  
  isScrollThrottled = false;
}

window.addEventListener('scroll', () => {
  if (!isScrollThrottled) {
    isScrollThrottled = true;
    requestAnimationFrame(updateScrollStats);
  }
}, { passive: true });

window.addEventListener('resize', () => {
  scrollHeightCache = 0; // invalidate cache
});

// Action bridges for product card mouse movement & events
window.VexoStore.handleProductCardMouseMove = (e, el) => {
  if (!el._rect) {
    el._rect = el.getBoundingClientRect();
  }
  const rect = el._rect;
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  const img = el.querySelector('.product-card-image');
  if (img) {
    img.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0) scale(1.04)`;
  }
};
window.VexoStore.handleProductCardMouseLeave = (el) => {
  el._rect = null;
  const img = el.querySelector('.product-card-image');
  if (img) {
    img.style.transform = `translate3d(0px, 0px, 0) scale(1)`;
  }
};

// Intersection Observer for Scroll Reveals
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.05
    };
    
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }
});
const resolveProduct = (item) => {
  if (typeof item === 'string') {
    return window.VexoStore.productsRegistry[item] || null;
  }
  return item;
};
window.VexoStore.handleProductCardWishlist = (e, productOrId) => {
  e.preventDefault();
  e.stopPropagation();
  const prod = resolveProduct(productOrId);
  if (prod) window.VexoStore.wishlist.toggle(prod);
};
window.VexoStore.handleProductCardCompare = (e, productOrId) => {
  e.preventDefault();
  e.stopPropagation();
  const prod = resolveProduct(productOrId);
  if (prod) window.VexoStore.compare.toggle(prod);
};
window.VexoStore.handleProductCardQuickView = (e, productOrId) => {
  e.preventDefault();
  e.stopPropagation();
  const prod = resolveProduct(productOrId);
  if (prod) window.VexoStore.quickView.open(prod);
};
window.VexoStore.handleProductCardAddToCart = (e, productOrId) => {
  e.preventDefault();
  e.stopPropagation();
  const prod = resolveProduct(productOrId);
  if (prod) window.VexoStore.cart.addItem(prod);
};
