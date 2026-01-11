import {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	NodeApiError,
} from 'n8n-workflow';

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getAccessToken(this: IExecuteFunctions): Promise<string> {
	const now = Date.now();

	if (cachedToken && now < tokenExpiry) {
		return cachedToken;
	}

	const credentials = await this.getCredentials('kalshiApi');
	const environment = credentials.environment as string;

	const baseUrl =
		environment === 'production'
			? 'https://api.elections.kalshi.com/'
			: 'https://demo-api.kalshi.co';

	const loginOptions: IRequestOptions = {
		method: 'POST',
		uri: `${baseUrl}/trade-api/v2/login`,
		json: true,
		body: {
			email: credentials.email,
			password: credentials.password,
		},
	};

	try {
		const response = await this.helpers.request(loginOptions);

		cachedToken = response.token;
		tokenExpiry = now + 55 * 60 * 1000;

		return cachedToken!;
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), {
			message: error?.message || String(error),
		});
	}
}

export async function kalshiApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('kalshiApi');
	const environment = credentials.environment as string;

	const baseUrl =
		environment === 'production'
			? 'https://api.elections.kalshi.com/'
			: 'https://demo-api.kalshi.co';

	const token = await getAccessToken.call(this);

	const options: IRequestOptions = {
		method,
		uri: `${baseUrl}${endpoint}`,
		json: true,
		qs,
		body,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};

	if ((method === 'GET' || method === 'DELETE') && Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.request(options);
	} catch (error: any) {
		if (error?.statusCode === 401) {
			cachedToken = null;
			tokenExpiry = 0;

			const newToken = await getAccessToken.call(this);
			options.headers!.Authorization = `Bearer ${newToken}`;

			try {
				return await this.helpers.request(options);
			} catch (retryError: any) {
				throw new NodeApiError(this.getNode(), {
					message: retryError?.message || String(retryError),
				});
			}
		}

		throw new NodeApiError(this.getNode(), {
			message: error?.message || String(error),
		});
	}
}

export async function kalshiApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let cursor: string | undefined;

	do {
		if (cursor) qs.cursor = cursor;

		const responseData = await kalshiApiRequest.call(this, method, endpoint, body, qs);

		if (responseData.markets) returnData.push(...responseData.markets);
		else if (responseData.events) returnData.push(...responseData.events);
		else if (responseData.orders) returnData.push(...responseData.orders);
		else if (responseData.positions) returnData.push(...responseData.positions);
		else if (responseData.fills) returnData.push(...responseData.fills);
		else returnData.push(responseData);

		cursor = responseData.cursor;
	} while (cursor);

	return returnData;
}
