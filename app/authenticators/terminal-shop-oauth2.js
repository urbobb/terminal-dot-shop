import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import config from 'terminal-dot-shop/config/environment';

const {
  TERMINAL_SHOP_CLIENT_ID,
  TERMINAL_SHOP_CLIENT_SECRET,
  TERMINAL_SHOP_REDIRECT_URI,
  TERMINAL_SHOP_AUTHORIZE_URL,
  TERMINAL_SHOP_TOKEN_URL,
} = config.terminalShopOAuth2;

export default class TerminalShopOAuth2Authenitcator extends Base {
  @service router;


  async authenticate() {
    const state = this.generateState();
    localStorage.setItem('terminal_shop_oauth_state', state);
    console.log('URL:::', TERMINAL_SHOP_AUTHORIZE_URL);

    // Authorization URL
    const authorizeURL = new URL(TERMINAL_SHOP_AUTHORIZE_URL);
    authorizeURL.searchParams.set('client_id', TERMINAL_SHOP_CLIENT_ID);
    authorizeURL.searchParams.set('redirect_uri', TERMINAL_SHOP_REDIRECT_URI);
    authorizeURL.searchParams.set('response_type', 'code');
    authorizeURL.searchParams.set('state', state);
    authorizeURL.searchParams.set('scope', 'earth_is_flat');

    window.location.replace(authorizeURL.toString());

    return new Promise((resolve, reject) => {});
  }

  async restore(data) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const returnedState = urlParams.get('state');
    const storedState = localStorage.getItem('terminal_shop_oauth_state');
    const error = urlParams.get('error');

    localStorage.removeItem('terminal_shop_oauth_state');

    if (error) {
      console.error('OAuth error: ', error);
      return Promise.reject(new Error(`OAuth Error: ${error}`));
    }

    // Check if we have a code and state
    if (code && returnedState && storedState === returnedState) {
      this._clearUrlParams(['code', 'state']);

      try {
        const tokenResponse = await this.exchangeCodeForToken(code);
        return Promise.resolve(tokenResponse);
      } catch (error) {
        console.error('Error while exchanging code for access_token', error);
        return Promise.reject(error);
      }
    } else if (code && (!returnedState || storedState !== returnedState)) {
      console.error('OAuth Error: State mismatch.');
      this.clearUrlParams(['code', 'state']);
      return Promise.reject(new Error('OAuth Erro: State mismatch.'));
    } else if (data && data.access_token) {
      //TODO: validate the existing access token!!!
      console.log('Restoring session from stored data');
      return Promise.resolve(data);
    } else {
      return Promise.reject();
    }
  }

  invalidate(data) {
    console.log('Session invalidated');
    return Promise.resolve();
  }

  async exchangeCodeForToken(code) {
    const tokenURL = TERMINAL_SHOP_TOKEN_URL;

    const response = await fetch(tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: TERMINAL_SHOP_CLIENT_ID,
        client_secret: TERMINAL_SHOP_CLIENT_SECRET,
        redirect_uri: TERMINAL_SHOP_REDIRECT_URI,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data.error_description || data.error || 'Unknown error';
      throw new Error(`Error exchanging code for token: ${error}`);
    }

    if (isEmpty(data.access_token)) {
      throw new Error('Token exchange response did not contain an access token.');
    }

    return data;
  }

  // genrate a random state stringg
  generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // clears a specific URL parameter from the URL
  clearUrlParams(params) {
    const url = new URL(window.location.href);
    params.forEach(param => url.searchParams.delete(param));
    window.history.replaceState({}, document.title, url.toString());
  }

}
