# Honeycomb Publications Website Starter v1

This package creates the first canonical web presence for:

- **Book:** Father's Mistakes, Son's Wisdom
- **Author:** N T Pisharam
- **ISBN-13:** 9781739770914
- **Format:** Paperback
- **Imprint:** Honeycomb Publications

## Before publishing

1. Buy or select a domain.
2. Run:

```text
python configure_domain.py https://www.your-domain.co.uk
```

3. Replace the temporary book-description paragraph.
4. Replace the temporary cover block with the approved cover image.
5. Replace the `#` retailer links with the real Amazon and Foyles URLs.
6. Upload the entire folder to GitHub Pages, Cloudflare Pages or another static host.

## Recommended domain pattern

Use a simple publisher domain, for example:

```text
honeycombpublications.co.uk
```

Domain availability must be checked at the time of registration.

## Google indexing sequence

1. Publish the site at the final HTTPS domain.
2. Verify the domain or URL-prefix property in Google Search Console.
3. Submit `/sitemap.xml`.
4. Inspect the exact book URL.
5. Request indexing once.
6. Link the book page from the homepage and author page.
7. Keep the title, author and ISBN identical across all records.

Repeated indexing requests do not speed up crawling.

## Local preview

On Windows, double-click:

```text
Preview_Website.bat
```

Then open:

```text
http://localhost:8000
```

## Files

- `index.html`: publisher homepage
- `author/index.html`: canonical author page
- `books/fathers-mistakes-sons-wisdom/index.html`: canonical book page
- `assets/style.css`: styling
- `robots.txt`: crawler instructions
- `sitemap.xml`: Google sitemap
- `configure_domain.py`: replaces the placeholder domain