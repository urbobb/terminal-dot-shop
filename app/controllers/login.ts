import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @tracked errorMessage;
  @service session;

  @action
  async login() {
    try {
      await this.session.authenticate('authenticator:terminal-shop-oauth2');
    } catch (error) {
      this.errorMessage = error.error || error;
    }
  }
}
