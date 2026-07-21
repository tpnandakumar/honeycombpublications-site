from pathlib import Path
import sys

if len(sys.argv) != 2:
    print("Usage: python configure_domain.py https://www.yourdomain.co.uk")
    raise SystemExit(1)

domain = sys.argv[1].rstrip("/")
if not domain.startswith("https://"):
    raise SystemExit("Use the full HTTPS domain, for example https://www.example.co.uk")

root = Path(__file__).resolve().parent
placeholder = "https://honeycombpublications.com"
changed = 0

for path in root.rglob("*"):
    if path.is_file() and path.suffix.lower() in {".html", ".xml", ".txt", ".md"}:
        text = path.read_text(encoding="utf-8")
        if placeholder in text:
            path.write_text(text.replace(placeholder, domain), encoding="utf-8")
            changed += 1

print(f"Configured {changed} files for {domain}")
