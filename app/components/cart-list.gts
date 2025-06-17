import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { gt } from 'ember-truth-helpers';
import { tracked } from '@glimmer/tracking';
import Icon from 'terminal-dot-shop/components/icon';
import type { Coffee } from 'terminal-dot-shop/types/terminal-api';
import type CartService from 'terminal-dot-shop/services/cart';

interface CoffeeModel {
  coffee: Coffee[];
}

export default class CartListComponent extends Component {
  @service declare cart: CartService;

  @tracked items: CoffeeModel = [];

  get cartItems(): CoffeeModel {
    return this.cart.getItems as CoffeeModel;
  }

  get itemsCount() {
    const itemsInCart = this.cart.totalItemsCount;
    return itemsInCart as number;
  }

  @action
  handleAddClick(coffee: Coffee) {
    this.cart.addItem(coffee);
  }

  @action
  handleSubractClick(coffee: Coffee) {
    this.cart.subtractItem(coffee);
  }

  @action
  handleRemoveClick(coffee: Coffee) {
    console.log('Clicked Remove', coffee);
    this.cart.removeItem(coffee);
  }

  <template>
    {{#if (gt this.itemsCount 0)}}
      {{#each this.cartItems as |coffee|}}
        {{#if (gt coffee.quantity 0)}}
          <div
            class="flex flex-row justify-between border border-gray-600 rounded-lg p-4 mb-5"
          >
            <div class="flex flex-col gap-4 w-full item-center justify-center">
              <h1 class="text-lg">Name:
                <span
                  class="text-lg text-amber-400 font-bold"
                >{{coffee.name}}</span></h1>
            </div>
            <div class="flex flex-col justify-between min-w-fit">
              <div class="flex flex-row justify-between">
                <span class="font-semibold">Amount: </span>
                <span>{{coffee.quantity}}</span>
              </div>
              <div class="flex flex-row justify-between gap-2">
                <button
                  type="button"
                  class="p-3 border border-amber-500 rounded-lg hover:cursor-pointer hover:bg-amber-500 transition duration-300"
                  {{on "click" (fn this.handleAddClick coffee)}}
                ><Icon @add={{true}} /></button>
                <button
                  type="button"
                  class="p-3 border border-amber-500 rounded-lg hover:cursor-pointer hover:bg-amber-500 transition duration-300"
                  {{on "click" (fn this.handleSubractClick coffee)}}
                ><Icon @remove={{true}} /></button>
                <button
                  type="button"
                  class="p-3 border border-amber-500 rounded-lg hover:cursor-pointer hover:bg-amber-500 transition duration-300"
                  {{on "click" (fn this.handleRemoveClick coffee)}}
                >
                  <Icon @trash={{true}} />
                </button>
              </div>
            </div>
          </div>
        {{/if}}
      {{/each}}
    {{else}}
      <div class="text-xl font-bold">No Items found.</div>
    {{/if}}
  </template>
}
