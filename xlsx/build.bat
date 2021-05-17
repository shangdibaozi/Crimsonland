@echo off
set datas=datas/
set excel=xlsx/Config.xlsx
echo on
xlsx2py.exe %datas% %excel% json
xcopy "E:\CocosCreator3D\Tiledmap\xlsl\datas\json\*.json" "E:\CocosCreator3D\Tiledmap\assets\LocalRes\Config\" /Y
pause