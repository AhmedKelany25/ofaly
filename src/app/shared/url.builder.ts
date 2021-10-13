import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

const CHAT_API = env.chat.api;
const CHAT_WS = env.chat.ws;
const USER_API = env.userApi;
const SHOP_MNG = env.shop.management;
const SHOP_INV = env.shop.inventory;
const SHOP_POS = env.shop.pos;
const HEALTH_API = env.healthApi;

@Injectable({
  providedIn: 'root',
})
export class ChatUrlBuilder {
  constructor() {}

  user(sid: string = null): string {
    return `${CHAT_API}${this.user$(sid)}`;
  }

  channel(sid: string = null): string {
    return `${CHAT_API}${this.channel$(sid)}`;
  }

  userChannel(userSid: string, channelSid: string = null): string {
    return `${CHAT_API}${this.user$(userSid)}${this.channel$(channelSid)}`;
  }

  member(channelSid: string, memberSid: string = null): string {
    return `${CHAT_API}${this.channel$(channelSid)}${this.member$(memberSid)}`;
  }

  message(channelSid: string, messageSid: string = null): string {
    return `${CHAT_API}${this.channel$(channelSid)}${this.message$(
      messageSid
    )}`;
  }

  token(): string {
    return `${CHAT_API}/Token`;
  }

  webSocket(userSid: string): string {
    return `${CHAT_WS}/Users/${userSid}`;
  }

  private user$(sid: string = null): string {
    return `/Users${sid ? `/${sid}` : ''}`;
  }

  private channel$(sid: string = null): string {
    return `/Channels${sid ? `/${sid}` : ''}`;
  }

  private member$(sid: string = null): string {
    return `/Members${sid ? `/${sid}` : ''}`;
  }
  private message$(sid: string = null): string {
    return `/Messages${sid ? `/${sid}` : ''}`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserUrlBuilder {
  constructor() {}

  otp(): string {
    return `${USER_API}/OTP`;
  }

  token(): string {
    return `${USER_API}/Token`;
  }

  refresh(): string {
    return `${USER_API}/Refresh`;
  }

  user(sid: string = null): string {
    return `${USER_API}/Users${sid ? `/${sid}` : ''}`;
  }

  me(): string {
    return `${this.user('Me')}`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShopManagementUrlBuilder {
  constructor() {}

  company(sid: string = null) {
    return `${SHOP_MNG}${this.company$(sid)}`;
  }

  store(companySid: string, storeSid: string = null) {
    return `${this.company(companySid)}${this.store$(storeSid)}`;
  }

  user(companySid: string, sid: string = null) {
    return `${this.company(companySid)}${this.user$(sid)}`;
  }

  private company$(sid: string = null) {
    return `/Companies${sid ? `/${sid}` : ''}`;
  }

  private store$(sid: string = null) {
    return `/Stores${sid ? `/${sid}` : ''}`;
  }

  private user$(sid: string = null) {
    return `/Users${sid ? `/${sid}` : ''}`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShopInventoryUrlBuilder {
  constructor() {}

  store(storeSid: string = null) {
    return `${SHOP_INV}${this.store$(storeSid)}`;
  }

  category(storeSid: string, categorySid: string = null) {
    return `${this.store(storeSid)}${this.category$(categorySid)}`;
  }

  product(storeSid: string, productSid: string = null) {
    return `${this.store(storeSid)}${this.product$(productSid)}`;
  }

  order(storeSid: string, orderSid: string = null) {
    return `${this.store(storeSid)}${this.order$(orderSid)}`;
  }

  private store$(sid: string = null) {
    return `/Stores${sid ? `/${sid}` : ''}`;
  }

  private category$(sid: string = null) {
    return `/Categories${sid ? `/${sid}` : ''}`;
  }

  private product$(sid: string = null) {
    return `/Products${sid ? `/${sid}` : ''}`;
  }

  private order$(sid: string = null) {
    return `/Orders${sid ? `/${sid}` : ''}`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShopPOSUrlBuilder {
  constructor() {}

  store(storeSid: string = null) {
    return `${SHOP_POS}${this.store$(storeSid)}`;
  }
  category(storeSid: string, categorySid: string = null) {
    return `${this.store(storeSid)}${this.category$(categorySid)}`;
  }

  product(storeSid: string, productSid: string = null) {
    return `${this.store(storeSid)}${this.product$(productSid)}`;
  }

  order(storeSid: string, orderSid: string = null) {
    return `${this.store(storeSid)}${this.order$(orderSid)}`;
  }

  cashier(storeSid: string, cashierSid: string = null) {
    return `${this.store(storeSid)}${this.cashier$(cashierSid)}`;
  }

  return(storeSid: string, returnsSid: string = null) {
    return `${this.store(storeSid)}${this.return$(returnsSid)}`;
  }

  private store$(sid: string = null) {
    return `/Stores${sid ? `/${sid}` : ''}`;
  }

  private category$(sid: string = null) {
    return `/Categories${sid ? `/${sid}` : ''}`;
  }

  private product$(sid: string = null) {
    return `/Products${sid ? `/${sid}` : ''}`;
  }

  private order$(sid: string = null) {
    return `/Orders${sid ? `/${sid}` : ''}`;
  }

  private cashier$(sid: string = null) {
    return `/Cashiers${sid ? `/${sid}` : ''}`;
  }

  private return$(sid: string = null) {
    return `/Returns${sid ? `/${sid}` : ''}`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class HealthUrlBuilder {
  constructor() {}

  patient(sid: string = null) {
    return `${HEALTH_API}${this.patient$(sid)}`;
  }

  doctor(ptSid: string, doctorSid: string = null) {
    return `${HEALTH_API}${this.doctor$(ptSid, doctorSid)}`;
  }

  appointment(ptSid: string, appointmentSid: string) {
    return `${HEALTH_API}${this.appointment$(ptSid, appointmentSid)}`;
  }

  specialty() {
    return `${HEALTH_API}/Specialties`;
  }

  private patient$(sid: string = null): string {
    return `/Patients${sid ? `/${sid}` : ''}`;
  }

  private doctor$(ptSid: string = null, doctorSid: string = null): string {
    return `${this.patient$(ptSid)}/Doctors${doctorSid ? `/${doctorSid}` : ''}`;
  }

  private appointment$(ptSid: string = null, appointmentSid: string = null) {
    return `${this.patient$(ptSid)}/Appointments${
      appointmentSid ? `/${appointmentSid}` : ''
    }`;
  }
}
