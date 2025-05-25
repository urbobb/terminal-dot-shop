import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

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
}

export default class UserProfileComponent extends Component {
  @service session;
  @service address;
  @service router;

  @tracked isEditingProfile: boolean = false;
  @tracked isEditingAddress: boolean = false;
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
  submitProfileForm(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    console.log(formData);
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const { name, email } = data as ProfileForm;

    this.isEditingProfile = false;
  }

  @action
  editAddress(e: Event) {
    this.isEditingAddress = !this.isEditingAddress;
    // const form = e.target as HTMLFormElement;
    // const formData = new FormData(form);
    // console.log(formData);
    // // Logic to edit address
    // console.log('Edit address action triggered');
  }

  @action
  submitAddressForm(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    console.log(formData);
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const { street } = data as AddressForm;

    this.isEditingAddress = false;
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
      console.error('Error deleting address:', error);
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
