import { products, getProduct } from '../../data/products.js';
import { cart, getCartQuantity, removeFromCart, updateQuantity, updateDeliveryOption } from '../../data/cart.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { formatCurrency } from '../utils/money.js';
import { calculateDeliveryDate } from '../utils/deliveryDate.js';

function deliveryOptionsHTML(productId, cartItem) {
    let deliveryOptionsHTML = '';

    deliveryOptions.forEach((deliveryOption) => {
        const dateString = calculateDeliveryDate(deliveryOption.deliveryDays);
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

        // Pre select a delivery option
        let isChecked;

        if (deliveryOption.id === cartItem.deliveryOptionId) {
            isChecked = true;
        } else {
            isChecked = false;
        }

        deliveryOptionsHTML += `
                    <div class="delivery-option js-delivery-option" data-product-id=${productId} data-delivery-option-id=${deliveryOption.id}>
                        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${productId}" />
                        <div>
                            <div class="delivery-option-date">${dateString}</div>
                            <div class="delivery-option-price">${priceString} Shipping</div>
                        </div>
                    </div>
                    `
    });

    return deliveryOptionsHTML;
}

function cartItemHTML() {
    let checkoutItemsHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const deliveryOptionId = cartItem.deliveryOptionId;

        // Get product and delivery details
        const matchingProduct = getProduct(productId);
        const deliveryOption = getDeliveryOption(deliveryOptionId);

        // Calculate delivery date
        const dateString = calculateDeliveryDate(deliveryOption.deliveryDays);

        checkoutItemsHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">${dateString}</div>

            <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}" />

                <div class="cart-item-details">
                    <div class="product-name">${matchingProduct.name}</div>
                    <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
                    <div class="product-quantity">
                        <span> Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span> </span>
                        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}"> Update </span>
                        <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                        <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}"> Delete </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">Choose a delivery option:</div>
                    ${deliveryOptionsHTML(matchingProduct.id, cartItem)}
                </div>
            </div>
        </div>
    `
    });

    return checkoutItemsHTML;
}

export function renderOrderSummary() {
    document.querySelector('.js-order-summary').innerHTML = cartItemHTML();
    updateCartQuantityOnPage();
    addEventListeners();
}

function updateCartQuantityOnPage() {
    document.querySelector(".js-cart-quantity").innerHTML = `${getCartQuantity()} items`;
}

function deleteCartItemFromPage(productId) {
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    document.querySelector('.js-cart-quantity').innerHTML = `${getCartQuantity()} items`;
}

function updateCartItemOnPage(productId, newQuantity) {
    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    quantityLabel.innerHTML = newQuantity;
    document.querySelector('.js-cart-quantity').innerHTML = `${getCartQuantity()} items`;
}

function addEventListeners() {
    // Event Listener: Delete a product from the cart
    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            deleteCartItemFromPage(productId);

            // Re-render the payment summary to reflect the updated cart totals
            renderPaymentSummary();
        });
    });

    // Event Listener: Show the quantity input when clicked on update
    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;

            // Identify product container from productId, add a class to it to show an input box
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add('is-editing-quantity');
        });
    });

    // Event Listener: Save the updated quantity
    document.querySelectorAll('.js-save-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;

            // Find the product container
            const container = document.querySelector(`.js-cart-item-container-${productId}`);

            // Read the new quantity from the input box and convert it to a number
            const quantityInput = container.querySelector(`.js-quantity-input-${productId}`);
            const newQuantity = Number(quantityInput.value);

            // Validate the quantity before saving the changes
            if (!Number.isInteger(newQuantity) || newQuantity < 1 || newQuantity > 10) {
                alert('Quantity must be a whole number between 1 and 10.');
                return;
            }

            // Hide the input and Save button
            container.classList.remove('is-editing-quantity');

            updateQuantity(productId, newQuantity);
            updateCartItemOnPage(productId, newQuantity)

            // Re-render the payment summary to reflect the updated cart totals
            renderPaymentSummary();
        });
    });

    // Event Listener: Change the delivery option and update the delivery date
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            // Object destructuring to extract two values simultaneously
            const { productId, deliveryOptionId } = element.dataset;

            // Update the selected delivery option in the cart
            updateDeliveryOption(productId, deliveryOptionId);

            // Find the selected delivery option's details
            let selectedDeliveryOption;

            deliveryOptions.forEach((option) => {
                if (option.id === deliveryOptionId) {
                    selectedDeliveryOption = option;
                }
            });

            // Calculate the new delivery date
            const dateString = calculateDeliveryDate(selectedDeliveryOption.deliveryDays);

            // Update the delivery date displayed for this product
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );

            container.querySelector('.delivery-date').innerHTML = dateString;

            // Re-render the payment summary to reflect the updated cart totals
            renderPaymentSummary();
        });
    });
}