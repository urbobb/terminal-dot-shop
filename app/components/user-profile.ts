import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

interface ProfileForm {
  name: string,
  email: string,
}

interface AddressForm {
  street: string,
  state: string,
  city: string,
  country: string,
  postalCode: string,
  phone: string | null,
}

export default class UserProfileComponent extends Component {
  @service session;

  @tracked isEditingProfile: boolean = false;
  @tracked isEditingAddress: boolean = false;
  @tracked name: string = '';
  @tracked email: string = '';
  @tracked street: string = '';
  @tracked state: string = '';
  @tracked city: string = '';
  @tracked country: string = '';
  @tracked postalCode: string = '';
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
    console.log(formData)
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    const { name, email  } = data as ProfileForm;
    console.log('Form data: ', name, email);

    this.isEditingProfile = false;
  }

  @action
  editAddress() {
    this.isEditingAddress = !this.isEditingAddress;
  }

  @action
  submitAddressForm(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    const { street } = data as AddressForm;
    console.log("Form Data: ", street)

    this.isEditingAddress = false;

  }
}
