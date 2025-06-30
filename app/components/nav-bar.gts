import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from 'terminal-dot-shop/config/environment';
import { LinkTo } from '@ember/routing';
import Icon from 'terminal-dot-shop/components/icon';
import { on } from '@ember/modifier';
import { gt } from 'ember-truth-helpers';
import type { Profile } from 'terminal-dot-shop/types/terminal-api';
import type CustomSessionService from 'terminal-dot-shop/services/session';
import type ProfileService from 'terminal-dot-shop/services/profile';
import type CartService from 'terminal-dot-shop/services/cart';

export default class NavBarComponent extends Component {
  @service declare session: CustomSessionService;
  @service declare profile: ProfileService;
  @service declare cart: CartService;

  @tracked user: Profile | null = null;
  @tracked itemsInCart: number | null = null;

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

  get itemsCount(){
    if(!this.session.isAuthenticated){
      return 0;
    }
    const itemsInCart = this.cart.totalItemsCount;
    console.log("Total Items: ", itemsInCart);
    return itemsInCart as  number;
  }

  <template>
    <nav class="text-white px-6 py-4 shadow-md">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        {{! <!-- Logo --> }}
        <LinkTo
          @route="index"
          class="flex items-center space-x-2 hover:text-amber-400 transition"
        >
          <span class="tracking-wide"><span class="text-xs">not</span>
            <span class="text-md">official</span>
            <span class="text-2xl font-bold">Terminal Shop</span></span>
        </LinkTo>

        {{! <!-- Mobile Menu Button --> }}
        <div class="md:hidden">

          <button class="text-white focus:outline-none" type="button">
            Todo
          </button>
        </div>

        {{! <!-- Navigation Links and Buttons Container --> }}
        <div class="hidden md:flex items-center space-x-6">
          {{! <!-- Navigation Links --> }}
          <ul class="flex space-x-6 text-sm font-medium">
            <li>
              <LinkTo
                @route="coffees"
                class="hover:text-amber-400 transition text-xl"
              >Menu</LinkTo>
            </li>
          </ul>

          {{! <!-- CTA Button --> }}
          <a
            href="/cart"
            class="relative bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold p-4 rounded-md transition hover:cursor-pointer"
          >
            {{#if (gt this.itemsCount 0)}}

              <div
                class="absolute top-1 right-2 px-2 max-w-[8px] flex items-center justify-center bg-white text-black text-xs font-extralight rounded-full border border-amber-400"
              >
                <span class="tracking-wide">{{this.itemsCount}}</span>
              </div>
            {{/if}}
            <Icon @cart={{true}} />
          </a>

          {{! <!-- Login/Logout Button --> }}
          {{#if this.session.isAuthenticated}}
            {{#if this.user}}
              <div class="p-4 bg-[#333] rounded-lg">
                <div class="flex flex-row items-center space-x-5">
                  <a {{on "click" this.invalidateSession}} href="#"><Icon
                      @logout={{true}}
                    /></a>
                  <a href="profile">
                    <Icon @profile={{true}} />
                  </a>
                </div>
              </div>
            {{else}}
              <div>Loading profile...</div>
            {{/if}}
          {{else}}
            <LinkTo
              @route="login"
              class="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-4 py-2 rounded-md transition"
            >Login</LinkTo>
          {{/if}}
        </div>
      </div>
    </nav>
  </template>
}
