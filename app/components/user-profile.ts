import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type CustomSessionService from 'terminal-dot-shop/services/session';
import type AddressService from 'terminal-dot-shop/services/address';
import type ProfileService from 'terminal-dot-shop/services/profile';

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
  @service router;

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

  @action
  editProfile() {
    this.isEditingProfile = !this.isEditingProfile;
  }

  @action
  async submitProfileForm(e: Event) {
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
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again later.');
    }
  }

  @action
  enableEdit(address: AddressForm) {
    if (address.id && !this.isEditingAddress) {
      this.isEditingAddress = true;
      this.editingAddressId = address.id; // Set editingAddressId to the address id
    } else {
      this.isEditingAddress = false;
      this.editingAddressId = null; // Reset editingAddressId when toggling off
    }
  }

  @action
  submitAddressForm(address: AddressForm, e: Event) {
    e.preventDefault();
    this.isEditingAddress = false;
    this.editingAddressId = null; // set to null after submission
    // update address api endpoint not available yet
    // did all that work for nothing.......
  }

  @action
  async submitNewAddressForm(e: Event) {
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
    } catch (error) {
      console.error('Error creating address:', error);
      alert('Failed to add address. Please try again later.');
    }
  }

  @action
  async deleteAddress(address) {
    const addressId = address.id as string;
    if (
      confirm(
        `Are you sure you want to delete the address with ID: ${addressId}?`,
      )
    ) {
      try {
        await this.address.deleteAddress(addressId);
        console.log(`Address with ID ${addressId} deleted successfully.`);
        this.router.refresh();
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. Please try again later.');
      }
    }
  }
}
