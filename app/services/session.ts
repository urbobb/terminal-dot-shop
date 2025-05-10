// app/services/session.js
import SessionService from 'ember-simple-auth/services/session';
import { service } from '@ember/service';

export default class CustomSessionService extends SessionService {
  @service router;

  async handleAuthentication(_, transition) {
    await super.handleAuthentication(...arguments);
    // For example, redirect to dashboard explicitly:
    this.router.transitionTo('dashboard');
  }

  async handleInvalidation() {
    await super.handleInvalidation(...arguments);
    // On logout, redirect to login
    this.router.transitionTo('login');
  }
}
