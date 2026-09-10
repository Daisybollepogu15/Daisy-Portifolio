import urllib.request
import re
import os

base_url = 'http://localhost:8080/'

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Match all relative asset paths
matches = re.findall(r'(?:src|href)="([^"]+)"', html)
print(f"Extracted {len(matches)} attribute references from index.html")

failures = []
checked = set()

for m in matches:
    if m.startswith('#') or m.startswith('http') or m.startswith('mailto:') or m.startswith('tel:'):
        continue
    if m in checked:
        continue
    checked.add(m)
    test_url = base_url + m
    try:
        req = urllib.request.Request(test_url)
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            print(f"[OK 200] {m:35} size: {len(data):>7} bytes")
    except Exception as e:
        print(f"[FAIL]   {m:35} error: {e}")
        failures.append((m, str(e)))

print("-" * 50)
if not failures:
    print("SUCCESS: 100% of all local assets, styles, scripts, and media are working!")
else:
    print(f"FAILED: {len(failures)} assets failed.")
