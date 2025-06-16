import { Component, inject, OnInit, signal } from '@angular/core';
import { PRODUCTS, Product } from '../models/products';
import { ProductCard } from '../product-card/product-card';
import { CartService } from '../services/cartService/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ai } from '../services/ai/ai';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [ProductCard, FormsModule, CommonModule],
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.aiService.startConversation();
    this.aiService.startChat();
    this.aiService.sendMessage(
      'give me the list of products with detailed information'
    );
  }

  messages: { from: 'AI' | 'User'; message: string }[] = [
    { from: 'AI', message: 'Hello! How can I help you today?' },
  ];
  newMessage = signal('');
  public products = PRODUCTS;
  private cartService = inject(CartService);
  private aiService = inject(Ai);

  onAddToCart(event: { product: Product; quantity: number }) {
    this.cartService.addToCart({
      id: Math.floor(Math.random() * 10000000000000000),
      name: event.product.name,
      price: event.product.price,
      image: event.product.image,
      quantity: event.quantity,
    });
  }

  async sendMessage() {
    if (this.newMessage().trim()) {
      const message = this.newMessage().trim();
      this.messages.push({ from: 'User', message });
      const response = await this.aiService.sendMessage(message);
      this.messages.push({ from: 'AI', message: response });
      this.newMessage.set('');
    }
  }
}
