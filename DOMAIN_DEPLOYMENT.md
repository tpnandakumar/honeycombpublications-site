# Domain Deployment Note

This package is already configured for:

https://honeycombpublications.com

## Current domain issue

The domain currently redirects to an l.ink destination. To host this website, update the domain's
DNS or hosting settings so the domain points to your chosen web host instead of the current redirect.

## Recommended deployment routes

### Route A: Cloudflare Pages

1. Create a Cloudflare account.
2. Add honeycombpublications.com.
3. Upload or connect this website folder.
4. Add the custom domain.
5. Remove the existing redirect or forwarding rule.
6. Confirm HTTPS is active.

### Route B: GitHub Pages

1. Create a repository named honeycombpublications-site.
2. Upload this folder's contents.
3. Enable GitHub Pages.
4. Add honeycombpublications.com as the custom domain.
5. Add the DNS records requested by GitHub.
6. Remove the current redirect or forwarding rule.

### After deployment

1. Open https://honeycombpublications.com
2. Confirm the publisher homepage loads.
3. Open https://honeycombpublications.com/books/fathers-mistakes-sons-wisdom/
4. Verify the exact title, author and ISBN.
5. Add the site to Google Search Console.
6. Submit https://honeycombpublications.com/sitemap.xml
7. Request indexing for the exact book URL.