import { Product } from "./product";
export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  isSelected: boolean;
}