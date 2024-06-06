//internal dependencies
import { verifySession, getToken } from "@/services/ServerActions/Authentication";

type methodOptions = 'GET' | 'POST' | 'PUT' | 'DELETE';
type contentTypesOptions = 'json' | 'form-urlencoded';
type cacheOptions = 'force-cache' | 'no-store';
type revalidateOptions = number | 0 | false;
type tagsOptions = string[];
type bodyType = Record<string, string | number | boolean | null>;
type credentialsOptions = 'omit' | 'include';

type fetchOptions = {
    cache: cacheOptions,
    method: string,
    headers?: HeadersInit
    body?: BodyInit
    next?: {
        revalidate?: revalidateOptions,
        tags?: tagsOptions
    }
    credentials?: credentialsOptions
}

export interface sendProps {
    method: methodOptions
    url: string
    headers?: HeadersInit
    body?: bodyType
    cache?: cacheOptions
    revalidate?: revalidateOptions
    tags?: tagsOptions
    contentType?: contentTypesOptions
    credentials?: credentialsOptions
    setAuthHeader?: boolean
}

class RequestsUtils {
    //TEMP: treat errors
    //Request constants
    static readonly DEFAULT_CONTENT_TYPE: contentTypesOptions = 'form-urlencoded';
    static readonly DEFAULT_CACHE: cacheOptions = 'force-cache';

    //Request methods
    static async _get(url: string, options: fetchOptions, setAuthHeader?: boolean) {
        options.headers = await this._prepareHeader(options.headers, undefined, setAuthHeader);
        try {
            return await fetch(url, options);
        } catch (error: any) {
            if (process.env.ENV == 'DEV') {
                console.log('Error at GET at RequestUtils:');
                console.log(error);
            }
            throw error;
        }
    }

    static async _post(url: string, options: fetchOptions, body: bodyType | undefined, contentType: contentTypesOptions, setAuthHeader?: boolean) {
        options.headers = await this._prepareHeader(options.headers, contentType, setAuthHeader);
        if (body) {
            options.body = RequestsUtils._prepareBody(body, contentType);
        }
        
        try {
            return await fetch(url, options)
        } catch (error: any) {
            if (process.env.ENV == 'DEV') {
                console.log('Error at POST at RequestUtils:');
                console.log(url);
                console.log(error);
            }
            throw error;
        }
    }

    static async _put(url: string, options: fetchOptions, body: bodyType | undefined, contentType: contentTypesOptions, setAuthHeader?: boolean) {
        options.headers = await this._prepareHeader(options.headers, contentType, setAuthHeader);
        if (body) {
            options.body = RequestsUtils._prepareBody(body, contentType);
        }
        
        try {
            return await fetch(url, options)
        } catch (error: any) {
            if (process.env.ENV == 'DEV') {
                console.log('Error at POST at RequestUtils:');
                console.log(url);
                console.log(error);
            }
            throw error;
        }
    }

    static async _delete(url: string, options: fetchOptions, body: bodyType | undefined, contentType: contentTypesOptions, setAuthHeader?: boolean) {
        options.headers = await this._prepareHeader(options.headers, contentType, setAuthHeader);
        if (body) {
            options.body = RequestsUtils._prepareBody(body, contentType);
        }
        
        try {
            return await fetch(url, options)
        } catch (error: any) {
            if (process.env.ENV == 'DEV') {
                console.log('Error at DELETE at RequestUtils:');
                console.log(url);
                console.log(error);
            }
            throw error;
        }
    }

    static async _prepareHeader(header: HeadersInit |undefined, contentType: contentTypesOptions | undefined, setAuthHeader?: boolean): Promise<Headers> {
        let finalHeader = new Headers(header);

        //add authorization
        if (setAuthHeader) {
            finalHeader = await RequestsUtils._setAuthorizationHeader(finalHeader);
        }

        //add content-type
        switch(contentType) {
            case 'form-urlencoded':
                finalHeader.set('Content-Type', 'application/x-www-form-urlencoded');
                break;
            case 'json':
                finalHeader.set('Content-Type', 'application/json');
                break
        }

        return finalHeader;
    }

    static async _setAuthorizationHeader(header: Headers): Promise<Headers> {
        const sessionStatus = await verifySession();
        if (sessionStatus) {
            const token = await getToken();
            if (token != '') {
                header.set('authorization', `Bearer ${token}`);
            }
        }
        
        return header;
    }

    static _prepareBody(body: bodyType, contentType: contentTypesOptions): BodyInit {
        let formatedBody: BodyInit;
        switch(contentType) {
            case 'form-urlencoded':
                const stringifyBody: Record<string, string> = Object.fromEntries(
                    Object.entries(body).map(([key, value]) => [key, String(value)])
                )
                formatedBody = new URLSearchParams(stringifyBody).toString();
                break;
            case 'json':
                formatedBody = JSON.stringify(body);
                break;
        }

        return formatedBody;
    }

    static async send(requestOptions: sendProps) {
        //fetch options
        if (!requestOptions.cache) {
            requestOptions.cache = RequestsUtils.DEFAULT_CACHE;
        }
        const options: fetchOptions = {
            cache: requestOptions.cache,
            method: requestOptions.method,
            next: {}
        };

        if (requestOptions.headers) {
            options.headers = requestOptions.headers;
        }

        if (requestOptions.revalidate !== undefined) {
            options.next!.revalidate = requestOptions.revalidate;
        }

        if (requestOptions.tags !== undefined) {
            options.next!.tags = requestOptions.tags;
        }

        if (requestOptions.credentials !== undefined) {
            options.credentials = requestOptions.credentials;
        }
        
        let response: any
        switch(requestOptions.method) {
            case 'GET':
                response = await RequestsUtils._get(requestOptions.url, options, requestOptions.setAuthHeader);
                break;
            case 'POST':
                if (!requestOptions.contentType) {
                    requestOptions.contentType = RequestsUtils.DEFAULT_CONTENT_TYPE;
                }
                
                response = await RequestsUtils._post(requestOptions.url, options, requestOptions.body, requestOptions.contentType, requestOptions.setAuthHeader);
                break;
            case 'PUT':
                if (!requestOptions.contentType) {
                    requestOptions.contentType = RequestsUtils.DEFAULT_CONTENT_TYPE;
                }
                
                response = await RequestsUtils._put(requestOptions.url, options, requestOptions.body, requestOptions.contentType, requestOptions.setAuthHeader);
                break;
            case 'DELETE':
                if (!requestOptions.contentType) {
                    requestOptions.contentType = RequestsUtils.DEFAULT_CONTENT_TYPE;
                }
                
                response = await RequestsUtils._delete(requestOptions.url, options, requestOptions.body, requestOptions.contentType, requestOptions.setAuthHeader);
                break;
        }
        
        //TEMP: status code 404 is throwing error, not returning json.
        let data: any
        if (response.status != 204) {
            data = await response.json();
        } else {
            data = {}
        }
        
        return {status: response.status, data: data};
    }

    static getUrlParameters(url: string): Record<string, string> {
        const parameters: Record<string, string> = {};
    
        const queryString = url.split("?")[1];
    
        // If there's no query string, return an empty object
        if (!queryString) {
            return parameters;
        }
    
        // Split the query string into individual key-value pairs
        const pairs: Array<[string, string]> = queryString.split("&").map(pairStr => {
            const [key, value] = pairStr.split("=");
            return [key, decodeURIComponent(value)];
          });;
    
        // Loop through each pair and extract the key and value
        pairs.forEach(([key, value]) => {
            parameters[key] = value;
        });
    
        return parameters;
    }
}

export default RequestsUtils;