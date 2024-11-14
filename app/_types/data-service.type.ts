export interface NewGuest {
  fullName: string;
  email: string;
}
export interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationalID: string;
  countryFlag: string;
  nationality: string;
}
export interface Country {
  name: string;
  flag: string;
}
