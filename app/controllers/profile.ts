import Controller from '@ember/controller';
import type { Profile } from 'terminal-dot-shop/types/terminal-api';

export default class ProfileController extends Controller {
  model: Profile | null = null;

  get userName(): string {
    const user = this.model as unknown as Profile | null;
    if (user?.name) {
      return user.name;
    } else if (user?.email) {
      return user.email.split('@')[0] || '';
    }
    return '';

  }

  get userEmail(): string {
    const user = this.model as unknown as Profile | null;
    if (user?.email) {
      return user.email;
    }
    return '';
  }
}
