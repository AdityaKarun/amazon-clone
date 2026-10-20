// Retrieve cart items from localStorage or initiate an empty array
export let cart = JSON.parse(localStorage.getItem('cart')) || [];
let timeoutId;

export function getCartQuantity() {
  let noOfItems = 0;
  cart.forEach((item) => {
    noOfItems += item.quantity;
  });

  return noOfItems;
}

export function addToCart(productId, quantity) {
    let matchingItem;

    // Check if the item already exists in the cart
    cart.forEach((item) => {
      if (productId == item.productId) {
        matchingItem = item;
      }
    });

    // If item already exists in the cart, update its quantity, else add it to the cart
    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      cart.push({
        productId: productId,
        quantity: quantity
      });
    }

    // Save the cart items to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    console.log('Added to Cart');

    // Show 'Added to Cart' text for 2 seconds
    const addedToCartMessageElement = document.querySelector(`.js-added-to-cart-${productId}`);
    addedToCartMessageElement.classList.add('added-to-cart-visible');

    // Cancel the previous timeout, if one exists.
    clearTimeout(timeoutId);

    // Start a new 2-second timeout.
    timeoutId = setTimeout(() => {
      addedToCartMessageElement.classList.remove('added-to-cart-visible');
    }, 2000);
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((item) => {
    if (item.productId !== productId) {
      newCart.push(item);
    }
  });

  cart = newCart;
  
  // Save the updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateQuantity(productId, quantity) {
  cart.forEach((item) => {
    if (item.productId === productId) {
      item.quantity = quantity;
    }
  });

  // Save the updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}