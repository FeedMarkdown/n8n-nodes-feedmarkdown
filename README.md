# n8n-nodes-feedmarkdown

n8n community node for [Feedmarkdown](https://feedmarkdown.com): Google News stories delivered as full-text Markdown. The **Feedmarkdown Trigger** node starts a workflow every time Feedmarkdown POSTs an article to it.

Trigger only. There is no credential and the node never calls the Feedmarkdown API. You create feeds and sources in the Feedmarkdown dashboard.

## Install

In n8n: **Settings > Community Nodes > Install**, enter `n8n-nodes-feedmarkdown`.

## Use

1. Add **Feedmarkdown Trigger** to a workflow (event: New Article).
2. Copy its **Webhook URL**: the Test URL while you build, the Production URL once the workflow is active.
3. In the Feedmarkdown dashboard, create a feed with delivery `webhook` and paste the URL into the feed's webhook URL.
4. While n8n is listening (Test URL), click **Send test event** on the feed page. It has an optional "send to a different URL" field: put the n8n Test URL there to deliver a sample article without changing the feed.

The URL must be reachable from the public internet: Feedmarkdown refuses webhook targets that resolve to private or internal addresses (localhost, LAN, cluster IPs), and does not follow redirects. Self-hosted n8n behind a LAN needs a public URL or a tunnel.

Each feed has exactly one webhook URL, so the Test URL and the Production URL replace each other. Switch the feed to the Production URL when you activate the workflow.

The node answers `200 {"ok": true}` immediately, accepts `POST` with `application/json` only, and emits one n8n item per request containing the JSON body untouched (new fields Feedmarkdown adds later pass through as is). It does not verify the `X-Feedmarkdown-Signature` header.

## Example output

This is the test event (also in [`test/sample-article.json`](test/sample-article.json)); real deliveries carry the full article text in `markdown`.

```json
{
  "title": "Feedmarkdown test event",
  "url": "https://example.com/feedmarkdown-test-event",
  "source": "Feedmarkdown",
  "author": "Feedmarkdown Test",
  "published_at": "2026-01-01T12:00:00Z",
  "markdown": "# Feedmarkdown test event\n\nThis is a sample article sent by the webhook test button. It is not real news and is not stored in your feed.\n\n- Your endpoint received and parsed the payload.\n- Verify the `X-Feedmarkdown-Signature` header with your webhook secret.\n\nReal deliveries carry the full article text in this field.\n",
  "id": "00000000-0000-4000-8000-000000000000",
  "feed_id": "00000000-0000-4000-8000-000000000001",
  "source_id": "00000000-0000-4000-8000-000000000002"
}
```

## Test without Feedmarkdown

With the workflow listening (Test URL) or active (Production URL):

```sh
curl -X POST -H 'content-type: application/json' \
  -d @test/sample-article.json \
  'http://localhost:5678/webhook-test/<id>/webhook'
```

Requires n8n 1.x or later (`n8nNodesApiVersion` 1). Zero runtime dependencies.
