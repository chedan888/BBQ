export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface MenuData {
  categories: string[];
  items: MenuItem[];
}

export enum ViewState {
  MENU = 'MENU',
  BILL = 'BILL',
  ADMIN = 'ADMIN'
}
