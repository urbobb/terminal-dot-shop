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
      const [userProfile, userAddresses] = await Promise.all([
        this.profile.getProfile(),
        this.address.getAddress()
      ]) as [Profile, Address[]];
      console.log("Address", userAddresses)
      return {
        profile: userProfile,
        addresses: userAddresses,
      };
    } catch (error) {
      console.error('Error fetching user profile in route model:', error);
      throw error;
    }
  }

}
