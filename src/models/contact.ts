export interface ICreateContact {
  name: string;
  cellNumber: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface IContact extends ICreateContact {
  id: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateContactPayload {
  name?: string;
  cellNumber?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface IUpdateContact {
  name: string;
  slug: string;
  cellNumber: string;
  city: string;
  state: string;
  zipCode: string;
  updatedAt: string;
}

export interface IContactListResponse {
  contacts: any[];
  itemsReturned: number;
  nextPageToken?: any;
}

export interface IPaginationQuery {
  id?: string;
  size: number;
  nextPageToken?: string;
}
