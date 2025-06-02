import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type { Coffee } from 'terminal-dot-shop/types/terminal-api';

interface CoffeesRouteModel {
  coffees: Coffee[] | null;
}

export default class CoffeesController extends Controller {

  get loadCoffees() {
    const coffees = this.model as CoffeesRouteModel | null;
    if (coffees) {
      return coffees
    }
    return [];
  }
}
