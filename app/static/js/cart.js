// VEXO Systems — Backward Compatibility Cart Bridge

window.vexoCart = {
  getCart() {
    return VexoStore.cart.getItems();
  },
  addToCart(product, qty = 1, color = '', size = '') {
    VexoStore.cart.addItem(product, qty, color, size);
  },
  removeFromCart(productId, color = '', size = '') {
    VexoStore.cart.removeItem(productId, color, size);
    VexoStore.cart.updateUI();
  },
  updateQuantity(productId, delta, color = '', size = '') {
    const items = VexoStore.cart.getItems();
    const item = items.find(it => it.product.id === productId && it.color === color && it.size === size);
    if (item) {
      VexoStore.cart.updateQuantity(productId, item.quantity + delta, color, size);
    }
  },
  clearCart() {
    VexoStore.cart.clear();
  },
  getSubtotal() {
    return VexoStore.cart.getSubtotal();
  },
  getShippingFee() {
    return VexoStore.cart.getShippingFee();
  },
  getCartCount() {
    return VexoStore.cart.getItemCount();
  },
  
  getWishlist() {
    return VexoStore.wishlist.getItems();
  },
  toggleWishlist(product) {
    VexoStore.wishlist.toggle(product);
  },
  isInWishlist(productId) {
    return VexoStore.wishlist.isWishlisted(productId);
  },
  
  getCompare() {
    return VexoStore.compare.items;
  },
  toggleCompare(product) {
    VexoStore.compare.toggle(product);
  },
  
  updateBadges() {
    VexoStore.cart.updateUI();
    VexoStore.wishlist.updateUI();
    VexoStore.compare.updateUI();
  }
};
