import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type { Coffee } from 'terminal-dot-shop/types/terminal-api';

export default class CartService extends Service {
  @tracked items: (Coffee & { quantity: number })[] = [];

  constructor(owner: unknown, args: unknown) {
    super(owner, args)
    const itemsJson = localStorage.getItem("items");
    this.items = itemsJson ? JSON.parse(itemsJson) as (Coffee & {quantify: number}) : [];
  }

  get totalItemsCount() {
    const itemsJson = localStorage.getItem("items");
    let itemsCount: number | null = null;
    const items: (Coffee & { quantity: number })[] = [];
    items.forEach(item => {
      itemsCount += item.quantity;
    });
    return itemsCount
  }

  @action
  addItem(coffee: Coffee) {
    const existingItemIndex = this.items.findIndex(item => item.id == coffee.id)
    console.log(existingItemIndex)

    if (existingItemIndex !== -1) {
      if (this.items[existingItemIndex]) {
        this.items[existingItemIndex].quantity += 1;
      }
    } else {
      this.items = [...this.items, { ...coffee, quantity: 1 }]
    }
    localStorage.setItem("items", JSON.stringify(this.items));
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:cart')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('cart') declare altName: CartService;`.
declare module '@ember/service' {
  interface Registry {
    'cart': CartService;
  }
}
