import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from 'terminal-dot-shop/config/environment';
import type { Profile } from 'terminal-dot-shop/types/terminal-api';


const { TERMINAL_SHOP_API_BASE } = config.terminalShopOAuth2;
export default class NavBarComponent extends Component {
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
    return this.user?.email?.split('@')[0] || '';
  }

  @action
  invalidateSession() {
    this.session.invalidate();
  }
}
