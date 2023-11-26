.\UPX\upx.exe --ultra-brute src-tauri\target\x86_64-pc-windows-msvc\release\clear.exe
.\NSIS\Bin\makensis.exe NSIS\Bin\installer.nsi 
copy "src-tauri\target\x86_64-pc-windows-msvc\release\clear.exe" "src-tauri\target\x86_64-pc-windows-msvc\release\clear v0.18.0 portable.exe" 
echo portable available in %cd%\src-tauri\target\x86_64-pc-windows-msvc\release\ 
echo bundle available in %cd%\NSIS\Bin 
echo next generated bundle includes the installer for webview