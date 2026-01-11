export interface KalshiCredentials {
	environment: 'production' | 'demo';
	email: string;
	password: string;
	apiKey?: string;
}

export interface KalshiMarket {
	ticker: string;
	event_ticker: string;
	series_ticker: string;
	title: string;
	subtitle: string;
	status: 'active' | 'closed' | 'settled';
	yes_bid: number;
	yes_ask: number;
	no_bid: number;
	no_ask: number;
	last_price: number;
	volume: number;
	open_interest: number;
	close_time: number;
	expiration_time: number;
	result?: string;
	liquidity?: number;
}

export interface KalshiEvent {
	event_ticker: string;
	series_ticker: string;
	title: string;
	mutually_exclusive: boolean;
	status: 'open' | 'closed' | 'settled';
	markets: KalshiMarket[];
	strike_date?: number;
	category: string;
	sub_category: string;
}

export interface KalshiOrder {
	order_id: string;
	user_id: string;
	ticker: string;
	status: 'resting' | 'canceled' | 'executed';
	action: 'buy' | 'sell';
	side: 'yes' | 'no';
	type: 'market' | 'limit';
	yes_price?: number;
	no_price?: number;
	count: number;
	remaining_count: number;
	created_time: number;
	close_cancel_count?: number;
	expiration_time?: number;
	client_order_id?: string;
	decreases?: any[];
	fills?: KalshiFill[];
}

export interface KalshiFill {
	fill_id: string;
	order_id: string;
	ticker: string;
	action: 'buy' | 'sell';
	side: 'yes' | 'no';
	yes_price: number;
	no_price: number;
	count: number;
	created_time: number;
	trade_id: string;
	is_taker: boolean;
}

export interface KalshiPosition {
	ticker: string;
	event_ticker: string;
	market_ticker: string;
	position: number;
	total_cost: number;
	fees_paid: number;
	resting_order_count: number;
	market_exposure: number;
}

export interface KalshiBalance {
	balance: number;
	payout: number;
}

export interface KalshiOrderbook {
	yes: Array<[number, number]>; // [price, quantity]
	no: Array<[number, number]>;
}

export interface KalshiTrade {
	trade_id: string;
	ticker: string;
	yes_price: number;
	no_price: number;
	count: number;
	created_time: number;
	taker_side: 'yes' | 'no';
}

export interface KalshiMarketHistory {
	ticker: string;
	ts: number;
	yes_bid: number;
	yes_ask: number;
	no_bid: number;
	no_ask: number;
	volume: number;
	open_interest: number;
}

export interface KalshiExchangeStatus {
	exchange_active: boolean;
	trading_active: boolean;
}

export interface KalshiSchedule {
	standard_hours: {
		open_time: string;
		close_time: string;
	};
	maintenance_windows?: Array<{
		start_time: number;
		end_time: number;
		description?: string;
	}>;
}

export interface CreateOrderParams {
	ticker: string;
	action: 'buy' | 'sell';
	side: 'yes' | 'no';
	type: 'market' | 'limit';
	count: number;
	yes_price?: number;
	no_price?: number;
	expiration_ts?: number;
	client_order_id?: string;
	sell_position_floor?: number;
}

export interface BatchOrderParams {
	orders: CreateOrderParams[];
}

export interface DecreaseOrderParams {
	reduce_by: number;
}

export interface MarketFilters {
	event_ticker?: string;
	series_ticker?: string;
	status?: 'active' | 'closed' | 'settled';
	limit?: number;
	cursor?: string;
	ticker?: string;
	max_close_ts?: number;
	min_close_ts?: number;
}

export interface EventFilters {
	series_ticker?: string;
	status?: 'open' | 'closed' | 'settled';
	limit?: number;
	cursor?: string;
}

export interface OrderFilters {
	ticker?: string;
	event_ticker?: string;
	status?: 'resting' | 'canceled' | 'executed';
	limit?: number;
	cursor?: string;
}

export interface PositionFilters {
	ticker?: string;
	event_ticker?: string;
	limit?: number;
	cursor?: string;
	count_filter?: 'all' | 'non_zero';
	settlement_status?: 'all' | 'settled' | 'unsettled';
}

export interface FillFilters {
	ticker?: string;
	order_id?: string;
	min_ts?: number;
	max_ts?: number;
	limit?: number;
	cursor?: string;
}

export interface HistoryFilters {
	limit?: number;
	cursor?: string;
	min_ts?: number;
	max_ts?: number;
}

export interface TradesFilters {
	limit?: number;
	cursor?: string;
	min_ts?: number;
	max_ts?: number;
}
