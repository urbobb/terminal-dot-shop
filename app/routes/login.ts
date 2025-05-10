// app/routes/login.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LoginRoute extends Route {
  @service session;

  beforeModel(transition) {
    // If already logged in, redirect (prohibitAuthentication)
    this.session.prohibitAuthentication('dashboard');
  }
}
