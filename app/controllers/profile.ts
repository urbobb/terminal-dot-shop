import Controller from '@ember/controller';
import type { Profile, Address } from 'terminal-dot-shop/types/terminal-api';

interface ProfileRouteModel {
  profile: Profile | null;
  address: Address | null;
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

  get userAddress(): object | undefined {
    const user = this.model?.address;
    if (user) {
      return {
        street: user.street1,
        city: user.city,
        postalCode: user.zip,
        state: user.state,
        country: user.country,
        phone: user.phone,
      };
    }
    return undefined;
  }
}
