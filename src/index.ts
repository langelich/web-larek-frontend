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

const contactForm = new ContactForm(contactTemplate, events);
const orderForm = new OrderForm(orderTemplate, events);
const success = new Success('#success', events);

// Добавление карточек на страницу
events.on('catalog:added', (items: IProductItem[]) => {
    items.forEach(item => {
        const cardCatalog = new CardCatalog('#card-catalog', events);

        mainPage.gallery = [cardCatalog.getContentElement(item)];
    })
})

// "открыть корзину"
events.on('basketView:open', () => {
    basketView.total = basket.total;
    modal.render(basketView.render())
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

    basketView.cardsList = products.map(product => {
        const cardBasket = new CardBasket('#card-basket', events);

        return cardBasket.getContentElement(product);
    });

    basketView.total = basket.total;
    mainPage.basketCounter = basket.items.length;
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

// формирование заказа
events.on('basketView:order', () => {
    modal.render(orderForm.form);
    basket.order.total = basket.total;

    basket.items.forEach(item => {
        if (!(item.price === null)) {
            basket.order.items = [item.id];
        };
    });
})

events.on('order:click', (pay: {payment: string}) => {
    orderForm.payment = pay.payment;

    basket.order.payment = pay.payment;
})

events.on(`order:submit`, (valueOrder: {address: string}) => {
    modal.render(contactForm.form)
    basket.order.address = valueOrder.address;
})

events.on(`contacts:submit`, (valueContacts: {email: string, phone: string}) => {
    basket.order.email = valueContacts.email;
    basket.order.phone = valueContacts.phone;

    larekApi.createOrder(basket.order)
        .then(result => {result
            success.total = result.total;
            modal.render(success.contentElement);
            basketView.removeBasket();
            basket.clear();
            mainPage.basketCounter = basket.items.length;
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
