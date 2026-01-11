import {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	NodeApiError,
} from 'n8n-workflow';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAccessToken(this: IExecuteFunctions): Promise<string> {
	const now = Date.now();
	
	// Return cached token if still valid
	if (cachedToken && now < tokenExpiry) {
		return cachedToken;
	}

	const credentials = await this.getCredentials('kalshiApi');
	const environment = credentials.environment as string;
	const baseUrl = environment === 'production' 
		? 'https://api.elections.kalshi.com/' 
		: 'https://demo-api.kalshi.co';

	// Login to get token
	const loginOptions: IRequestOptions = {
		method: 'POST',
		body: {
			email: credentials.email,
			password: credentials.password,
		},
		uri: `${baseUrl}/trade-api/v2/login`,
		json: true,
	};

	try {
		const response = await this.helpers.request(loginOptions);
		cachedToken = response.token;
		
		// Set token to expire in 55 minutes (tokens typically last 1 hour)
		tokenExpiry = now + (55 * 60 * 1000);
		
		return cachedToken as string;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
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
	const baseUrl = environment === 'production' 
		? 'https://api.kalshi.com' 
		: 'https://demo-api.kalshi.co';

	const token = await getAccessToken.call(this);

	const options: IRequestOptions = {
		method,
		body,
		qs,
		uri: `${baseUrl}${endpoint}`,
		json: true,
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};

	// Remove empty body for GET/DELETE requests
	if ((method === 'GET' || method === 'DELETE') && Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.request(options);
	} catch (error) {
		// If token expired, try to get a new one and retry
		if (error.statusCode === 401) {
			cachedToken = null;
			tokenExpiry = 0;
			const newToken = await getAccessToken.call(this);
			options.headers!.Authorization = `Bearer ${newToken}`;
			
			try {
				return await this.helpers.request(options);
			} catch (retryError) {
				throw new NodeApiError(this.getNode(), retryError as Error);
			}
		}
		throw new NodeApiError(this.getNode(), error as Error);
	}
}

export async function kalshiApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any[]> {
	const returnData: IDataObject[] = [];
	let cursor: string | undefined;

	do {
		if (cursor) {
			qs.cursor = cursor;
		}

		const responseData = await kalshiApiRequest.call(this, method, endpoint, body, qs);
		
		// Handle different response structures
		if (responseData.markets) {
			returnData.push(...responseData.markets);
		} else if (responseData.events) {
			returnData.push(...responseData.events);
		} else if (responseData.orders) {
			returnData.push(...responseData.orders);
		} else if (responseData.positions) {
			returnData.push(...responseData.positions);
		} else if (responseData.fills) {
			returnData.push(...responseData.fills);
		} else {
			returnData.push(responseData);
		}

		cursor = responseData.cursor;
	} while (cursor);

	return returnData;
}
