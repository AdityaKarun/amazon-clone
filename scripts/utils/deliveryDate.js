import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function calculateDeliveryDate(deliveryDays) {
  return dayjs().add(deliveryDays, 'days').format('dddd, MMMM D');
}

export function formatDeliveryDate(date) {
  return dayjs(date).format('MMMM D');
}

export function formatDeliveryDateWithDay(date) {
  return dayjs(date).format('dddd, MMMM D')
}

export function calculateDeliveryProgressPercentage(order, productDetails) {
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);

  return ((today - orderTime) / (deliveryTime - orderTime)) * 100;
}