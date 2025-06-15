import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type CartService from 'terminal-dot-shop/services/cart';
import type CustomSessionService from 'terminal-dot-shop/services/session';

export default class CartRoute extends Route {
  @service declare session: CustomSessionService;
  @service declare cart: CartService;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model() {
    const coffeeList = this.cart.getItems;
    return coffeeList;
  }
}
