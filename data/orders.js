const orders = JSON.parse(localStorage.getItem('orders')) || [];

export async function placeOrder(cart) {
    const response = await fetch(
        'https://supersimplebackend.dev/orders',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart: cart
            })
        }
    );

    if (!response.ok) {
        throw Error('Failed to place order.');
    }

    const order = await response.json();

    console.log('Order placed successfully.');

    return order;
}

export function addOrder(order) {
    orders.unshift(order);

    // Save the order to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}