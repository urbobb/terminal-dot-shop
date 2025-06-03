import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type CustomSessionService from 'terminal-dot-shop/services/session';

export default class LoginController extends Controller {
  @tracked errorMessage;
  @service declare session: CustomSessionService;

  @action
  async login() {
    try {
      await this.session.authenticate('authenticator:terminal-shop-oauth2');
    } catch (error) {
      this.errorMessage = error.error || error;
    }
  }
}
