import Controller from '@ember/controller';
import type { Profile, Address } from 'terminal-dot-shop/types/terminal-api';

interface ProfileRouteModel {
  profile: Profile | null;
  address: Address | null;
}

interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  phone: string | null;
}

export default class ProfileController extends Controller {
  model: ProfileRouteModel | null = null;

  get userName(): string {
    const user = this.model?.profile as Profile;
    if (user?.name) {
      return user.name;
    } else if (user?.email) {
      return user.email.split('@')[0] || '';
    }
    return '';
  }

  get userEmail(): string {
    const user = this.model?.profile as Profile;
    if (user?.email) {
      return user.email;
    }
    return '';
  }

  get userAddress(): UserAddress | undefined {
    const address = this.model?.address;
    if (address) {
      return {
        street: address[0].street1,
        city: address[0].city,
        postalCode: address[0].zip,
        state: address[0].state,
        country: address[0].country,
        phone: address[0].phone ? address[0].phone : null,
      };
    }
    return undefined;
  }
}
