import axios from "axios"
import { useState } from "react"

export const produtos= [
      {
        "id": 1,
        "name": "Smartphone XYZ",
        "price": 15000,
        "rating": 4.5,
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        "description": "Um smartphone avançado com câmera de alta resolução e bateria de longa duração.",
        "category": "Smartphones",
        "stock": 15,
        "slug": "smartphone-xyz"
      },
      {
        "id": 2,
        "name": "Laptop ABC",
        "price": 45000,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        "description": "Laptop potente para trabalho e entretenimento.",
        "category": "Laptops",
        "stock": 8,
        "slug": "laptop-abc"
      },
      {
        "id": 3,
        "name": "Fones de Ouvido QWE",
        "price": 2500,
        "rating": 4.2,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        "description": "Fones de ouvido sem fio com cancelamento de ruído.",
        "category": "Acessórios",
        "stock": 20,
        "slug": "fones-de-ouvido-qwe"
      },
      {
        "id": 4,
        "name": "Smartwatch 123",
        "price": 8000,
        "rating": 4.0,
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        "description": "Relógio inteligente com monitor cardíaco.",
        "category": "Smartwatches",
        "stock": 12,
        "slug": "smartwatch-123"
      },
      {
        "id": 5,
        "name": "Tablet Pro",
        "price": 20000,
        "rating": 4.6,
        "image": "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        "description": "Tablet profissional para criatividade.",
        "category": "Tablets",
        "stock": 10,
        "slug": "tablet-pro"
      }
    ]
  
  