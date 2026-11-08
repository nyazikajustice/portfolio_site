' SolidWorks macro: exports every part and assembly in a folder to STEP (all) and STL (parts).
' How to use: SolidWorks > Tools > Macro > New..., paste this, set SRC and OUT below, Run.
' Not tested by the author (no SolidWorks available); try it on one small folder first.
Dim swApp As SldWorks.SldWorks
Sub main()
    Const SRC As String = "C:\CAD\completed drawings\drone design 1\"
    Const OUT As String = "C:\CAD\export\drone\"
    Set swApp = Application.SldWorks
    If Dir(OUT, vbDirectory) = "" Then MkDir OUT
    Dim f As String: f = Dir(SRC & "*.sld*")
    Do While f <> ""
        If Left(f, 2) <> "~$" Then Export SRC & f, OUT
        f = Dir()
    Loop
    MsgBox "Done"
End Sub
Sub Export(path As String, outDir As String)
    Dim t As Long, e As Long, w As Long, doc As SldWorks.ModelDoc2
    Dim ext As String: ext = UCase(Right(path, 6))
    If ext = "SLDPRT" Then t = 1 Else t = 2   ' swDocPART=1, swDocASSEMBLY=2
    Set doc = swApp.OpenDoc6(path, t, 1, "", e, w)   ' 1 = silent
    If doc Is Nothing Then Exit Sub
    Dim base As String: base = Left(Mid(path, InStrRev(path, "\") + 1), InStrRev(Mid(path, InStrRev(path, "\") + 1), ".") - 1)
    doc.Extension.SaveAs outDir & base & ".step", 0, 1, Nothing, e, w
    If t = 1 Then doc.Extension.SaveAs outDir & base & ".stl", 0, 1, Nothing, e, w
    swApp.CloseDoc doc.GetTitle
End Sub
