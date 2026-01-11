import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KalshiApi implements ICredentialType {
	name = 'kalshiApi';
	displayName = 'Kalshi API';
	documentationUrl = 'https://docs.kalshi.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Kalshi account email',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Kalshi account password',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Demo',
					value: 'demo',
				},
			],
			default: 'demo',
			description: 'The Kalshi environment to use. Use Demo for testing without real money.',
		},
	];

	// We'll authenticate via login endpoint to get a token
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment === "production" ? "https://api.elections.kalshi.com/trade-api/v2" : "https://demo-api.kalshi.co/trade-api/v2"}}',
			url: '/exchange/status',
			method: 'GET',
		},
	};
}
