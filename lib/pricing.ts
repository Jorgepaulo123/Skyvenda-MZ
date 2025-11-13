export const PRICING = {
    daily: {
      price: 100,
      label: 'Oferta Diária'
    },
    best: {
      price: 150,
      label: 'Melhores Boladas'
    },
    personal: {
      price: 80,
      label: 'Para Si'
    }
  } as const;
  
  export const calculateTotal = (placement: keyof typeof PRICING, days: number): number => {
    return PRICING[placement].price * days;
  };
  
  export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(value);
  };