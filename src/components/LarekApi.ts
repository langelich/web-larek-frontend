import { IProductItem, TOrder, TOrderResponse } from "../types";
import { settingsApi } from "../utils/constants";
import { IApi, ApiListResponse } from "./base/api";

export class LarekApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    // получить список товаров
    getProducts(): Promise<IProductItem[]> {
        return this._baseApi.get<ApiListResponse<IProductItem>>(`${settingsApi.baseUrl}`,'/product/').then((products: ApiListResponse<IProductItem>) => 
            products.items.map((item) => ({
                ...item,
                image: `${settingsApi.cdnUrl}` + item.image
            }))
        )
    }

    // оформить заказ
    createOrder(order: TOrder): Promise<TOrderResponse> {
        return this._baseApi.change<TOrderResponse>('/order', order).then((orderResponse: TOrderResponse) => orderResponse)
    }

    // получить одну карточку
    getProduct(id: string): Promise<IProductItem> {
        return this._baseApi.get<IProductItem>(`${settingsApi.baseUrl}`,`/product/${id}`).then((product: IProductItem) => 
            ({
                ...product,
                image: `${settingsApi.cdnUrl}` + product.image
            })
        );
    }
}