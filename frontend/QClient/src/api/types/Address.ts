export type AddressId = number;

export type Address = {
  id: number;
  addressType: string;
  addressString: string;
  primary: boolean;
};

export type CreatedAddress = {
  addressString: string;
  primary: boolean;
};
