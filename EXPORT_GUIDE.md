# Getting your models into the 3D viewer

Browsers cannot open SolidWorks files, so each model must be exported once. Two routes:

## Route A: single parts (simplest, reliable)
SolidWorks: File > Save As > STL. Name it like the part (BODY.stl for BODY.SLDPRT).

## Route B: assemblies with part names and hierarchy
1. SolidWorks: File > Save As > STEP (.step).
2. `pip install cascadio`, then `python3 tools/step_to_glb.py <folder with .step files> assets/projects/<project>/models`

## Bulk export
`tools/ExportAllToSTL.bas` is a SolidWorks macro that exports every part and assembly of a folder to STEP and STL. Set SRC and OUT inside it first. Untested by me; try one folder.

## Publish
1. Put .stl or .glb files in `assets/projects/<project>/models/` (e.g. `assets/projects/drone/models/`).
2. `python3 tools/register_models.py`
3. Upload the folder again. The model appears in the viewer's list and as "View in 3D" on the matching part.

Tip: keep each file under about 10 MB for fast loading. Publish only the models you want public; everything else stays private.
