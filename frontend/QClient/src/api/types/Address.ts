export type AddressId = number;

export type Address = {
  id: number;
  addressType: string;
  city: string;
  street: string;
  streetNumber: string;
  block: string;
  floor: number;
  apartment: string;
  primary: boolean;
};

export type CreatedAddress = {
  addressString: string;
  primary: boolean;
};
