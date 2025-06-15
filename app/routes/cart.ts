import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type CustomSessionService from 'terminal-dot-shop/services/session';

export default class CartRoute extends Route {
  @service declare session: CustomSessionService;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }
}
