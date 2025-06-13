import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CartItem } from "../../models/cartItem";

@Injectable({
  providedIn: 'root'
})

export class CartService{
  private cartItems:BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);

  getCartItems():Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(item:CartItem) {
    const cartItems = this.cartItems.getValue();
    cartItems.push(item);
    this.cartItems.next(cartItems);
  }

  resetCart(items:CartItem[]) {
    this.cartItems.next(items);
  }
  removeFromCart(item:CartItem) {
    const cartItems = this.cartItems.getValue();
    const index = cartItems.indexOf(item);
    if (index !== -1) {
      cartItems.splice(index, 1);
      this.cartItems.next(cartItems);
    }
  }
}
