import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

interface ProfileForm {
  name: string,
   email: string,
  street: string,
  state: string,
  city: string,
  country: string,
  postalCode: string,
  phone: string | null,
}

export default class UserProfileComponent extends Component {
  @service session;

  @tracked isEditing: boolean = false;
  @tracked name: string = '';
  @tracked email: string = '';
  @tracked street: string = '';
  @tracked state: string = '';
  @tracked city: string = '';
  @tracked country: string = '';
  @tracked postalCode: string = '';
  @tracked phone: string | null = null;


  @action
  edit() {
    this.isEditing = !this.isEditing;
  }

  @action
  submit(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    const { name, email, street, state, city, country, postalCode, phone  } = data as ProfileForm;
    console.log('Form data: ', name, email, street, state, city, country, postalCode, phone)

    this.isEditing = false;
  }
}
