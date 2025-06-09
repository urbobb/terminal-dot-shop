import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type ProductService from 'terminal-dot-shop/services/product';
import type CustomSessionService from 'terminal-dot-shop/services/session';
import { products } from 'terminal-dot-shop/utils/products'

export default class CoffeesRoute extends Route {
  @service declare session: CustomSessionService;
  @service declare product: ProductService;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model() {
    try {
      //const coffees = await this.product.getProducts();
      const coffees = products;
      console.log("Coffees", coffees);
      return coffees;
    }
    catch (error) {
      console.error('Error fetching coffees in route model:', error);
      throw error;
    }
  }
}
