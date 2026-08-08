# RBSP - Rocket Booster Sprint Protocol

RBSP is the Honeycomb Publications discovery and indexing acceleration protocol.

## Mission

Move every meaningful publication change from passive crawl waiting to an immediate, validated discovery sprint.

## Protocol

**Publish -> Validate -> Immunise -> Boost -> Submit -> Re-notify -> Verify -> Monitor**

### 1. Publish
A new title, revised book page, logline, synopsis, screen-rights update, metadata change or other meaningful public change reaches `main`.

### 2. Validate
Confirm that the public page remains technically discoverable and that the repository contains the expected public URL.

### 3. Immunise
The Blocker Immunisation layer checks for genuine discovery failures, including accidental `noindex`, general robots blocking, missing major pages, missing sitemap URLs and a missing IndexNow ownership key.

### 4. Boost
Identify the public URLs affected by the deployment. Shared asset, sitemap or robots changes can trigger a wider site-level boost.

### 5. Submit
Notify IndexNow of changed public URLs immediately after a successful production merge.

### 6. Re-notify
Subsequent meaningful updates generate a fresh submission rather than relying on passive rediscovery.

### 7. Verify
The RBSP audit runs on pull requests and production pushes so indexing blockers are surfaced before or alongside deployment.

### 8. Monitor
Keep sitemap dates, canonical URLs, metadata, internal links and screen-rights discovery paths current as the catalogue grows.

## Editorial rule

RBSP accelerates discovery, not advertising. Public pages should lead with the book, story, originality, themes and screen potential. Commercial purchase routes remain contained in `Where to Buy`. Unsupported claims, fabricated reviews and deceptive ranking tactics are prohibited.

## Scope

RBSP applies to the Honeycomb Publications homepage, Books page, Author page, Screen Rights discovery hub and every major individual book page.
