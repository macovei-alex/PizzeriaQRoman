import { Coordinates } from "./Location";

export type RestaurantConstants = {
  address: string;
  location: Coordinates;
  email: string;
  phoneNumber: string;
  minimumOrderValue: number;
  hours: string[];
};
