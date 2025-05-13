import { Address } from "src/api/types/Address";

export type NewAddress = Omit<Address, "addressType" | "primary" | "floor"> & {
  floor: string;
};
