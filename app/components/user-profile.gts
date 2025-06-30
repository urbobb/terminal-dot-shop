import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Icon from 'terminal-dot-shop/components/icon';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { not, eq, and } from 'ember-truth-helpers';
import formatCompactNumber from 'terminal-dot-shop/helpers/format-compact-number';
import type CustomSessionService from 'terminal-dot-shop/services/session';
import type AddressService from 'terminal-dot-shop/services/address';
import type ProfileService from 'terminal-dot-shop/services/profile';
import type RouterService from '@ember/routing/router-service';

interface ProfileForm {
  name: string;
  email: string;
}

interface AddressForm {
  name: string;
  street1: string;
  street2: string;
  province: string;
  city: string;
  country: string;
  zip: string;
  phone: string | null;
  id: string;
}

export default class UserProfileComponent extends Component {
  @service declare session: CustomSessionService;
  @service declare address: AddressService;
  @service declare profile: ProfileService;
  @service declare router: RouterService;

  @tracked isEditingProfile: boolean = false;
  @tracked isEditingAddress: boolean = false;
  @tracked editingAddressId: string | null = null;
  @tracked name: string = '';
  @tracked email: string = '';
  @tracked street1: string = '';
  @tracked street2: string = '';
  @tracked province: string = '';
  @tracked city: string = '';
  @tracked country: string = '';
  @tracked zip: string = '';
  @tracked phone: string | null = null;
  @tracked prices = [
    1200,
    12345,
    120000,
    2500000
  ];

  editProfile = () => {
    this.isEditingProfile = !this.isEditingProfile;
  }

  submitProfileForm = async (e: Event) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const { name, email } = data as ProfileForm;

    try {
      await this.profile.updateProfile(data as ProfileForm);
      console.log('Profile updated successfully.');
      this.isEditingProfile = false;
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again later.');
    }
  }

  enableEdit = (address: AddressForm) => {
    if (address.id && !this.isEditingAddress) {
      this.isEditingAddress = true;
      this.editingAddressId = address.id; // Set editingAddressId to the address id
    } else {
      this.isEditingAddress = false;
      this.editingAddressId = null; // Reset editingAddressId when toggling off
    }
  }

  submitAddressForm = (address: AddressForm, e: Event) => {
    e.preventDefault();
    this.isEditingAddress = false;
    this.editingAddressId = null; // set to null after submission
    // update address api endpoint not available yet
    // did all that work for nothing.......
  }

  submitNewAddressForm = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    console.log(formData);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    const { street1, street2, state, city, country, zip, phone } =
      data as AddressForm;
    console.log(
      'Submitting new address:',
      street1,
      street2,
      state,
      city,
      country,
      zip,
      phone,
    );

    try {
      await this.address.createAddress(data as AddressForm);
      console.log('Address created successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error creating address:', error);
      alert('Failed to add address. Please try again later.');
    }
  }

   deleteAddress = async (address) => {
    const addressId = address.id as string;
    if (
      confirm(
        `Are you sure you want to delete the address with ID: ${addressId}?`,
      )
    ) {
      try {
        await this.address.deleteAddress(addressId);
        console.log(`Address with ID ${addressId} deleted successfully.`);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. Please try again later.');
      }
    }
  }


  <template>
    <div>
      {{!-- <div class="min-w-fit text-white">Number: {{formatCompactNumber this.price currency='EUR'}}</div> --}}
        {{#each this.prices as |price|}}
          <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <p class="text-lg text-gray-600">Original: {{price}}</p>
            <p class="text-xl font-semibold text-blue-600">
              Formatted (EUR): {{formatCompactNumber price currency="EUR"}}
            </p>
             <p class="text-xl font-semibold text-green-600">
              Formatted (USD): {{formatCompactNumber price currency="USD"}}
            </p>
          </div>
        {{/each}}
    </div>

    <form aria-label="Edit user profile" {{on "submit" this.submitProfileForm}}>
      <div class="flex flex-row justify-between">
        <h1 class="text-2xl font-bold mb-4">Profile</h1>
        {{#if this.isEditingProfile}}
          <button
            type="submit"
            class="border rounded-lg py-2 px-4 hover:cursor-pointer hover:bg-amber-600 transition duration-500"
          >Save</button>
        {{else}}
          <button
            type="button"
            class="border rounded-lg py-2 px-4 hover:cursor-pointer hover:bg-amber-600 transition duration-500"
            {{on "click" this.editProfile}}
          >Edit</button>
        {{/if}}
      </div>

      {{#if @model}}
        {{! Info }}
        <div class="flex flex-row w-1/2 justify-between mb-5">
          <div class="flex flex-col w-1/2">
            <p class="text-gray-500 font-semibold">Name </p>
            <textarea
              id="name"
              name="name"
              rows="1"
              cols="1"
              class="font-light resize-none focus:outline-none focus:underline"
              disabled={{if this.isEditingProfile false true}}
            >{{@username}}</textarea>
          </div>
          <div class="flex flex-col w-1/2">
            <p class="text-gray-500 font-semibold">Email </p>
            <textarea
              id="email"
              name="email"
              rows="1"
              cols="1"
              class="font-light resize-none focus:outline-none focus:underline"
              disabled={{if this.isEditingProfile false true}}
            >{{@useremail}}</textarea>
          </div>
        </div>
      {{else}}
        <a href="profile">Loading profile...</a>
      {{/if}}
    </form>

    <div>
      <div class="flex flex-row justify-between">
        <h1 class="text-2xl font-bold mb-4">Address</h1>
      </div>
      {{#if @addresses}}
        {{! Address }}
        <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {{#each @addresses as |address|}}
            <form
              aria-label="Edit address for {{address.name}}"
              {{on "submit" (fn this.submitAddressForm address)}}
              class="relative w-full p-4 border rounded-2xl border-gray-300 pb-5 mb-5"
            >
              <div class="absolute top-4 right-4 flex flex-row gap-4">
                <div>{{this.editingAddressId.id}}</div>
                {{#if
                  (not (and
                    (eq this.editingAddressId address.id) this.isEditingAddress
                  ))
                }}
                  <button
                    class="hover:cursor-pointer hover:-translate-y-1 transition duration-500"
                    type="button"
                    {{on "click" (fn this.enableEdit address)}}
                  >
                    <Icon @edit={{true}} />
                  </button>
                {{/if}}
                {{#if
                  (and
                    (eq this.editingAddressId address.id) this.isEditingAddress
                  )
                }}
                  <button
                    class="hover:cursor-pointer hover:-translate-y-1 transition duration-500"
                    type="submit"
                  >
                    <Icon @confirm={{true}} />
                  </button>
                {{/if}}
                <button
                  class="hover:cursor-pointer hover:-translate-y-1 transition duration-500"
                  type="button"
                  {{on "click" (fn this.deleteAddress address)}}
                >
                  <Icon @trash={{true}} />
                </button>
              </div>
              <div class="flex flex-row w-10/12 justify-between mb-5">
                <div class="flex flex-col w-1/2">
                  <p class="text-gray-500 font-semibold">Name </p>
                  <textarea
                    id="name"
                    name="name"
                    rows="1"
                    cols="1"
                    class="font-light resize-none focus:outline-none focus:underline"
                    placeholder="John Doe"
                    disabled={{if this.isEditingAddress false true}}
                  >{{address.name}}</textarea>
                </div>
                <div class="flex flex-col w-1/2">
                  <p class="text-gray-500 font-semibold">State</p>
                  <textarea
                    id="province"
                    name="province"
                    rows="1"
                    cols="1"
                    class="font-light resize-none focus:outline-none focus:underline"
                    placeholder="CA"
                    disabled={{if this.isEditingAddress false true}}
                  >{{address.province}}</textarea>
                </div>
              </div>
              <div class="flex flex-row w-10/12 justify-between mb-5">
                <div class="flex flex-col w-1/2">
                  <p class="text-gray-500 font-semibold">Street 1</p>
                  <textarea
                    id="street1"
                    name="street1"
                    rows="1"
                    cols="1"
                    class="font-light resize-none focus:outline-none focus:underline"
                    placeholder="123 Main St"
                    disabled={{if this.isEditingAddress false true}}
                  >{{address.street1}}</textarea>
                </div>
                <div class="flex flex-col w-1/2">
                  <p class="text-gray-500 font-semibold">Country</p>
                  <select
                    id="country"
                    name="country"
                    class="font-light bg-black appearance-none"
                    disabled={{if this.isEditingAddress false true}}
                  >
                    <option value="US">US</option>
                    <option value="EU">EU</option>
                  </select>
                </div>
              </div>
              <div class="flex flex-row w-10/12 justify-between mb-5">
                <div class="flex flex-col w-1/2">
                  <p class="text-gray-500 font-semibold">Street 2</p>
                  <textarea
                    id="street2"
                    name="street2"
                    rows="1"
                    cols="1"
                    class="font-light resize-none focus:outline-none focus:underline"
                    placeholder="Apt 4B"
                    disabled={{if this.isEditingAddress false true}}
                  >{{if address.street2 address.street2 "-"}}</textarea>
                </div>
                <div class="flex flex-col w-1/2">
                  <p class="text-gray-500 font-semibold">Phone </p>
                  <textarea
                    id="phone"
                    name="phone"
                    rows="1"
                    cols="1"
                    type="number"
                    class="font-light resize-none focus:outline-none focus:underline"
                    placeholder="123-456-7890"
                    disabled={{if this.isEditingAddress false true}}
                  >{{address.phone}}</textarea>
                </div>
              </div>
              <div class="flex flex-row w-10/12 justify-between mb-5">
                <div class="flex flex-col w-1/2">
                  <p class="text-gray-500 font-semibold">City</p>
                  <textarea
                    id="city"
                    name="city"
                    rows="1"
                    cols="1"
                    class="font-light resize-none focus:outline-none focus:underline"
                    placeholder="Los Angeles"
                    disabled={{if this.isEditingAddress false true}}
                  >{{address.city}}</textarea>
                </div>
                <div class="flex flex-col w-1/2">
                  <p class="text-gray-500 font-semibold">Postal code</p>
                  <textarea
                    id="zip"
                    name="zip"
                    rows="1"
                    cols="1"
                    type="number"
                    class="font-light resize-none focus:outline-none focus:underline"
                    placeholder="90001"
                    disabled={{if this.isEditingAddress false true}}
                  >{{address.zip}}</textarea>
                </div>
              </div>
            </form>
          {{/each}}
        </div>
        {{! Add a new address }}
        <div>
          <form
            aria-label="Add new address"
            class="relative w-full p-4 pb-5 mb-5 flex flex-col gap-5"
            {{on "submit" this.submitNewAddressForm}}>

            <div class="flex flex-row w-1/2 justify-between mb-5">
              <div class="flex flex-col w-1/2">
                <p class="text-gray-500 font-semibold">Name </p>
                <input
                  id="name"
                  name="name"
                  rows="1"
                  cols="1"
                  class="font-light resize-none focus:outline-none focus:underline"
                  placeholder="John Doe"
                />
              </div>
              <div class="flex flex-col w-1/2">
                <p class="text-gray-500 font-semibold">State</p>
                <input
                  id="province"
                  name="province"
                  rows="1"
                  cols="1"
                  class="font-light resize-none focus:outline-none focus:underline"
                  placeholder="CA"
                />
              </div>
            </div>
            <div class="flex flex-row w-1/2 justify-between mb-5">
              <div class="flex flex-col w-1/2">
                <p class="text-gray-500 font-semibold">Street 1</p>
                <input
                  id="street1"
                  name="street1"
                  rows="1"
                  cols="1"
                  class="font-light resize-none focus:outline-none focus:underline"
                  placeholder="123 Main St"
                />
              </div>
              <div class="flex flex-col w-1/2">
                <p class="text-gray-500 font-semibold">Country</p>
                <select
                  id="country"
                  name="country"
                  class="font-light bg-black appearance-none"
                >
                  <option value="US">US</option>
                  <option value="EU">EU</option>
                </select>
              </div>
            </div>
            <div class="flex flex-row w-1/2 justify-between mb-5">
              <div class="flex flex-col w-1/2">
                <p class="text-gray-500 font-semibold">Street 2</p>
                <textarea
                  id="street2"
                  name="street2"
                  rows="1"
                  cols="1"
                  class="font-light resize-none focus:outline-none focus:underline"
                  placeholder="Apt 4B"
                  disabled
                ></textarea>
              </div>
              <div class="flex flex-col w-1/2">
                <p class="text-gray-500 font-semibold">Phone </p>
                <textarea
                  id="phone"
                  name="phone"
                  rows="1"
                  cols="1"
                  type="number"
                  class="font-light resize-none focus:outline-none focus:underline"
                  placeholder="123-456-7890"
                ></textarea>
              </div>
            </div>
            <div class="flex flex-row w-1/2 justify-between mb-5">
              <div class="flex flex-col w-1/2">
                <p class="text-gray-500 font-semibold">City</p>
                <textarea
                  id="city"
                  name="city"
                  rows="1"
                  cols="1"
                  class="font-light resize-none focus:outline-none focus:underline"
                  placeholder="Los Angeles"
                ></textarea>
              </div>
              <div class="flex flex-col w-1/2">
                <p class="text-gray-500 font-semibold">Postal code</p>
                <textarea
                  id="zip"
                  name="zip"
                  rows="1"
                  cols="1"
                  type="number"
                  class="font-light resize-none focus:outline-none focus:underline"
                  placeholder="90001"
                ></textarea>
              </div>
            </div>

            <div class="w-1/3 ">
              <button
                class="w-full border rounded-xl px-4 py-2 text-lg hover:bg-amber-500 hover:border-amber-500 hover:cursor-pointer hover:-translate-y-1 transition duration-500"
                type="submit"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      {{else}}
        <a href="profile">Loading profile...</a>
      {{/if}}
    </div>
  </template>
}
