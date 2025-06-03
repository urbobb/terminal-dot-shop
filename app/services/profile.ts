import Service from '@ember/service';
import { service } from '@ember/service';
import Terminal from '@terminaldotshop/sdk';
import config from 'terminal-dot-shop/config/environment';
import type CustomSessionService from './session';

const { TERMINAL_SHOP_API_BASE } = config.terminalShopOAuth2;

export default class ProfileService extends Service {
  @service declare session: CustomSessionService;
  @service store: any;

  async getProfile() {
    const access_token = this.session.data.authenticated.access_token as string;
    const client = new Terminal({
      bearerToken: access_token,
    });

    const profile = await client.profile.me();
    return profile.data.user;
  }

  async updateProfile(profileData: { name: string; email: string }) {
    const access_token = this.session.data.authenticated.access_token as string;
    const client = new Terminal({
      bearerToken: access_token,
    });
    const updatedProfile = await client.profile.update(profileData);
    return updatedProfile;
  }
}
