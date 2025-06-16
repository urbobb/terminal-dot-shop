import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
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

  @action
  handleAddClick() {
    console.log('Clicked Add');
    this.cartItems();
  }

  @action
  handleSubractClick() {
    console.log('Clicked Subtract');
  }

  @action
  handleRemoveClick() {
    console.log('Clicked Remove');
  }

  <template>
    {{#each this.cartItems as |coffee|}}
      <div
        class="flex flex-row justify-between border border-gray-600 rounded-lg p-4 mb-5"
      >
        <div class="flex flex-col gap-4 w-full item-center justify-center">
          <h1 class="text-lg">Name:
            <span class="text-lg text-amber-400 font-bold">{{coffee.name}}</span></h1>
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
              {{on "click" this.handleAddClick}}
            ><Icon @add={{true}} /></button>
            <button
              type="button"
              class="p-3 border border-amber-500 rounded-lg hover:cursor-pointer hover:bg-amber-500 transition duration-300"
              {{on "click" this.handleSubractClick}}
            ><Icon @remove={{true}} /></button>
            <button
              type="button"
              class="p-3 border border-amber-500 rounded-lg hover:cursor-pointer hover:bg-amber-500 transition duration-300"
              {{on "click" this.handleRemoveClick}}
            >
              <Icon @trash={{true}} />
            </button>
          </div>
        </div>
      </div>

    {{/each}}
  </template>
}
