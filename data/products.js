export let products = []

export function loadProducts(function1, function2) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    products = JSON.parse(xhr.response);

    // Execute callback functions after products have loaded
    function1();
    function2();

    console.log('Products loaded.');
  });
  xhr.open('GET', 'https://supersimplebackend.dev/products');
  xhr.send();
  console.log('Loading products...');
}

export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (productId === product.id) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}