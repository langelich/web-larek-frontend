import './scss/styles.scss';

import { EventEmitter } from './components/base/events'
import { ensureElement } from './utils/utils';
import { ICustomerData, IProductItem, TOrder, TProductBase } from './types';
import { Basket } from './components/Basket';
import { Catalog } from './components/Catalog';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { MainPage } from './components/MainPage';
import { Modal } from './components/common/Modal';
import { BasketView } from './components/BasketView';
import { CardBasket, CardCatalog, CardPreview } from './components/Card';
import { ContactForm } from './components/ContactForm';
import { OrderForm } from './components/OrderForm';
import { Success } from './components/Success';
import { Customer } from './components/Customer';

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();
const api = new Api(API_URL, CDN_URL);
const larekApi = new LarekApi(api);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Модели данных
const basket = new Basket(events);
const catalog = new Catalog(events);

// Глобальные контейнеры
const mainPage = new MainPage(document.body, events);
const modal = new Modal('#modal-container', events);

const basketView = new BasketView('#basket', events);
const cardPreview = new CardPreview('#card-preview', events);
const customer = new Customer(events);
const contactForm = new ContactForm(contactTemplate, events);
const orderForm = new OrderForm(orderTemplate, events);
const success = new Success('#success', events);

// Добавление карточек на страницу
events.on('catalog:added', (items: IProductItem[]) => {
    items.forEach(item => {
        const cardCatalog = new CardCatalog('#card-catalog', events);

        mainPage.gallery = [cardCatalog.getContentElement(item)];
    })
    basketView.cardsList = [];
})

// "открыть корзину"
events.on('basketView:open', () => {
    modal.render(basketView.render());
    // basketView.cardsList = [];
})

// "открыть карточку"
events.on('card:open', (card: CardCatalog) => {
    catalog.preview = card.id;
})

// Заполнить данными открытую карточку и отрендерить в модалке
events.on('catalog:selected', (product: IProductItem) => {
    modal.render(cardPreview.getContentElement(product));

    (basket.isContain(product.id)) ? cardPreview.setButton(true) : cardPreview.setButton(false);
})

events.on('basket:change', (products: TProductBase[]) => {
    mainPage.basketCounter = basket.items.length;

    basketView.cardsList = products.map(product => {
        const cardBasket = new CardBasket('#card-basket', events);

        return cardBasket.getContentElement(product);
    });

    basketView.total = basket.total;
})

events.on('card:change', (card: {id: string}) => {
    const product: IProductItem = catalog.getItem(card.id);
    if (basket.isContain(product.id)) {
        cardPreview.setButton(false);
        basket.delete(card.id);
    } else {
        cardPreview.setButton(true);
        basket.add(product);
    }
})

// Закрыть форму успешного заказа
events.on('success:close', () => {
    modal.close();
})

// Блокируем прокрутку страницы, если открыта модалка
events.on('мodal:open', () => {
    mainPage.locked = true;
});

// ... и разблокируем
events.on('мodal:close', () => {
    mainPage.locked = false;
});

// открыть форму order
events.on('orderForm:open', () => {
    modal.render(orderForm.form);
})

// меняются данные формы order
events.on('order:change', (orderValues: Record<keyof ICustomerData, string>) => {
    customer.setOrderData(orderValues);
})

// меняются данные формы contact
events.on('contacts:change', (contactsValues: Record<keyof ICustomerData, string>) => {
    customer.setContactsData(contactsValues);
})

// меняется отображение кнопок для выбора способа оплаты
events.on('payment:change', (data: Partial<ICustomerData>) => {
    orderForm.payment = data.payment;
})

// валидация
events.on('customer:validation', (data: Record<keyof ICustomerData, string>) => {
    const { address, email, phone, payment } = data;

    orderForm.setValid(!data.address && !data.payment)
    orderForm.setError(Object.values({ address, payment }).filter(item => !!item).join('; '))

    contactForm.setValid(!data.email && !data.phone)
    contactForm.setError(Object.values({ email, phone }).filter(item => !!item).join('; '))
})

// сабмит формы order
events.on('order:submit', () => {
    modal.render(contactForm.form);
})

// отправка заказа
events.on('contacts:submit', () => {
    const order: TOrder = {
        payment: customer.customerData.payment,
        address: customer.customerData.address,
        phone: customer.customerData.phone,
        email: customer.customerData.email,
        items: basket.items.map(item => {
            if (!(item.price === null)) {
                return item.id;
            }
        }).filter(Boolean),
        total: basket.total
    };

    larekApi.createOrder(order)
        .then(result => {result
              success.total = result.total;
              modal.render(success.contentElement);
              basket.clear();
        })
        .catch(err => {
            console.error(err);
        });
})

// Загрузка карточек
larekApi.getProducts()
    .then<IProductItem[]>(products => catalog.items = products)
    .catch(err => {
        console.error(err);
    });
