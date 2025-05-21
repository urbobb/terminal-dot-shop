import Service from '@ember/service';
import { service } from '@ember/service';
import Terminal from '@terminaldotshop/sdk';
import config from 'terminal-dot-shop/config/environment';

const { TERMINAL_SHOP_API_BASE } = config.terminalShopOAuth2;

export default class AddressService extends Service {
  @service session: any;
  @service store: any;

  async getAddress() {
    const access_token = this.session.data.authenticated.access_token as string;
    const client = new Terminal({
      bearerToken: access_token,
      baseURL: TERMINAL_SHOP_API_BASE as string,
    });

    const address = await client.address.list();
    return address.data;
  }
}
