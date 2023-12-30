.\UPX\upx.exe --ultra-brute src-tauri\target\x86_64-pc-windows-msvc\release\clear.exe
.\NSIS-unicode\makensis.exe NSIS-unicode\installer.nsi 
copy "src-tauri\target\x86_64-pc-windows-msvc\release\clear.exe" "src-tauri\target\x86_64-pc-windows-msvc\release\clear v0.19.1 portable.exe" 
echo portable available in %cd%\src-tauri\target\x86_64-pc-windows-msvc\release\ 
echo bundle available in %cd%\NSIS-unicode\
echo next generated bundle includes the installer for webview