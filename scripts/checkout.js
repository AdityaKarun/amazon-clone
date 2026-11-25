import { loadProducts } from '../data/products.js';
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';

async function initializePage() {
  try {
    await loadProducts();

    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    console.error('Failed to initialize checkout page:', error);
  }
}

initializePage();