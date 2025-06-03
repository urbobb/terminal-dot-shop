import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from 'terminal-dot-shop/config/environment';
import type { Profile } from 'terminal-dot-shop/types/terminal-api';
import type CustomSessionService from 'terminal-dot-shop/services/session';
import type ProfileService from 'terminal-dot-shop/services/profile';

const { TERMINAL_SHOP_API_BASE } = config.terminalShopOAuth2;
export default class NavBarComponent extends Component {
  @service declare session: CustomSessionService;
  @service declare profile: ProfileService;

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

  @action
  invalidateSession() {
    this.session.invalidate();
  }
}
