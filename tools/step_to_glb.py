#!/usr/bin/env python3
"""Convert STEP files (assemblies keep their part names/hierarchy) to GLB for the website viewer.
Setup (once):  pip install cascadio
Usage:         python3 tools/step_to_glb.py  path/to/export_folder  assets/projects/<project>/models
Then:          python3 tools/register_models.py"""
import sys,os,glob
import cascadio
src,dst=sys.argv[1],sys.argv[2]; os.makedirs(dst,exist_ok=True)
for f in sorted(glob.glob(os.path.join(src,'*.st*p'))):
    out=os.path.join(dst,os.path.splitext(os.path.basename(f))[0]+'.glb')
    cascadio.step_to_glb(f,out,0.1,0.5); print('ok',out)
