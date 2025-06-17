import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type { Coffee } from 'terminal-dot-shop/types/terminal-api';

export default class CartService extends Service {
  @tracked items: (Coffee & { quantity: number })[] = [];

  constructor(owner: unknown, args: unknown) {
    super(owner, args);
    const itemsJson = localStorage.getItem('items');
    this.items = itemsJson
      ? (JSON.parse(itemsJson) as Coffee & { quantity: number })
      : [];
  }

  get totalItemsCount() {
    let itemsCount: number | null = null;

    this.items.forEach((item) => {
      itemsCount += item.quantity;
    });
    return itemsCount;
  }

  get getItems() {
    return this.items;
  }

  @action
  addItem(coffee: Coffee) {
    const existingItemIndex = this.items.findIndex(
      (item) => item.id == coffee.id,
    );
    console.log(existingItemIndex);

    if (existingItemIndex !== -1) {
      this.items = this.items.map((item, idx) =>
        idx === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      this.items = [...this.items, { ...coffee, quantity: 1 }];
    }
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  @action
  subtractItem(coffee: Coffee) {
    const existingItemIndex = this.items.findIndex(
      (item) => item.id == coffee.id,
    );

    if (existingItemIndex !== -1 && this.items[existingItemIndex] !== undefined && this.items[existingItemIndex].quantity > 0) {
      this.items = this.items.map((item, idx) =>
        idx === existingItemIndex
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      if (this.items[existingItemIndex] && this.items[existingItemIndex].quantity <= 0) {
        this.removeItem(coffee);
      }
    }
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  @action
  removeItem(coffee: Coffee) {
    const before = this.items.length;
    this.items = this.items.filter(item => item.id !== coffee.id);

    if (this.items.length < before) {
      console.log("Deleted: ", this.items);
      localStorage.setItem('items', JSON.stringify(this.items));
    }

  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:cart')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('cart') declare altName: CartService;`.
declare module '@ember/service' {
  interface Registry {
    cart: CartService;
  }
}
