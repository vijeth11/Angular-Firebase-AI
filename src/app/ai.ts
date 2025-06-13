import { Inject, Injectable } from '@angular/core';
import { FirebaseApp, firebaseApp$ } from '@angular/fire/app';
import { GenerativeModel, getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class Ai {

  private model!:GenerativeModel;
  constructor(@Inject("FIREBASE_APP") private firebaseApp: FirebaseApp) { }

  startConversation(){
    // Initialize the Gemini Developer API backend service
    const ai = getAI(this.firebaseApp, { backend: new GoogleAIBackend() });

    // Create a `GenerativeModel` instance with a model that supports your use case
    this.model = getGenerativeModel(ai, { model: "gemini-2.0-flash" });
  }

  async askPrompt(prompt:string){

    // To generate text output, call generateContent with the text input
    const result = await this.model.generateContent(prompt);

    console.log(result.response);
    console.log(result.response.text());
    return result.response;
  }
}
