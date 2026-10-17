export const cart = [];
let timeoutId;

export function addToCart(productId, quantity) {
    let matchingItem;

    // Check if the item already exists in the cart
    cart.forEach((item) => {
      if (productId == item.productId) {
        matchingItem = item;
      }
    })

    // If item already exists in the cart, update its quantity, else add it to the cart
    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      cart.push({
        productId: productId,
        quantity: quantity
      });
    }

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