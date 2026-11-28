import { getCartQuantity } from "../data/cart.js";
import { loadProducts, getProduct } from "../data/products.js";
import { getOrder } from "../data/orders.js";
import { formatDeliveryDateWithDay } from "./utils/deliveryDate.js";

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

function loadTrackingHTML(product, productDetails) {
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
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar"></div>
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

        const productDetails = getProductDetail(order, product)

        loadTrackingHTML(product, productDetails);
    } catch (error) {
        console.error('Failed to initialize tracking page:', error);
    }
}

initializePage();