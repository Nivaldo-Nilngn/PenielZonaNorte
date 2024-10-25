import { Category } from '../types/Category';

export const categories: Category = {
    tithe: { title: 'Dízimo', color: 'purple', expense: false },
    offering: { title: 'Oferta', color: 'gold', expense: false },
    specialOffering: { title: 'Oferta Especial', color: 'orange', expense: false },
    billsToPay: { title: 'Aluguel', color: 'red', expense: true },
    electricity: { title: 'Conta de Luz', color: 'yellow', expense: true },
    water: { title: 'Conta de Água', color: 'blue', expense: true },
    internet: { title: 'Internet', color: 'green', expense: true },
    waterPurchase: { title: 'Compra de Água', color: 'lightblue', expense: true },
    cleaningProducts: { title: 'Produtos de Limpeza', color: 'brown', expense: true },
    disposableCups: { title: 'Copos Descartáveis', color: 'pink', expense: true },
    genericExpense: { title: 'Saída', color: 'gray', expense: true }
};
