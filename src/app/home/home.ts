import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { PRODUCTS, Product } from '../models/products';
import { ProductCard } from '../product-card/product-card';
import { CartService } from '../services/cartService/cart.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Ai, Message } from '../services/ai/ai';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [ProductCard, FormsModule, CommonModule, AsyncPipe],
})
export class HomeComponent {
  isLoading = signal(false);
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages!: Observable<Message[]>;
  newMessage = signal('');
  public products = PRODUCTS;
  private cartService = inject(CartService);
  private aiService = inject(Ai);

  constructor() {
    this.messages = this.aiService.getMessages();
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

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
      this.newMessage.set('');
      this.isLoading.set(true);
      setTimeout(() => {
        this.scrollToBottom();
      });
      await this.aiService.promptChatMessage({ from: 'User', message });
      this.isLoading.set(false);
      setTimeout(() => {
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom() {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }
}
