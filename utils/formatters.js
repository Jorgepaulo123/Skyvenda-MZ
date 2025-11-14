export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-MZ', { 
    style: 'currency', 
    currency: 'MZN' 
  }).format(price).replace('MTn', 'MZN');
};