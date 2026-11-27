import { loadProducts, getProduct } from '../data/products.js';
import { addToCart, getCartQuantity } from '../data/cart.js';
import { orders } from '../data/orders.js';

import { formatCurrency } from './utils/money.js';
import { formatDeliveryDate } from './utils/deliveryDate.js';

function updateCartQuantityOnPage() {
    document.querySelector('.js-cart-quantity').innerHTML = getCartQuantity();
}

function loadProductsListHTML(order) {
    let productsListHTML = '';

    order.products.forEach((productDetails) => {
        const product = getProduct(productDetails.productId);

        productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${formatDeliveryDate(productDetails.estimatedDeliveryTime)}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again"
            data-product-id="${product.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsListHTML;
}

function loadOrdersGridHTML() {
    let ordersHTML = '';

    orders.forEach((order) => {
        const orderTimeString = formatDeliveryDate(order.orderTime);

        ordersHTML += `
        <div class="order-container">

          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${loadProductsListHTML(order)}
          </div>
        </div>
        `
    })

    document.querySelector('.js-order-grid').innerHTML = ordersHTML;
}

function addEventListeners() {
    // Event Listener: Add an already purchased item to the cart
    document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId, 1);
      button.innerHTML = 'Added';
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
      updateCartQuantityOnPage();
    });
  });
}

async function initializePage() {
    updateCartQuantityOnPage();

    try {
        await loadProducts();

        loadOrdersGridHTML();
        addEventListeners();
    } catch (error) {
        console.error('Failed to initialize orders page:', error);
    }
}

initializePage();