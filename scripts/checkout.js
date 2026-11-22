import { loadProducts } from '../data/products.js';
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';

// Load the products for both order summary and payment summary section
loadProducts(renderOrderSummary, renderPaymentSummary);