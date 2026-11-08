#!/usr/bin/env python3
"""Scan assets/projects/<project>/models/ for .glb/.gltf/.stl and register them in data.js.
Name each file after the SolidWorks part/assembly (e.g. BODY.glb for BODY.SLDPRT) so the site links them.
Run from the site folder:  python3 tools/register_models.py"""
import json,os,glob
raw=open('data.js').read(); D=json.loads(raw[raw.index('=')+1:].rstrip(';')); n=0
for p in D['projects']:
    fs=sorted(f for e in ('glb','gltf','stl') for f in glob.glob(f'assets/projects/{p["slug"]}/models/*.{e}'))
    p['models']=[dict(name=os.path.splitext(os.path.basename(f))[0],file=f.replace(os.sep,'/')) for f in fs]; n+=len(fs)
open('data.js','w').write('window.SITE_DATA='+json.dumps(D,separators=(',',':'))+';'); print('registered',n,'models')
