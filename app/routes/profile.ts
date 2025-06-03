import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type AddressService from 'terminal-dot-shop/services/address';
import type ProfileService from 'terminal-dot-shop/services/profile';
import type CustomSessionService from 'terminal-dot-shop/services/session';
import type { Profile, Address } from 'terminal-dot-shop/types/terminal-api';
export default class ProfileRoute extends Route {
  @service declare session: CustomSessionService;
  @service declare profile: ProfileService;
  @service declare address: AddressService;

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
