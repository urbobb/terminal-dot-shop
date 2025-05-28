import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type { Coffee } from 'terminal-dot-shop/types/terminal-api';

interface CoffeesRouteModel {
  coffees: Coffee[] | null;
}

export default class CoffeesController extends Controller {
  @tracked
  loadCoffees = this.model;
  // get loadCoffees() {
  //   const coffees = this.model?.coffees as Coffee[] | null;
  //   if (coffees) {
  //     console.log("Coffees loaded:", coffees);
  //     return coffees
  //   }
  //   return [];
  // }
}
