import { Injectable } from '@angular/core';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'almoco' | 'bebidas' | 'lanches';
  price: number;
  available: boolean;
}

export interface UserAccount {
  name: string;
  email: string;
  password: string;
}

export interface AccountOrder {
  items: MenuItem[];
  paid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  currentUser: { name: string; email: string } | null = null;
  isAdminLogged = false;
  menuItems: MenuItem[] = [];
  users: UserAccount[] = [];
  adminUsername = 'admin';
  adminPassword = 'admin';
  private authStorageKey = 'acantosAuth';
  private cartStorageKey = 'acantosCartByUser';
  private accountOrdersStorageKey = 'acantosAccountOrders';
  private cartByUser: Record<string, MenuItem[]> = {};
  private accountOrders: Record<string, AccountOrder> = {};

  constructor() {
    this.menuItems = this.getStoredMenuItems();
    this.users = this.getStoredUsers();
    this.loadAuthState();
    this.loadCartState();
    this.loadAccountOrders();
  }

  private getStoredMenuItems(): MenuItem[] {
    const stored = localStorage.getItem('acantosMenuItems');
    if (stored) {
      return JSON.parse(stored);
    }

    const defaults: MenuItem[] = [
      { id: this.generateId(), name: 'Prato executivo', description: 'Arroz, salada e opção de carne ou peixe.', category: 'almoco', price: 34.9, available: true },
      { id: this.generateId(), name: 'Hambúrguer artesanal', description: 'Pão brioche, carne, queijo e molho da casa.', category: 'lanches', price: 29.9, available: true },
      { id: this.generateId(), name: 'Caipirinha', description: 'Limão, cachaça e açúcar com opção de frutas.', category: 'bebidas', price: 22, available: true }
    ];

    localStorage.setItem('acantosMenuItems', JSON.stringify(defaults));
    return defaults;
  }

  private saveMenuItems(): void {
    localStorage.setItem('acantosMenuItems', JSON.stringify(this.menuItems));
  }

  private getStoredUsers(): UserAccount[] {
    const stored = localStorage.getItem('acantosBarUsers');
    return stored ? JSON.parse(stored) : [];
  }

  private saveUsers(): void {
    localStorage.setItem('acantosBarUsers', JSON.stringify(this.users));
  }

  generateId(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  private generateGuestEmail(): string {
    return `convidado-${Math.random().toString(36).slice(2, 8)}@guest`;
  }

  private saveCartState(): void {
    localStorage.setItem(this.cartStorageKey, JSON.stringify(this.cartByUser));
  }

  private loadCartState(): void {
    const stored = localStorage.getItem(this.cartStorageKey);
    if (!stored) {
      return;
    }

    try {
      this.cartByUser = JSON.parse(stored) || {};
    } catch {
      this.cartByUser = {};
      localStorage.removeItem(this.cartStorageKey);
    }
  }

  private saveAccountOrders(): void {
    localStorage.setItem(this.accountOrdersStorageKey, JSON.stringify(this.accountOrders));
  }

  private loadAccountOrders(): void {
    const stored = localStorage.getItem(this.accountOrdersStorageKey);
    if (!stored) {
      return;
    }

    try {
      this.accountOrders = JSON.parse(stored) || {};
    } catch {
      this.accountOrders = {};
      localStorage.removeItem(this.accountOrdersStorageKey);
    }
  }

  private saveAuthState(): void {
    const authData = {
      currentUser: this.currentUser,
      isAdminLogged: this.isAdminLogged
    };
    localStorage.setItem(this.authStorageKey, JSON.stringify(authData));
  }

  private loadAuthState(): void {
    const stored = localStorage.getItem(this.authStorageKey);
    if (!stored) {
      return;
    }

    try {
      const authData = JSON.parse(stored);
      if (authData?.currentUser) {
        this.currentUser = authData.currentUser;
        this.isAdminLogged = !!authData.isAdminLogged;
      }
    } catch {
      localStorage.removeItem(this.authStorageKey);
    }
  }

  login(loginValue: string, password: string): boolean {
    if (loginValue === this.adminUsername && password === this.adminPassword) {
      this.currentUser = { name: 'Administrador', email: 'admin' };
      this.isAdminLogged = true;
      this.saveAuthState();
      return true;
    }

    const normalizedLogin = loginValue.trim().toLowerCase();
    const foundUser = this.users.find(
      (user) => user.email.toLowerCase() === normalizedLogin && user.password === password
    );

    if (foundUser) {
      this.currentUser = { name: foundUser.name, email: foundUser.email };
      this.isAdminLogged = false;
      this.saveAuthState();
      return true;
    }

    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName || !normalizedEmail || !password) {
      return false;
    }

    let existingUser = this.users.find((user) => user.email.toLowerCase() === normalizedEmail);
    if (!existingUser) {
      existingUser = { name: trimmedName, email: normalizedEmail, password };
      this.users.push(existingUser);
      this.saveUsers();
    }

    this.currentUser = { name: existingUser.name, email: existingUser.email };
    this.isAdminLogged = false;
    this.saveAuthState();
    return true;
  }

  guestLogin(name: string): boolean {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return false;
    }

    this.currentUser = { name: trimmedName, email: this.generateGuestEmail() };
    this.isAdminLogged = false;
    this.saveAuthState();
    return true;
  }

  logout(): void {
    this.currentUser = null;
    this.isAdminLogged = false;
    localStorage.removeItem(this.authStorageKey);
  }

  getCartItems(): MenuItem[] {
    if (!this.currentUser) {
      return [];
    }

    return this.cartByUser[this.currentUser.email] || [];
  }

  getAccountItemsForCurrent(): MenuItem[] {
    if (!this.currentUser) {
      return [];
    }

    return this.accountOrders[this.currentUser.email]?.items || [];
  }

  getCurrentAccountPaidStatus(): boolean {
    if (!this.currentUser) {
      return false;
    }

    return this.accountOrders[this.currentUser.email]?.paid || false;
  }

  addToCart(item: MenuItem): void {
    if (!this.currentUser) {
      return;
    }

    const email = this.currentUser.email;
    const currentCart = this.cartByUser[email] || [];
    this.cartByUser[email] = [...currentCart, { ...item }];
    this.saveCartState();
  }

  removeFromCart(item: MenuItem): void {
    if (!this.currentUser) {
      return;
    }

    const email = this.currentUser.email;
    const currentCart = this.cartByUser[email] || [];
    const itemIndex = currentCart.findIndex((cartItem) => cartItem.id === item.id);

    if (itemIndex >= 0) {
      currentCart.splice(itemIndex, 1);
      this.cartByUser[email] = [...currentCart];
      this.saveCartState();
    }
  }

  payCart(): void {
    if (!this.currentUser) {
      return;
    }

    this.cartByUser[this.currentUser.email] = [];
    this.saveCartState();
  }

  payCartItem(item: MenuItem): void {
    this.removeFromCart(item);
  }

  clearCart(): void {
    if (!this.currentUser) {
      return;
    }

    this.cartByUser[this.currentUser.email] = [];
    this.saveCartState();
  }

  addToAccount(item: MenuItem): void {
    if (!this.currentUser) {
      return;
    }

    const email = this.currentUser.email;
    const account = this.accountOrders[email] || { items: [], paid: false };
    account.items = [...account.items, { ...item }];
    account.paid = false;
    this.accountOrders[email] = account;
    this.saveAccountOrders();
  }

  addCartItemToAccount(item: MenuItem): void {
    this.addToAccount(item);
    this.removeFromCart(item);
  }

  setAccountPaidStatus(email: string, paid: boolean): void {
    if (!this.isAdminLogged) {
      return;
    }

    const account = this.accountOrders[email];
    if (!account) {
      return;
    }

    this.accountOrders[email] = { ...account, paid };
    this.saveAccountOrders();
  }

  getAllAccountSummaries(): { name: string; email: string; type: string; accountItems: MenuItem[]; paid: boolean }[] {
    const accountKeys = new Set<string>([
      ...Object.keys(this.accountOrders),
      ...this.users.map((user) => user.email)
    ]);

    return Array.from(accountKeys)
      .filter((email) => email !== 'admin')
      .map((email) => {
      const user = this.users.find((storedUser) => storedUser.email === email);
      const isAdmin = email === 'admin';
      const account = this.accountOrders[email] || { items: [], paid: false };
      return {
        name: user?.name ?? (email.startsWith('convidado-') ? 'Convidado' : email),
        email,
        type: isAdmin ? 'Administrador' : 'Cliente',
        accountItems: account.items,
        paid: account.paid
      };
    });
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getVisibleMenuItems(category: 'almoco' | 'bebidas' | 'lanches'): MenuItem[] {
    return this.menuItems.filter((item) => item.available && item.category === category);
  }

  addMenuItem(item: MenuItem): void {
    this.menuItems.push(item);
    this.saveMenuItems();
  }

  deleteMenuItem(id: string): void {
    this.menuItems = this.menuItems.filter((item) => item.id !== id);
    this.saveMenuItems();
  }

  toggleItemAvailability(id: string): void {
    const item = this.menuItems.find((menuItem) => menuItem.id === id);
    if (item) {
      item.available = !item.available;
      this.saveMenuItems();
    }
  }
}
