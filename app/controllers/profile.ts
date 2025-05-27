import Controller from '@ember/controller';
import { action } from '@ember/object';
import type { Profile, Address } from 'terminal-dot-shop/types/terminal-api';

interface ProfileRouteModel {
  profile: Profile | null;
  addresses: Address[] | null;
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

  get userAddress(): Address[] | undefined {
    const addresses = this.model?.addresses;
    if (addresses && addresses.length > 0) {
      return addresses;
    }
    return undefined;
  }
}
