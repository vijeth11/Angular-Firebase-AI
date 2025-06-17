import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../models/cartItem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject<
    CartItem[]
  >([]);

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartItemsForAI(): CartItem[] {
    return this.cartItems.getValue();
  }
  addToCart(item: CartItem) {
    const cartItems = this.cartItems.getValue();
    cartItems.push(item);
    this.cartItems.next(cartItems);
  }

  updateCartItem(id: number, quantity: number) {
    const cartItems = this.cartItems.getValue();
    const index = cartItems.findIndex((x) => x.id === id);
    if (index !== -1) {
      const currentQuantity = cartItems[index].quantity;
      cartItems[index].quantity =
        currentQuantity + quantity > 1 ? currentQuantity + quantity : 1;
      this.cartItems.next(cartItems);
    }
  }

  resetCart() {
    this.cartItems.next([]);
  }

  removeFromCart(id: number) {
    const cartItems = this.cartItems.getValue();
    const index = cartItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      cartItems.splice(index, 1);
      this.cartItems.next(cartItems);
    }
  }

  getCartItemsTotalCost(): number {
    return this.cartItems
      .getValue()
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
