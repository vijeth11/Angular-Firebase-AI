import { Inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  ChatSession,
  FunctionDeclarationsTool,
  GenerativeModel,
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  Part,
} from 'firebase/ai';
import { ProductService } from '../products/product.service';
import { CartService } from '../cartService/cart.service';
import { functionDescription } from './function.configuration';
import { CartItem } from '../../models/cartItem';

@Injectable({
  providedIn: 'root',
})
export class Ai {
  private model: GenerativeModel | undefined;
  chat: ChatSession | undefined;
  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: FirebaseApp,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  startConversation() {
    if (!this.model) {
      // Initialize the Gemini Developer API backend service
      const ai = getAI(this.firebaseApp, { backend: new GoogleAIBackend() });

      // System Instructions
      const agenDescription = `
        Welcome to Angular Groceries. You are a super agent who will help the users
        with the information of available products and also add them to the cart or
        update the cart with the user requested products.
      `;
      // Create a `GenerativeModel` instance with a model that supports your use case
      this.model = getGenerativeModel(ai, {
        model: 'gemini-2.0-flash',
        systemInstruction: agenDescription,
        tools: [functionDescription],
      });
    }
  }

  async askPrompt(prompt: string) {
    if (this.model) {
      // To generate text output, call generateContent with the text input
      const result = await this.model.generateContent(prompt);

      console.log(result.response);
      console.log(result.response.text());
      return result.response;
    }
    return '';
  }

  startChat() {
    if (this.model) {
      this.chat = this.model.startChat();
    }
  }

  async sendMessage(prompt: string | Array<string | Part>): Promise<string> {
    if (this.chat) {
      let result = await this.chat.sendMessage(prompt);
      const functionCalls = result.response.functionCalls();
      let functionCall;
      let functionResult;
      // When the model responds with one or more function calls, invoke the function(s).
      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          switch (call.name) {
            case functionDescription.functionDeclarations![0].name:
              functionResult = this.productService.getProducts();
              break;
            case functionDescription.functionDeclarations![1].name:
              functionResult = this.cartService.getCartItems();
              break;
            case functionDescription.functionDeclarations![2].name:
              functionResult = this.cartService.removeFromCart(
                (call.args as { id: number }).id
              );
              break;
            case functionDescription.functionDeclarations![3].name:
              let data = call.args as { id: number; quantity: number };
              functionResult = this.cartService.updateCartItem(
                data.id,
                data.quantity
              );
              break;
            case functionDescription.functionDeclarations![4].name:
              functionResult = this.cartService.addToCart(
                call.args as CartItem
              );
              break;
          }
          functionCall = call;
        }
        return await this.sendMessage([
          {
            functionResponse: {
              name: functionCall!.name, // "fetchProducts"
              response: { products: functionResult! },
            },
          },
        ]);
      } else {
        return result.response.text();
      }
    }
    return 'Chat session not ready';
  }
}
