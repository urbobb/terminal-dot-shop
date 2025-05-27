export interface Profile {
  id: string;
  email: string;
  name?: string;
}

export interface Address {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
  created?: string,
  id: string,
}
