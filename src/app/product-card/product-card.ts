import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../models/products';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input({required: true}) product!: Product;
  @Output() addToCart = new EventEmitter<{product: Product, quantity: number}>();
  quantity = 1;
  isFlipped = false;

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCartClicked() {
    this.addToCart.emit({ product: this.product, quantity: this.quantity });
  }
}
