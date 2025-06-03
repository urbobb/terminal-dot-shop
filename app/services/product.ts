import Service from '@ember/service';
import { service } from '@ember/service';
import Terminal from '@terminaldotshop/sdk';
import type CustomSessionService from './session';
export default class ProductService extends Service {
  @service declare session: CustomSessionService;

  async getProducts() {
    const access_token = this.session.data.authenticated.access_token as string;
    const client = new Terminal({
      bearerToken: access_token,
    });

    const products = await client.product.list();

    return products.data;
  }
 }
