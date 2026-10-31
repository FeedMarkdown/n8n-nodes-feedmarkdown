import type {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class FeedmarkdownTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Feedmarkdown Trigger',
		name: 'feedmarkdownTrigger',
		icon: { light: 'file:feedmarkdown.svg', dark: 'file:feedmarkdown.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description:
			'Starts the workflow when Feedmarkdown delivers a news article (full-text Markdown) by webhook',
		defaults: {
			name: 'Feedmarkdown Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				// Empty so n8n answers with the webhookResponse returned below.
				responseData: '',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName:
					'Copy the Webhook URL (Test URL while building, Production URL once the workflow is active) into the feed\'s webhook URL in the Feedmarkdown dashboard. Click "Send test event" on the feed page to deliver a sample article while n8n is listening; its "send to a different URL" field takes the Test URL. Each feed has one webhook URL, so the test and production URLs replace each other.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'New Article',
						value: 'article',
						description: 'A new article was delivered for a feed',
					},
				],
				default: 'article',
			},
		],
	};

	// Nothing to register: the user pastes the webhook URL into the Feedmarkdown
	// dashboard by hand, so the lifecycle hooks are intentional no-ops.
	webhookMethods = {
		default: {
			async checkExists(): Promise<boolean> {
				return true;
			},
			async create(): Promise<boolean> {
				return true;
			},
			async delete(): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		return {
			webhookResponse: { ok: true },
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
