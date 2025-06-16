import { CartItem } from './../models/cartItem';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../services/cartService/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [DecimalPipe, CommonModule],
})
export class CartComponent implements OnInit {
  private cartItemService = inject(CartService);
  cartItems: CartItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    // Load from localStorage or a service
    this.cartItemService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  incrementQuantity(item: CartItem) {
    item.quantity++;
    this.cartItemService.updateCartItem(item.id, item.quantity);
  }

  decrementQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartItemService.updateCartItem(item.id, item.quantity);
    }
  }

  removeItem(item: CartItem) {
    this.cartItemService.removeFromCart(item.id);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  saveCart() {
    this.cartItemService.resetCart(this.cartItems);
  }

  proceedToShipping() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/shipping']);
    }
  }

  gotoHomePage() {
    this.router.navigate(['/home']);
  }
}
