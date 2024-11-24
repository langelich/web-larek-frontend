import './scss/styles.scss';

import { EventEmitter } from './components/base/events'
import { ensureElement } from './utils/utils';
import { IProductItem, TOrder, TProductBase } from './types';
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

        cardCatalog.setData(item);
        mainPage.gallery = [cardCatalog.contentElement];
    })

    mainPage.basketCounter = basket.items.length;
})

// "открыть корзину"
events.on('basketView:open', () => {
    basketView.contentElement;
    modal.render(basketView)
})

// "открыть карточку"
events.on('card:open', (card: CardCatalog) => {
    catalog.preview = card.id;
})

// Заполнить данными открытую карточку и отрендерить в модалке
events.on('catalog:selected', (item: IProductItem) => {
    larekApi.getProduct(item.id)
        .then<IProductItem>((product) => {
            cardPreview.setData(product);
            modal.render(cardPreview);

            if(basket.isContain(product.id)) {
                cardPreview.button.textContent = 'Удалить из корзины'
            } else {
                cardPreview.button.textContent = 'В корзину'
            }

            return product;
        })
        .catch(err => {
            console.error(err)  ;
        });      
})

// Изменения в корзине 
events.on('basket:add', (product: TProductBase) => {
    const cardBasket = new CardBasket('#card-basket', events);

    cardBasket.setData(product);
    basketView.cardsList = [cardBasket.contentElement];
    cardBasket.quantity = basketView.getCardsList().childElementCount;

    events.on('basket:delete', (product: {id: string}) => {
        if (cardBasket.id === product.id) {
            cardBasket.contentElement.remove();
        }
        basketView.total = basket.total;
        cardBasket.quantity = basketView.getCardsList().childElementCount;

        basketView.setActive();
        mainPage.basketCounter = basket.items.length;  
    })

    basketView.total = basket.total;
    basketView.setActive();
    mainPage.basketCounter = basket.items.length;
})


// "удалить из корзины"
events.on('card:delete', (card: {id: string}) => {
    basket.delete(card.id);

    cardPreview.id === card.id ? cardPreview.button.textContent = 'Удалить из корзины' : 
        cardPreview.button.textContent = 'В корзину'
})

// Обработка добавления/удаления карточки
events.on('card:change', (card: {id: string}) => {
    const item: IProductItem = catalog.getItem(card.id);
    
    if(basket.isContain(card.id)) {
        basket.delete(card.id);
    } else {
        basket.add(item);
    }
})

// Открыть форму заказа
events.on('order:open', () => {
    modal.render(orderForm);
})

// Открыть форму контактов
events.on('contacts:open', () => {
    modal.render(contactForm);
})

// Открыть форму успешно оформленного заказа
events.on('success:open', () => {
    modal.render(success);
    success.total = basket.total;
})

// Закрыть форму успешного заказа
events.on('success:close', () => {
    modal.close();

    contactForm.email = '';
    contactForm.phone = ''
    orderForm.address = '';
    basket.clear();
    basketView.total = 0;
    basketView.removeBasket();
    mainPage.basketCounter = 0;
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
events.on('order:submit', (valueOrder: {payment: string, address: string}) => {
    
    events.on('contacts:submit', (valuContacts: {email: string, phone: string}) => {

        let items: Record<string, string[]> = {};
        basket.items.forEach(item => {
            return items["items"] = [item.id];
        });

        let total: Record<string, number> = {};
        total['total'] = basket.total;

        valueOrder.payment = 'online';
        const orderObject: TOrder = Object.assign({}, valuContacts, valueOrder, items, total);

        larekApi.createOrder(orderObject)
            .then(result => result)
            .catch(err => {
                console.error(err);
            });
        })
})

// Загрузка карточек
larekApi.getProducts()
    .then<IProductItem[]>(products => catalog.items = products)
    .catch(err => {
        console.error(err);
    });
    

