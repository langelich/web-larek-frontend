import { ICustomer, ICustomerData } from "../types";
import { IEvents } from "./base/events";

export class Customer implements ICustomer {
    protected _customerData: ICustomerData;
    protected events: IEvents;

    constructor(events: IEvents) {
        this._customerData = {
            email: '',
            phone: '',
            address: '',
            payment: '',
        };
        this.events = events;
    }

    checkValidation (data: Record<keyof ICustomerData, string>) {
        const errors: Partial<Record<keyof ICustomerData, string>> = {};

        (!!data.payment) ? errors.payment = '' : errors.payment = 'Выберите способ оплаты';

        (!!data.address) ? errors.address = '' : errors.address = 'Укажите адрес доставки';

        (!!data.email) ? errors.email = '' : errors.email = 'Укажите email';

        (!!data.phone)? errors.phone = '' : errors.phone = 'Укажите номер телефона';

        this.events.emit('customer:validation', {errorsObject: errors, customerData: data});
        return Object.keys(data).length !== 0;
    }

    get customerData () {
        return this._customerData;
    }

    setCustomerData(data: Record<keyof ICustomerData, string>) {
        if (data.payment ?? data.address) {
            this._customerData.payment = data.payment;
            this._customerData.address = data.address;
        } else if (data.email && data.phone) {
            this._customerData.phone = data.phone;
            this._customerData.email = data.email;
        }
    }
}
