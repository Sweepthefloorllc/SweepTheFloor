"""
force_hours_update.py

Purpose:
- Bulk-update footer/business-hours messaging across top-level site pages.

Usage assumptions:
- Run from the stf_rebuild directory so relative file names resolve correctly.
- Safe text replacements only; no DOM parsing is performed.

Why this exists:
- Keeps repeated hour strings synchronized quickly after policy changes.
"""

from pathlib import Path

# Apply text replacements to each top-level page in this list.
for fn in ['contact.html','about.html','index.html','services.html']:
    p=Path(fn)
    if not p.exists():
        print('missing',fn); continue
    t=p.read_text('utf-8')
    new=t
    # replace common variants
    new=new.replace('Mon-Sat · 7am–6pm','24/7 service')
    new=new.replace('Mon-Sat · 7am-6pm','24/7 service')
    new=new.replace('Mon-Sat  7am6pm','24/7 service')
    new=new.replace('Mon-Sat','24/7 service')
    if new!=t:
        p.write_text(new,'utf-8')
        print('Updated hours in',fn)
    else:
        print('No hours change in',fn)
