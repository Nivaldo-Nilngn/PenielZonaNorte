import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Item } from '../types/Item';
import { categories } from '../data/categories';
import styled from 'styled-components';

type Props = {
  items: Item[];
};

const categoryTranslations: { [key: string]: string } = {
  tithe: "Dízimo",
  offering: "Oferta",
  specialOffering: "Oferta Especial",
  billsToPay: "Aluguel",
  electricity: "Conta de Luz",
  water: "Conta de Água",
  internet: "Internet",
  waterPurchase: "Compra de Água",
  cleaningProducts: "Produtos de Limpeza",
  disposableCups: "Copos Descartáveis",
  genericExpense: "Saída"
};


  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

export default Graphs;