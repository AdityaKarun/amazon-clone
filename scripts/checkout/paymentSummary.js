import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';

function paymentSummaryHTML(summary) {
    const paymentSummaryHTML = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(summary.productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(summary.shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(summary.totalBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(summary.taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(summary.orderTotalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `

    return paymentSummaryHTML;
}

function calculatePaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((item) => {
        const product = getProduct(item.productId);
        const deliveryOption = getDeliveryOption(item.deliveryOptionId);

        productPriceCents += product.priceCents * item.quantity;
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTax = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTax * 0.1;
    const orderTotalCents = totalBeforeTax + taxCents;

    return {
        productPriceCents,
        shippingPriceCents,
        totalBeforeTax,
        taxCents,
        orderTotalCents
    };
}

export function renderPaymentSummary() {
    const paymentSummary = calculatePaymentSummary();
    const html = paymentSummaryHTML(paymentSummary);

    document.querySelector('.js-payment-summary').innerHTML = html;
}