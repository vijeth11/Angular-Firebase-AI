import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Header } from './header/header';
import { CartService } from './services/cartService/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from './models/cartItem';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, AsyncPipe, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public cartService: CartService = inject(CartService);
  public aiResponse: WritableSignal<string> = signal('');

  getCartItems(): Observable<CartItem[]> {
    return this.cartService.getCartItems();
  }
}
