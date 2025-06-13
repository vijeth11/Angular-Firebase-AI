import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Ai } from './ai';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, PRODUCTS } from './products';
import { Header } from "./header/header";
import { ProductCard } from "./product-card/product-card";


@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, Header, ProductCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public aiService:Ai = inject(Ai);
  public prompt: string = "Write a story about a magic backpack.";
  public aiResponse: WritableSignal<string> = signal('');
  messages: string[] = [];
  newMessage = signal('');
  public products = PRODUCTS;
  public cartItems: WritableSignal<{product: Product, quantity: number}[]> = signal([]);

  constructor() {
    this.aiService.startConversation();
  }

  getAiResponse(){
    this.aiService.askPrompt(this.prompt).then((response) => {
      this.aiResponse.set(response.text());
    });
  }

  onAddToCart(event: { product: Product, quantity: number }) {
    // Add logic to update cartItems, e.g.:
    this.cartItems.update(old => {
      old.push({ product: event.product, quantity: event.quantity })
      return old;
    });
  }

  sendMessage() {
    if (this.newMessage().trim()) {
      this.messages.push(this.newMessage());
      this.newMessage.set('');
    }
  }
}
