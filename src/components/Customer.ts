import { ICustomer, ICustomerData } from "../types";
import { IEvents } from "./base/events";

export class Customer implements ICustomer {
    protected _customerData: ICustomerData = {
        email: '',
        phone: '',
        address: '',
        payment: '',
    };
    protected events: IEvents;
    protected errorsObject: Partial<Record<keyof ICustomerData, string>> = {};

    constructor(events: IEvents) {
        this.events = events;
    }

    checkValidation () {
        const errors: typeof this.errorsObject = {};

        if (!this.customerData.address) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.customerData.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if  (!this.customerData.email) {
            errors.email = 'Укажите email';
        }
        if (!this.customerData.phone)  {
            errors.phone = 'Укажите номер телефона';
        }

        this.errorsObject = errors;
        this.events.emit('customer:validation', this.errorsObject);
        return Object.keys(errors).length === 0;
    }

    get customerData () {
        return this._customerData;
    }

    setOrderData(data: Partial<ICustomerData>) {
        if (data.payment) {
            this._customerData.payment = data.payment;
        } else {
            this._customerData.address = data.address;
        }

        if (this.checkValidation()) {
            this.events.emit('customerOrder:ready', data);
        }
    }

    setContactsData(data: Partial<ICustomerData>) {
        this._customerData.phone = data.phone;
        this._customerData.email = data.email;

        if (this.checkValidation()) {
            this.events.emit('customerContacts:ready', data);
        }
    }
}
