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

    return order;
}