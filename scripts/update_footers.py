"""
update_footers.py

Purpose:
- Enforce footer consistency across selected pages.

What it updates:
- Adds secondary phone number when missing.
- Normalizes business hours text where legacy values remain.

Implementation notes:
- Uses lightweight string replacement for speed and portability.
- Intended for controlled, known markup patterns in this repository.
"""

from pathlib import Path

# Pages currently targeted for footer normalization.
files = ['about.html','contact.html']
for fn in files:
    p = Path(fn)
    if not p.exists():
        print(fn, 'missing')
        continue
    t = p.read_text(encoding='utf-8')
    changed = False
    if '(870) 654-5979' not in t:
        old = '<a href="tel:4175591486">(417) 559-1486</a>'
        if old in t:
            t = t.replace(old, old + '<a href="tel:8706545979">(870) 654-5979</a>', 1)
            changed = True
    if 'Mon-Sat' in t and '24/7' not in t:
        t = t.replace('Mon-Sat · 7am–6pm', '24/7 service')
        changed = True
    if changed:
        p.write_text(t, encoding='utf-8')
        print('Updated', fn)
    else:
        print('No change', fn)
