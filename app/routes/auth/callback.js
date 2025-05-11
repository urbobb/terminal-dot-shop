// app/routes/auth/callback.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthCallbackRoute extends Route {
  @service session;
  @service router;

  async beforeModel(transition) {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const error_description = url.searchParams.get('error_description');

    console.log('oauth code:', code);
    console.log('oauth state:', state);
    console.log('Parsed query params:', code, error, error_description);

    if (error) {
      console.error('OAuth error:', error, error_description);
      this.router.transitionTo('login');
      return;
    }

    if (code) {
      try {
        await this.session.authenticate('authenticator:terminal-shop-oauth2', {code});
      } catch (authError) {
        console.error('Token exchange failed', authError);
        this.session.invalidate();
        this.router.transitionTo('login');
      }
    }
  }
}
