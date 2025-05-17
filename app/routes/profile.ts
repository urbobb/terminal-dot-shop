import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Profile } from 'terminal-dot-shop/types/terminal-api';

export default class ProfileRoute extends Route {
  @service session;
  @service profile;

  @tracked user: Profile | null = null;

  constructor(owner: unknown, args: unknown) {
    super(owner, args)
    this.fetchProfile();
  }

  async fetchProfile() {
      this.user = await this.profile.getProfile();
  }

  get userName() {
    if (this.user?.name) {
      return this.user.name;
    } else if (this.user?.email) {
      return this.user.email.split('@')[0] || '';
    }
  }

  get userEmail() {
    if (this.user?.email) {
      return this.user.email;
    }
  }

}
