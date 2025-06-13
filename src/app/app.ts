import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Ai } from './services/ai/ai';
import { AsyncPipe } from '@angular/common';
import { Header } from "./header/header";
import { CartService } from './services/cartService/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from './models/cartItem';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [ Header, AsyncPipe, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public aiService:Ai = inject(Ai);
  public cartService:CartService  = inject(CartService);
  public prompt: string = "Write a story about a magic backpack.";
  public aiResponse: WritableSignal<string> = signal('');

  constructor() {
    this.aiService.startConversation();
  }

  getAiResponse(){
    this.aiService.askPrompt(this.prompt).then((response) => {
      this.aiResponse.set(response.text());
    });
  }

  getCartItems():Observable<CartItem[]>{
    return this.cartService.getCartItems();
  }
}
