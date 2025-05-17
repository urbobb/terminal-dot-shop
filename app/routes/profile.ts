import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { Profile } from 'terminal-dot-shop/types/terminal-api';
export default class ProfileRoute extends Route {
  @service session;
  @service profile;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(): Promise<Profile | null> {
    try {
      const profile = await this.profile.getProfile();
      return profile as Profile;
    } catch (error) {
      console.error('Error fetching user profile in route model:', error);
      throw error;
    }
  }
}
