#!/usr/bin/env python3
import json
import os
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = "honeycombpublications.com"
BASE = f"https://{HOST}"
KEY = "0e80ce774b1618632a06d783d42ebd49"
KEY_LOCATION = f"{BASE}/{KEY}.txt"

MAJOR_HTML = [
    ROOT / "index.html",
    ROOT / "books" / "index.html",
    ROOT / "author" / "index.html",
    ROOT / "screen-rights" / "index.html",
]
MAJOR_HTML += sorted((ROOT / "books").glob("*/index.html"))


def fail(message):
    print(f"ERROR: {message}")
    return 1


def audit():
    errors = 0
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if "User-agent: *" not in robots or "Allow: /" not in robots:
        errors += fail("robots.txt must allow general crawling")
    if f"Sitemap: {BASE}/sitemap.xml" not in robots:
        errors += fail("robots.txt must advertise sitemap.xml")

    tree = ET.parse(ROOT / "sitemap.xml")
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = {node.text.strip() for node in tree.findall("s:url/s:loc", ns) if node.text}

    for path in MAJOR_HTML:
        if not path.exists():
            errors += fail(f"missing major page: {path.relative_to(ROOT)}")
            continue
        html = path.read_text(encoding="utf-8", errors="ignore")
        lower = html.lower()
        if "<title>" not in lower:
            errors += fail(f"missing title: {path.relative_to(ROOT)}")
        if 'name="description"' not in lower and "name='description'" not in lower:
            errors += fail(f"missing meta description: {path.relative_to(ROOT)}")
        if 'rel="canonical"' not in lower and "rel='canonical'" not in lower:
            errors += fail(f"missing canonical: {path.relative_to(ROOT)}")
        if "noindex" in lower:
            errors += fail(f"indexing blocker found: {path.relative_to(ROOT)}")

    required = {
        f"{BASE}/",
        f"{BASE}/books/",
        f"{BASE}/author/",
        f"{BASE}/screen-rights/",
    }
    required |= {f"{BASE}/books/{p.parent.name}/" for p in (ROOT / "books").glob("*/index.html")}
    for url in sorted(required - urls):
        errors += fail(f"URL missing from sitemap: {url}")

    if not (ROOT / f"{KEY}.txt").exists():
        errors += fail("IndexNow key file missing")

    if errors:
        print(f"Visibility audit failed with {errors} error(s).")
        return 1
    print(f"Visibility audit passed for {len(MAJOR_HTML)} major pages and {len(urls)} sitemap URLs.")
    return 0


def changed_urls(before, after):
    import subprocess
    if not before or set(before) == {"0"}:
        return all_urls()
    result = subprocess.run(
        ["git", "diff", "--name-only", before, after],
        cwd=ROOT, text=True, capture_output=True, check=True
    )
    urls = set()
    shared_change = False
    for name in result.stdout.splitlines():
        name = name.strip()
        if not name:
            continue
        if name == "index.html": urls.add(f"{BASE}/")
        elif name == "books/index.html": urls.add(f"{BASE}/books/")
        elif name.startswith("author/"): urls.add(f"{BASE}/author/")
        elif name.startswith("screen-rights/"): urls.add(f"{BASE}/screen-rights/")
        elif name.startswith("books/"):
            parts = name.split("/")
            if len(parts) > 2: urls.add(f"{BASE}/books/{parts[1]}/")
        elif name.startswith("assets/") or name in {"robots.txt", "sitemap.xml"}:
            shared_change = True
    if shared_change:
        urls |= set(all_urls())
    return sorted(urls)


def all_urls():
    tree = ET.parse(ROOT / "sitemap.xml")
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [node.text.strip() for node in tree.findall("s:url/s:loc", ns) if node.text]


def submit(urls):
    urls = sorted(set(urls))
    if not urls:
        print("No changed public URLs to submit to IndexNow.")
        return 0
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            print(f"IndexNow response: {response.status}; submitted {len(urls)} URL(s).")
            for url in urls: print(f"  {url}")
        return 0
    except Exception as exc:
        print(f"IndexNow submission failed: {exc}")
        return 1


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "audit"
    if mode == "audit": return audit()
    if mode == "submit":
        before = os.environ.get("BEFORE_SHA", "")
        after = os.environ.get("AFTER_SHA", "HEAD")
        return submit(changed_urls(before, after))
    if mode == "submit-all": return submit(all_urls())
    print("Usage: search_visibility.py [audit|submit|submit-all]")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
