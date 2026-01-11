import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class Kalshi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kalshi',
		name: 'kalshi',
		icon: 'file:kalshi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Kalshi prediction markets API',
		defaults: {
			name: 'Kalshi',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'kalshiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Market',
						value: 'market',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Portfolio',
						value: 'portfolio',
					},
					{
						name: 'Exchange',
						value: 'exchange',
					},
					{
						name: 'Series',
						value: 'series',
					},
				],
				default: 'market',
			},

			// Market Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['market'],
					},
				},
				options: [
					{
						name: 'Get Markets',
						value: 'getMarkets',
						description: 'Retrieve multiple markets with filters',
						action: 'Get markets',
					},
					{
						name: 'Get Market',
						value: 'getMarket',
						description: 'Get a specific market by ticker',
						action: 'Get a market',
					},
					{
						name: 'Get Market Orderbook',
						value: 'getOrderbook',
						description: 'Get orderbook for a market',
						action: 'Get market orderbook',
					},
					{
						name: 'Get Market Candlesticks',
						value: 'getCandlesticks',
						description: 'Get candlestick data for a market',
						action: 'Get market candlesticks',
					},
					{
						name: 'Get Trades',
						value: 'getTrades',
						description: 'Get recent trades for a market',
						action: 'Get market trades',
					},
					{
						name: 'Batch Get Candlesticks',
						value: 'batchGetCandlesticks',
						description: 'Get candlesticks for multiple markets',
						action: 'Batch get candlesticks',
					},
				],
				default: 'getMarkets',
			},

			// Event Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
					{
						name: 'Get Events',
						value: 'getEvents',
						description: 'Retrieve multiple events',
						action: 'Get events',
					},
					{
						name: 'Get Event',
						value: 'getEvent',
						description: 'Get a specific event',
						action: 'Get an event',
					},
					{
						name: 'Get Event Metadata',
						value: 'getEventMetadata',
						description: 'Get metadata for an event',
						action: 'Get event metadata',
					},
					{
						name: 'Get Event Candlesticks',
						value: 'getEventCandlesticks',
						description: 'Get candlestick data for an event',
						action: 'Get event candlesticks',
					},
				],
				default: 'getEvents',
			},

			// Order Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Create Order',
						value: 'createOrder',
						description: 'Place a new order',
						action: 'Create an order',
					},
					{
						name: 'Get Orders',
						value: 'getOrders',
						description: 'Get your orders',
						action: 'Get orders',
					},
					{
						name: 'Get Order',
						value: 'getOrder',
						description: 'Get a specific order',
						action: 'Get an order',
					},
					{
						name: 'Cancel Order',
						value: 'cancelOrder',
						description: 'Cancel an existing order',
						action: 'Cancel an order',
					},
					{
						name: 'Batch Create Orders',
						value: 'batchCreateOrders',
						description: 'Create multiple orders at once',
						action: 'Batch create orders',
					},
					{
						name: 'Batch Cancel Orders',
						value: 'batchCancelOrders',
						description: 'Cancel multiple orders at once',
						action: 'Batch cancel orders',
					},
					{
						name: 'Amend Order',
						value: 'amendOrder',
						description: 'Modify an existing order',
						action: 'Amend an order',
					},
					{
						name: 'Decrease Order',
						value: 'decreaseOrder',
						description: 'Decrease order quantity',
						action: 'Decrease an order',
					},
				],
				default: 'getOrders',
			},

			// Portfolio Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['portfolio'],
					},
				},
				options: [
					{
						name: 'Get Balance',
						value: 'getBalance',
						description: 'Get account balance',
						action: 'Get balance',
					},
					{
						name: 'Get Positions',
						value: 'getPositions',
						description: 'Get current positions',
						action: 'Get positions',
					},
					{
						name: 'Get Fills',
						value: 'getFills',
						description: 'Get order fills',
						action: 'Get fills',
					},
					{
						name: 'Get Settlements',
						value: 'getSettlements',
						description: 'Get settlement history',
						action: 'Get settlements',
					},
				],
				default: 'getBalance',
			},

			// Exchange Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['exchange'],
					},
				},
				options: [
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get exchange status',
						action: 'Get exchange status',
					},
					{
						name: 'Get Announcements',
						value: 'getAnnouncements',
						description: 'Get exchange announcements',
						action: 'Get announcements',
					},
					{
						name: 'Get Schedule',
						value: 'getSchedule',
						description: 'Get exchange schedule',
						action: 'Get schedule',
					},
				],
				default: 'getStatus',
			},

			// Series Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['series'],
					},
				},
				options: [
					{
						name: 'Get Series List',
						value: 'getSeriesList',
						description: 'Get list of series',
						action: 'Get series list',
					},
					{
						name: 'Get Series',
						value: 'getSeries',
						description: 'Get a specific series',
						action: 'Get a series',
					},
				],
				default: 'getSeriesList',
			},

			// Market Ticker (for specific market operations)
			{
				displayName: 'Market Ticker',
				name: 'ticker',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['market'],
						operation: ['getMarket', 'getOrderbook', 'getCandlesticks', 'getTrades'],
					},
				},
				default: '',
				placeholder: 'INXD-23DEC29-T4100',
				description: 'The market ticker symbol',
			},

			// Event Ticker
			{
				displayName: 'Event Ticker',
				name: 'eventTicker',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getEvent', 'getEventMetadata', 'getEventCandlesticks'],
					},
				},
				default: '',
				placeholder: 'INXD-23DEC29',
				description: 'The event ticker symbol',
			},

			// Series Ticker
			{
				displayName: 'Series Ticker',
				name: 'seriesTicker',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['series'],
						operation: ['getSeries'],
					},
				},
				default: '',
				description: 'The series ticker symbol',
			},

			// Order ID
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getOrder', 'cancelOrder', 'amendOrder', 'decreaseOrder'],
					},
				},
				default: '',
				description: 'The order ID',
			},

			// Get Markets Filters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['market'],
						operation: ['getMarkets'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 1000,
						},
						default: 100,
						description: 'Number of results per page (max 1000)',
					},
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
						description: 'Pagination cursor from previous response',
					},
					{
						displayName: 'Event Ticker',
						name: 'event_ticker',
						type: 'string',
						default: '',
						description: 'Filter by event ticker (comma-separated for multiple)',
					},
					{
						displayName: 'Series Ticker',
						name: 'series_ticker',
						type: 'string',
						default: '',
						description: 'Filter by series ticker',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Unopened',
								value: 'unopened',
							},
							{
								name: 'Open',
								value: 'open',
							},
							{
								name: 'Paused',
								value: 'paused',
							},
							{
								name: 'Closed',
								value: 'closed',
							},
							{
								name: 'Settled',
								value: 'settled',
							},
						],
						default: '',
						description: 'Filter by market status',
					},
					{
						displayName: 'Tickers',
						name: 'tickers',
						type: 'string',
						default: '',
						description: 'Comma-separated list of market tickers',
					},
					{
						displayName: 'Min Close Timestamp',
						name: 'min_close_ts',
						type: 'number',
						default: 0,
						description: 'Filter markets that close after this Unix timestamp',
					},
					{
						displayName: 'Max Close Timestamp',
						name: 'max_close_ts',
						type: 'number',
						default: 0,
						description: 'Filter markets that close before this Unix timestamp',
					},
				],
			},

			// Create Order Fields
			{
				displayName: 'Ticker',
				name: 'orderTicker',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['createOrder'],
					},
				},
				default: '',
				placeholder: 'INXD-23DEC29-T4100',
				description: 'Market ticker for the order',
			},
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['createOrder'],
					},
				},
				options: [
					{
						name: 'Buy',
						value: 'buy',
					},
					{
						name: 'Sell',
						value: 'sell',
					},
				],
				default: 'buy',
				description: 'Whether to buy or sell',
			},
			{
				displayName: 'Side',
				name: 'side',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['createOrder'],
					},
				},
				options: [
					{
						name: 'Yes',
						value: 'yes',
					},
					{
						name: 'No',
						value: 'no',
					},
				],
				default: 'yes',
				description: 'Yes or No side of the market',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['createOrder'],
					},
				},
				options: [
					{
						name: 'Market',
						value: 'market',
					},
					{
						name: 'Limit',
						value: 'limit',
					},
				],
				default: 'limit',
				description: 'Order type',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['createOrder'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Number of contracts',
			},
			{
				displayName: 'Yes Price (cents)',
				name: 'yesPrice',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['createOrder'],
						type: ['limit'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 99,
				},
				default: 50,
				description: 'Limit price in cents (1-99). For example, 45 = 45 cents = 45% probability.',
			},
			{
				displayName: 'Order Options',
				name: 'orderOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['createOrder'],
					},
				},
				options: [
					{
						displayName: 'Client Order ID',
						name: 'client_order_id',
						type: 'string',
						default: '',
						description: 'Custom order identifier for your records',
					},
					{
						displayName: 'Expiration Timestamp',
						name: 'expiration_ts',
						type: 'number',
						default: 0,
						description: 'Unix timestamp for order expiration (0 = no expiration)',
					},
				],
			},

			// Batch Create Orders
			{
				displayName: 'Orders',
				name: 'batchOrders',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['batchCreateOrders'],
					},
				},
				default: '[\n  {\n    "ticker": "MARKET-TICKER",\n    "action": "buy",\n    "side": "yes",\n    "type": "limit",\n    "count": 1,\n    "yes_price": 50\n  }\n]',
				description: 'Array of order objects to create',
			},

			// Batch Cancel Orders
			{
				displayName: 'Order IDs',
				name: 'batchOrderIds',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['batchCancelOrders'],
					},
				},
				default: '',
				placeholder: 'order-id-1,order-id-2,order-id-3',
				description: 'Comma-separated list of order IDs to cancel',
			},

			// Amend Order Fields
			{
				displayName: 'New Count',
				name: 'newCount',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['amendOrder'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'New number of contracts',
			},
			{
				displayName: 'New Price (cents)',
				name: 'newPrice',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['amendOrder'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 99,
				},
				default: 50,
				description: 'New limit price in cents',
			},

			// Decrease Order Fields
			{
				displayName: 'Decrease By',
				name: 'decreaseBy',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['decreaseOrder'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Amount to decrease the order by',
			},

			// Candlestick Parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['market'],
						operation: ['getCandlesticks'],
					},
				},
				options: [
					{
						displayName: 'Start Timestamp',
						name: 'start_ts',
						type: 'number',
						default: 0,
						description: 'Start time as Unix timestamp',
					},
					{
						displayName: 'End Timestamp',
						name: 'end_ts',
						type: 'number',
						default: 0,
						description: 'End time as Unix timestamp',
					},
					{
						displayName: 'Period (minutes)',
						name: 'period_interval',
						type: 'number',
						default: 1,
						description: 'Candlestick period in minutes',
					},
				],
			},

			// Get Orders Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['getOrders'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Maximum number of orders to return',
					},
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
						description: 'Pagination cursor from previous response',
					},
					{
						displayName: 'Ticker',
						name: 'ticker',
						type: 'string',
						default: '',
						description: 'Filter by market ticker',
					},
					{
						displayName: 'Event Ticker',
						name: 'event_ticker',
						type: 'string',
						default: '',
						description: 'Filter by event ticker',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Resting',
								value: 'resting',
							},
							{
								name: 'Canceled',
								value: 'canceled',
							},
							{
								name: 'Executed',
								value: 'executed',
							},
						],
						default: '',
						description: 'Filter by order status',
					},
				],
			},

			// Get Positions Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['portfolio'],
						operation: ['getPositions'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Maximum number of positions to return',
					},
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
						description: 'Pagination cursor',
					},
					{
						displayName: 'Event Ticker',
						name: 'event_ticker',
						type: 'string',
						default: '',
						description: 'Filter by event ticker',
					},
					{
						displayName: 'Ticker',
						name: 'ticker',
						type: 'string',
						default: '',
						description: 'Filter by market ticker',
					},
					{
						displayName: 'Settlement Status',
						name: 'settlement_status',
						type: 'options',
						options: [
							{
								name: 'Settled',
								value: 'settled',
							},
							{
								name: 'Unsettled',
								value: 'unsettled',
							},
						],
						default: '',
						description: 'Filter by settlement status',
					},
				],
			},

			// Get Fills Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['portfolio'],
						operation: ['getFills'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Maximum number of fills to return',
					},
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
						description: 'Pagination cursor',
					},
					{
						displayName: 'Ticker',
						name: 'ticker',
						type: 'string',
						default: '',
						description: 'Filter by market ticker',
					},
					{
						displayName: 'Order ID',
						name: 'order_id',
						type: 'string',
						default: '',
						description: 'Filter by order ID',
					},
					{
						displayName: 'Min Timestamp',
						name: 'min_ts',
						type: 'number',
						default: 0,
						description: 'Filter fills after this Unix timestamp',
					},
					{
						displayName: 'Max Timestamp',
						name: 'max_ts',
						type: 'number',
						default: 0,
						description: 'Filter fills before this Unix timestamp',
					},
				],
			},

			// Get Events Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['getEvents'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Maximum number of events to return',
					},
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
						description: 'Pagination cursor',
					},
					{
						displayName: 'Series Ticker',
						name: 'series_ticker',
						type: 'string',
						default: '',
						description: 'Filter by series ticker',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Open',
								value: 'open',
							},
							{
								name: 'Closed',
								value: 'closed',
							},
							{
								name: 'Settled',
								value: 'settled',
							},
						],
						default: '',
						description: 'Filter by event status',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get authentication token once for all items
		const token = await getAuthToken.call(this);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				if (resource === 'market') {
					responseData = await handleMarketOperations.call(this, operation, i, token);
				} else if (resource === 'event') {
					responseData = await handleEventOperations.call(this, operation, i, token);
				} else if (resource === 'order') {
					responseData = await handleOrderOperations.call(this, operation, i, token);
				} else if (resource === 'portfolio') {
					responseData = await handlePortfolioOperations.call(this, operation, i, token);
				} else if (resource === 'exchange') {
					responseData = await handleExchangeOperations.call(this, operation, i, token);
				} else if (resource === 'series') {
					responseData = await handleSeriesOperations.call(this, operation, i, token);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function getAuthToken(this: IExecuteFunctions): Promise<string> {
	const credentials = await this.getCredentials('kalshiApi');
	const baseUrl = credentials.environment === 'production' 
		? 'https://api.elections.kalshi.com/trade-api/v2'
		: 'https://demo-api.kalshi.co/trade-api/v2';

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/login`,
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			email: credentials.email,
			password: credentials.password,
		},
		json: true,
	};

	try {
		const response = await this.helpers.httpRequest(options);
		return response.token;
	} catch (error) {
		throw new NodeOperationError(this.getNode(), `Authentication failed: ${error.message}`);
	}
}

async function handleMarketOperations(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
	token: string,
): Promise<IDataObject> {
	if (operation === 'getMarkets') {
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
		const qs: IDataObject = { ...additionalFields };

		return await kalshiApiRequest.call(this, 'GET', '/markets', {}, qs, token);
	} else if (operation === 'getMarket') {
		const ticker = this.getNodeParameter('ticker', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'GET', `/markets/${ticker}`, {}, {}, token);
	} else if (operation === 'getOrderbook') {
		const ticker = this.getNodeParameter('ticker', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'GET', `/markets/${ticker}/orderbook`, {}, {}, token);
	} else if (operation === 'getCandlesticks') {
		const ticker = this.getNodeParameter('ticker', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
		const qs: IDataObject = { ...additionalFields };
		return await kalshiApiRequest.call(this, 'GET', `/markets/${ticker}/candlesticks`, {}, qs, token);
	} else if (operation === 'getTrades') {
		const ticker = this.getNodeParameter('ticker', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'GET', `/markets/${ticker}/trades`, {}, {}, token);
	} else if (operation === 'batchGetCandlesticks') {
		return await kalshiApiRequest.call(this, 'GET', '/markets/candlesticks', {}, {}, token);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

async function handleEventOperations(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
	token: string,
): Promise<IDataObject> {
	if (operation === 'getEvents') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		return await kalshiApiRequest.call(this, 'GET', '/events', {}, filters, token);
	} else if (operation === 'getEvent') {
		const eventTicker = this.getNodeParameter('eventTicker', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'GET', `/events/${eventTicker}`, {}, {}, token);
	} else if (operation === 'getEventMetadata') {
		const eventTicker = this.getNodeParameter('eventTicker', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'GET', `/events/${eventTicker}/metadata`, {}, {}, token);
	} else if (operation === 'getEventCandlesticks') {
		const eventTicker = this.getNodeParameter('eventTicker', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'GET', `/events/${eventTicker}/candlesticks`, {}, {}, token);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

async function handleOrderOperations(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
	token: string,
): Promise<IDataObject> {
	if (operation === 'createOrder') {
		const ticker = this.getNodeParameter('orderTicker', itemIndex) as string;
		const action = this.getNodeParameter('action', itemIndex) as string;
		const side = this.getNodeParameter('side', itemIndex) as string;
		const type = this.getNodeParameter('type', itemIndex) as string;
		const count = this.getNodeParameter('count', itemIndex) as number;
		const orderOptions = this.getNodeParameter('orderOptions', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			ticker,
			action,
			side,
			type,
			count,
			...orderOptions,
		};

		if (type === 'limit') {
			const yesPrice = this.getNodeParameter('yesPrice', itemIndex) as number;
			body.yes_price = yesPrice;
		}

		return await kalshiApiRequest.call(this, 'POST', '/portfolio/orders', body, {}, token);
	} else if (operation === 'getOrders') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		return await kalshiApiRequest.call(this, 'GET', '/portfolio/orders', {}, filters, token);
	} else if (operation === 'getOrder') {
		const orderId = this.getNodeParameter('orderId', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'GET', `/portfolio/orders/${orderId}`, {}, {}, token);
	} else if (operation === 'cancelOrder') {
		const orderId = this.getNodeParameter('orderId', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'DELETE', `/portfolio/orders/${orderId}`, {}, {}, token);
	} else if (operation === 'batchCreateOrders') {
		const batchOrders = this.getNodeParameter('batchOrders', itemIndex) as string;
		const orders = JSON.parse(batchOrders);
		return await kalshiApiRequest.call(this, 'POST', '/portfolio/orders/batches', { orders }, {}, token);
	} else if (operation === 'batchCancelOrders') {
		const batchOrderIds = this.getNodeParameter('batchOrderIds', itemIndex) as string;
		const orderIds = batchOrderIds.split(',').map(id => id.trim());
		return await kalshiApiRequest.call(this, 'DELETE', '/portfolio/orders/batches', { order_ids: orderIds }, {}, token);
	} else if (operation === 'amendOrder') {
		const orderId = this.getNodeParameter('orderId', itemIndex) as string;
		const newCount = this.getNodeParameter('newCount', itemIndex) as number;
		const newPrice = this.getNodeParameter('newPrice', itemIndex) as number;
		return await kalshiApiRequest.call(this, 'POST', `/portfolio/orders/${orderId}/amend`, { 
			count: newCount,
			yes_price: newPrice 
		}, {}, token);
	} else if (operation === 'decreaseOrder') {
		const orderId = this.getNodeParameter('orderId', itemIndex) as string;
		const decreaseBy = this.getNodeParameter('decreaseBy', itemIndex) as number;
		return await kalshiApiRequest.call(this, 'POST', `/portfolio/orders/${orderId}/decrease`, { 
			decrease_by: decreaseBy 
		}, {}, token);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

async function handlePortfolioOperations(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
	token: string,
): Promise<IDataObject> {
	if (operation === 'getBalance') {
		return await kalshiApiRequest.call(this, 'GET', '/portfolio/balance', {}, {}, token);
	} else if (operation === 'getPositions') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		return await kalshiApiRequest.call(this, 'GET', '/portfolio/positions', {}, filters, token);
	} else if (operation === 'getFills') {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		return await kalshiApiRequest.call(this, 'GET', '/portfolio/fills', {}, filters, token);
	} else if (operation === 'getSettlements') {
		return await kalshiApiRequest.call(this, 'GET', '/portfolio/settlements', {}, {}, token);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

async function handleExchangeOperations(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
	token: string,
): Promise<IDataObject> {
	if (operation === 'getStatus') {
		return await kalshiApiRequest.call(this, 'GET', '/exchange/status', {}, {}, token);
	} else if (operation === 'getAnnouncements') {
		return await kalshiApiRequest.call(this, 'GET', '/exchange/announcements', {}, {}, token);
	} else if (operation === 'getSchedule') {
		return await kalshiApiRequest.call(this, 'GET', '/exchange/schedule', {}, {}, token);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

async function handleSeriesOperations(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
	token: string,
): Promise<IDataObject> {
	if (operation === 'getSeriesList') {
		return await kalshiApiRequest.call(this, 'GET', '/series', {}, {}, token);
	} else if (operation === 'getSeries') {
		const seriesTicker = this.getNodeParameter('seriesTicker', itemIndex) as string;
		return await kalshiApiRequest.call(this, 'GET', `/series/${seriesTicker}`, {}, {}, token);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

async function kalshiApiRequest(
	this: IExecuteFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	token: string,
): Promise<any> {
	const credentials = await this.getCredentials('kalshiApi');
	const baseUrl = credentials.environment === 'production' 
		? 'https://api.elections.kalshi.com/trade-api/v2'
		: 'https://demo-api.kalshi.co/trade-api/v2';

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': token,
		},
		qs,
		body,
		json: true,
	};

	try {
		return await this.helpers.httpRequest(options);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), `Kalshi API Error: ${error.message}`);
	}
