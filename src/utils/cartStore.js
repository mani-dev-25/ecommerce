const CART_KEY = 'shop_cart';
const WISHLIST_KEY = 'shop_wishlist';

export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Dispatch a storage event so components can update in real-time
  window.dispatchEvent(new Event('cart-updated'));
};

export const addToCartStore = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  const stockLimit = product.stock !== undefined ? product.stock : 999;

  if (existing) {
    if ((existing.quantity || 1) < stockLimit) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      return false;
    }
  } else {
    if (stockLimit > 0) {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: product.size || 'M',
        stock: product.stock
      });
    } else {
      return false;
    }
  }
  saveCart(cart);
  return true;
};

export const getWishlist = () => {
  const wishlist = localStorage.getItem(WISHLIST_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
};

export const saveWishlist = (wishlist) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  // Dispatch a storage event so components can update in real-time
  window.dispatchEvent(new Event('wishlist-updated'));
};

export const addToWishlistStore = (product) => {
  const wishlist = getWishlist();
  const existing = wishlist.find((item) => item.id === product.id);
  if (!existing) {
    wishlist.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: product.size || 'M',
    });
    saveWishlist(wishlist);
    return true; // Successfully added
  }
  return false; // Already in wishlist
};
