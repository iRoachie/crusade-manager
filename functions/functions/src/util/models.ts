export interface Area {
  key?: string;
  leader: string;
  cell: string;
  home: string;
  email: string;
}

export interface Contact {
  key?: string;
  name: string;
  number: string;
  areaRef?: string;
  address: string;
  cell: string;
  house: string;
  email: string;
  age: string;
  openingInvitation: boolean;
  prayerClub: boolean;
  sabbathInvitation: boolean;
}

export interface DataGroup {
  areas: Area[];
  contacts: Contact[];
}
