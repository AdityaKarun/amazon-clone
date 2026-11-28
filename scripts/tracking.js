import { getCartQuantity } from "../data/cart.js";
import { loadProducts, getProduct } from "../data/products.js";
import { getOrder } from "../data/orders.js";
import { formatDeliveryDateWithDay, calculateDeliveryProgressPercentage } from "./utils/deliveryDate.js";

function updateCartQuantityOnPage() {
    document.querySelector('.js-cart-quantity').innerHTML = getCartQuantity();
}

function getProductDetail(order, product) {
    let productDetails;

    order.products.forEach((details) => {
        if (details.productId === product.id) {
            productDetails = details;
        }
    });

    return productDetails;
}

function loadTrackingHTML(product, productDetails, percentProgress) {
    const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">
      Arriving on ${formatDeliveryDateWithDay(productDetails.estimatedDeliveryTime)}
    </div>
    <div class="product-info">
      ${product.name}
    </div>
    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>
    <img class="product-image" src="${product.image}">
    <div class="progress-labels-container">
      <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${percentProgress >= 100 ? "current-status" : ''}">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

    document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}

async function initializePage() {
    updateCartQuantityOnPage();

    const url = new URL(window.location.href);
    const orderId = (url.searchParams.get('orderId'));
    const productId = (url.searchParams.get('productId'));

    try {
        await loadProducts();

        const order = getOrder(orderId);
        const product = getProduct(productId);
        const productDetails = getProductDetail(order, product);
        const percentProgress = calculateDeliveryProgressPercentage(order, productDetails);

        loadTrackingHTML(product, productDetails, percentProgress);
    } catch (error) {
        console.error('Failed to initialize tracking page:', error);
    }
}

initializePage();