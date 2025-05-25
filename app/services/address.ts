import Service from '@ember/service';
import { service } from '@ember/service';
import Terminal from '@terminaldotshop/sdk';
import config from 'terminal-dot-shop/config/environment';
import type { Address } from 'terminal-dot-shop/types/terminal-api';

const { TERMINAL_SHOP_API_BASE } = config.terminalShopOAuth2;

export default class AddressService extends Service {
  @service session: any;
  @service store: any;

  async getAddress() {
    const access_token = this.session.data.authenticated.access_token as string;
    const client = new Terminal({
      bearerToken: access_token,
    });

    const address = await client.address.list();
    return address.data;
  }

  async createAddress(addressData: Address) {
    const access_token = this.session.data.authenticated.access_token as string;
    const client = new Terminal({
      bearerToken: access_token,
    });
    console.log("Creating address with data:", addressData);
    const address = await client.address.create(
      {
        name: "John Doe",
        street1: "532-616 Brittania St",
        street2: "",
        city: "Los Angeles",
        province: "CA",
        zip: "90001",
        country: "US",
        phone: "123-456-7890",
      }
    );
    return address;
  }

  async deleteAddress(addressId: string) {
    const access_token = this.session.data.authenticated.access_token as string;
    const client = new Terminal({
      bearerToken: access_token,
    });

    const addressToDelete = await client.address.delete(addressId);
    return addressToDelete;

  }
}
