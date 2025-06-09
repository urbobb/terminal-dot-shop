import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import Icon from 'terminal-dot-shop/components/icon';
import type { Coffee } from 'terminal-dot-shop/types/terminal-api';

interface CoffeesRouteModel {
  coffees: Coffee[] | null;
}

export default class CoffeeComponent extends Component {
  get loadCoffees() {
    const coffees = this.model as CoffeesRouteModel | null;
    if (coffees) {
      console.log('Coffees List: ', coffeeList);
      return coffees;
    }
    return [];
  }

  @action
  addCart(coffee){
    console.log("Coffee List: ", coffee);
  }

  <template>
    <div
      class="bg-gray-800 rounded-2xl shadow-xl mb-12 p-10 border border-gray-700 hover:shadow-2xl transition duration-500 ease-in-out transform hover:-translate-y-1"
    >
      <div class="flex flex-row justify-between items-center mb-6 border-b-2 pb-4 border-yellow-500">
        <h2
          class="text-4xl font-bold text-gray-100"
        >{{@coffee.name}}</h2>
        <button
          type="button"
          class="p-3 border border-amber-500 rounded-lg hover:cursor-pointer hover:bg-amber-500 transition duration-300"
          {{on "click" (fn this.addCart @coffee)}}
        >
          <Icon @add={{true}}/>
        </button>
      </div>
      <p
        class="text-gray-300 mb-8 leading-relaxed text-lg"
      >{{@coffee.description}}</p>

      <h3 class="text-2xl font-semibold text-gray-200 mb-5">Available Variants:</h3>
      <ul class="space-y-4">
        {{#each @coffee.variants as |variant|}}
          <li
            class="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-600"
          >
            <span
              class="text-xl font-medium text-gray-200"
            >{{variant.name}}</span>
            <span
              class="font-mono text-xl text-green-400 font-bold"
            >${{variant.price}}</span>
          </li>
        {{/each}}
      </ul>
    </div>
  </template>
}
