const API_BASE_URL = 'http://localhost:3000';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  categories: string[];
  disponibilidad?: number;
}

export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/producto`);
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      const products = await response.json();
      
      // Parsear los campos JSON (ingredients y categories)
      return products.map((product: any) => ({
        ...product,
        ingredients: product.ingredients ? JSON.parse(product.ingredients) : [],
        categories: product.categories ? JSON.parse(product.categories) : []
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  static async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/producto/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener producto');
      }
      const product = await response.json();
      
      return {
        ...product,
        ingredients: product.ingredients ? JSON.parse(product.ingredients) : [],
        categories: product.categories ? JSON.parse(product.categories) : []
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts.filter(product => 
        product.categories.includes(category) && product.disponibilidad !== 0
      );
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  static async getAvailableProducts(): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts.filter(product => product.disponibilidad !== 0);
    } catch (error) {
      console.error('Error fetching available products:', error);
      return [];
    }
  }
} 