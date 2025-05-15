import Base from 'ember-simple-auth/authenticators/base';
import { Promise as EmberPromise } from 'rsvp';
import config from 'terminal-dot-shop/config/environment';
import type { AuthData, SessionData } from 'terminal-dot-shop/types/OAuth';
import {
  generateCodeChallenge,
  generateCodeVerifier,
} from 'terminal-dot-shop/utils/pkce';

const {
  TERMINAL_SHOP_AUTHORIZE_URL,
  TERMINAL_SHOP_CLIENT_ID,
  TERMINAL_SHOP_CLIENT_SECRET,
  TERMINAL_SHOP_TOKEN_URL,
  TERMINAL_SHOP_REDIRECT_URI,
} = config.terminalShopOAuth2;

export default class TerminalAuthenticator extends Base {
  async restore(data: SessionData) {
    if (
      data.access_token &&
      (!data.expires_at || data.expires_at > Date.now())
    ) {
      return data;
    }
    return EmberPromise.reject();
  }

  async authenticate(data: AuthData) {
    // if the code is provided, we are in the callback phase of the OAuth2 PKCE flow!!!!!!!!!
    if (data?.code) {
      console.log('Exchanging code for tokens:', data.code);
      const codeVerifier = localStorage.getItem('pkce_code_verifier');
      if (!codeVerifier) {
        return EmberPromise.reject({ error: 'pkce_verifier_missing' });
      }

      const tokenUrl = `${TERMINAL_SHOP_TOKEN_URL}`;
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: data.code,
        redirect_uri: TERMINAL_SHOP_REDIRECT_URI as string,
        client_id: TERMINAL_SHOP_CLIENT_ID as string,
        client_secret: TERMINAL_SHOP_CLIENT_SECRET as string,
        code_verifier: codeVerifier,
      });

      try {
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Token exchange failed!!!');
        }
        const json = (await response.json()) as SessionData;
        const expiresAt = json.expires_in
          ? Date.now() + json.expires_in * 1000
          : null;
        console.log('Token Response: ', json);
        return {
          access_token: json.access_token,
          refresh_token: json.refresh_token,
          expires_at: expiresAt,
          token_type: json.token_type,
        };
      } catch (err: any) {
        return EmberPromise.reject({ error: err.message });
      }
    }

    // start the OAuth2 PKCE flow if no code is provided!!!!!!!
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem('pkce_code_verifier', verifier);

    const url = new URL(TERMINAL_SHOP_AUTHORIZE_URL as string);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', TERMINAL_SHOP_CLIENT_ID as string);
    url.searchParams.set(
      'client_secret',
      TERMINAL_SHOP_CLIENT_SECRET as string,
    );
    url.searchParams.set('redirect_uri', TERMINAL_SHOP_REDIRECT_URI as string);
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('scope', 'lol');

    window.location.assign(url.toString());

    return new EmberPromise(() => {});
  }

  async invalidate() {
    localStorage.removeItem('pkce_code_verifier');

    return;
  }
}
