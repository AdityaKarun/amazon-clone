export let products = []

export async function loadProducts() {
  console.log('Loading products...');

  const response = await fetch('https://supersimplebackend.dev/products');

  if (!response.ok) {
    throw Error('Failed to fetch products.')
  }

  products = await response.json();

  console.log('Products loaded.');
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