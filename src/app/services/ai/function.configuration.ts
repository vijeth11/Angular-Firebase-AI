import {
  FunctionDeclarationsTool,
  ObjectSchemaInterface,
  Schema,
} from 'firebase/ai';

export const functionDescription: FunctionDeclarationsTool = {
  functionDeclarations: [
    {
      name: 'getProducts',
      description: `Returns a list of products available for purchase.
                    Each product contains a name, price, description, and image URL.`,
    },
    {
      name: 'getCartItems',
      description: `Returns a list of items in the user's cart.
                    Each item has an ID, name, price, quantity, and image URL.`,
    },
    {
      name: 'resetCart',
      description: `Clears the user's cart and removes all the items from the cart.`,
    },
    {
      name: 'updateCart',
      description: `Updates the quantity of an existing item in the user's cart.
                    Either removing some quantity form existing cart item or add more quantity.
                    `,
      parameters: Schema.object({
        properties: {
          id: Schema.number({ description: 'The ID of the item.' }),
          quantity: Schema.number({ description: 'The quantity of the item.' }),
        },
      }) as ObjectSchemaInterface,
    },
    {
      name: 'removeFromCart',
      description: `Removes an item from the user's cart.
                    The item has an ID.`,
      parameters: Schema.object({
        properties: {
          id: Schema.number({ description: 'The ID of the item.' }),
        },
      }) as ObjectSchemaInterface,
    },
    {
      name: 'addToCart',
      description: `Adds an item to the user's cart.
                    The item has an ID, name, price, quantity, and image URL.`,
      parameters: Schema.object({
        description:
          'The product item with name,price and image to be added to the cart.With quantity set to 1. If item is not already present in the cart',
        properties: {
          id: Schema.number({
            description:
              'The ID of the item. Needs t be auto generated number to be unique',
          }),
          name: Schema.string({ description: 'The name of the item.' }),
          price: Schema.number({ description: 'The price of the item.' }),
          quantity: Schema.number({ description: 'The quantity of the item.' }),
          image: Schema.string({ description: 'The image URL of the item.' }),
        },
      }) as ObjectSchemaInterface,
    },
    {
      name: 'getCartItemsTotalCost',
      description: `Returns the total cost of all items in the user's cart.`,
    },
  ],
};
