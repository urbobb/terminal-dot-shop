import Service from '@ember/service';
import { service } from '@ember/service';
import Terminal from '@terminaldotshop/sdk';
import config from 'terminal-dot-shop/config/environment';

const { TERMINAL_SHOP_API_BASE } = config.terminalShopOAuth2;

export default class ProfileService extends Service {
  @service session: any;
  @service store: any;

  async getProfile() {
    const access_token = this.session.data.authenticated.access_token as string;
    const client = new Terminal({
      bearerToken: access_token,
      baseURL: TERMINAL_SHOP_API_BASE as string,
    });

    const profile = await client.profile.me();
    return profile.data.user;
  }
}
