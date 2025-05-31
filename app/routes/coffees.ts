import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CoffeesRoute extends Route {
  @service session;
  @service product;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model() {
    try {
      const coffees = await this.product.getProducts();
      console.log("Coffees", coffees);
      return coffees;
    }
    catch (error) {
      console.error('Error fetching coffees in route model:', error);
      throw error;
    }
  }
}
