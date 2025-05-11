import SessionService from 'ember-simple-auth/services/session';
import { service } from '@ember/service';

export default class CustomSessionService extends SessionService {
  @service router;

  async handleAuthentication(_, transition) {
    await super.handleAuthentication(...arguments);
    this.router.transitionTo('dashboard');
  }

  async handleInvalidation() {
    await super.handleInvalidation(...arguments);
    this.router.transitionTo('login');
  }
}
