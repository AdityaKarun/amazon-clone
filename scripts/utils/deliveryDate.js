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