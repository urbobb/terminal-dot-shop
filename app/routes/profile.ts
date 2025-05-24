import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { Profile, Address } from 'terminal-dot-shop/types/terminal-api';
export default class ProfileRoute extends Route {
  @service session;
  @service profile;
  @service address;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model() {
    //fetch address
    try {
      const userProfile = await this.profile.getProfile();
      const userAddress = await this.address.getAddress();
      console.log("Address", userAddress)
      return {
        profile: userProfile as Profile,
        addresses: userAddress as Address,
      };
    } catch (error) {
      console.error('Error fetching user profile in route model:', error);
      throw error;
    }
  }


}
