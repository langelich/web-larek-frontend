export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    baseUrl: string;
    get<T>(url: string, uri: string): Promise<T>;
    change<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export class Api implements IApi {
    readonly baseUrl: string;
    readonly cdnUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, cdnUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.cdnUrl = cdnUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get<T>(url: string, uri: string) {
        return fetch(url + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    change<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}
