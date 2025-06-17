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
import { BehaviorSubject, Observable } from 'rxjs';
export interface Message {
  from: 'AI' | 'User';
  message: string;
}
@Injectable({
  providedIn: 'root',
})
export class Ai {
  private model: GenerativeModel | undefined;
  chat: ChatSession | undefined;
  private chatMessages = new BehaviorSubject<Message[]>([]);

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
      const agenDescription =
        `
        Welcome to Angular Groceries. You are a super agent who will help the users
        with the information of available products and also add them to the cart or
        update the cart with the user requested products.

        These are the Product Details:-

      ` +
        this.productService.getProducts().map((product) => {
          return `
        Name: ${product.name}
        Price: ${product.price}
        Description: ${product.description}
        Image: ${product.image}
        `;
        });
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

  public startChat() {
    if (this.model) {
      this.chat = this.model.startChat();
      this.chatMessages.next([
        {
          from: 'AI',
          message: 'Hello! How can I help you today?',
        },
      ]);
    }
  }

  public getMessages(): Observable<Message[]> {
    return this.chatMessages.asObservable();
  }

  public async promptChatMessage(prompt: Message) {
    this.chatMessages.next([...this.chatMessages.getValue(), prompt]);
    let response = await this.sendMessage(prompt.message);
    this.chatMessages.next([
      ...this.chatMessages.getValue(),
      { from: 'AI', message: response },
    ]);
  }

  private async sendMessage(
    prompt: string | Array<string | Part>
  ): Promise<string> {
    if (this.chat) {
      let result = await this.chat.sendMessage(prompt);
      const functionCalls = result.response.functionCalls();
      let functionCall = [];
      let functionResult = [];
      // When the model responds with one or more function calls, invoke the function(s).
      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          let result;
          switch (call.name) {
            case functionDescription.functionDeclarations![0].name:
              result = this.productService.getProducts();
              break;
            case functionDescription.functionDeclarations![1].name:
              result = this.cartService.getCartItemsForAI();
              break;
            case functionDescription.functionDeclarations![2].name:
              result = this.cartService.resetCart();
              break;
            case functionDescription.functionDeclarations![3].name:
              let data = call.args as { id: number; quantity: number };
              result = this.cartService.updateCartItem(data.id, data.quantity);
              break;
            case functionDescription.functionDeclarations![4].name:
              result = this.cartService.removeFromCart(
                (call.args as { id: number }).id
              );
              break;
            case functionDescription.functionDeclarations![5].name:
              result = this.cartService.addToCart(call.args as CartItem);
              break;
            case functionDescription.functionDeclarations![6].name:
              result = this.cartService.getCartItemsTotalCost();
              break;
          }
          functionResult.push(result);
          functionCall.push(call);
        }

        // Send the function responses back to the model with results
        return await this.sendMessage(
          functionCall.map((call, index) => {
            return {
              functionResponse: {
                name: call.name, // "fetchProducts"
                response: { result: functionResult[index] },
              },
            };
          })
        );
      } else {
        return result.response.text();
      }
    }
    return 'Chat session not ready';
  }
}
