; Setting metadata
VIAddVersionKey "ProductName" "clear"
VIAddVersionKey "FileDescription" "clear - video game library"
VIProductVersion "0.19.1.0"
VIAddVersionKey "FileVersion" "0.19.1"
VIAddVersionKey "ProductVersion" "0.19.1"
VIAddVersionKey "LegalCopyright" "Unlicense"

;--------------------------------


; The name of the installer
Name "clear"

; The setup filename
OutFile "clear v0.19.1 setup.exe"

; The setup icon
Icon "${NSISDIR}\Contrib\Graphics\Icons\nsis1-install.ico"

; The uninstaller icon
UninstallIcon "${NSISDIR}\Contrib\Graphics\Icons\nsis1-uninstall.ico"

; The default installation directory
InstallDir $PROGRAMFILES\clear

; Registry key to check for directory (for writing over the old install)
InstallDirRegKey HKLM "Software\clear" "Install_Dir"


;--------------------------------


; Loads and sets languages

LoadLanguageFile "${NSISDIR}\Contrib\Language files\English.nlf"
LoadLanguageFile "${NSISDIR}\Contrib\Language files\Japanese.nlf"
LoadLanguageFile "${NSISDIR}\Contrib\Language files\Spanish.nlf"
LoadLanguageFile "${NSISDIR}\Contrib\Language files\Hindi.nlf"
LoadLanguageFile "${NSISDIR}\Contrib\Language files\Russian.nlf"
LoadLanguageFile "${NSISDIR}\Contrib\Language files\French.nlf"

LangString clearRunning ${LANG_ENGLISH} "'clear' is open ~ please close it and try again!"
LangString clearRunning ${LANG_JAPANESE} "「クリア」が開いています ~ 閉じてもう一度お試しください。"
LangString clearRunning ${LANG_SPANISH} "'clear' está abierto ~ ¡ciérrelo e inténtelo de nuevo!"
LangString clearRunning ${LANG_HINDI} "'clear' खुला है ~ कृपया इसे बंद करें और पुनः प्रयास करें!"
LangString clearRunning ${LANG_RUSSIAN} "« clear » открыто ~ закройте его и повторите попытку!"
LangString clearRunning ${LANG_FRENCH} "« clear » est ouvert ~ veuillez le fermer et réessayer !"

LangString clearLaunch ${LANG_ENGLISH} "launch 'clear' now?"
LangString clearLaunch ${LANG_JAPANESE} "今すぐ「クリア」を起動しますか？"
LangString clearLaunch ${LANG_SPANISH} "¿Lanzar 'clear' ahora?"
LangString clearLaunch ${LANG_HINDI} "अभी 'clear' लॉन्च करें?"
LangString clearLaunch ${LANG_RUSSIAN} "запустить « clear » сейчас?"
LangString clearLaunch ${LANG_FRENCH} "lancer 'clear' maintenant ?"


;--------------------------------


; Pages

Page directory
Page components
Page instfiles

UninstPage uninstConfirm
UninstPage instfiles


;--------------------------------


Section "clear - video game library"

  ; Removes option to uncheck the app from installing
  SectionIn RO

  ; Set output path to the installation directory.
  SetOutPath $INSTDIR
  
  ; Put file there (you can add more File lines too)
  File "..\src-tauri\target\x86_64-pc-windows-msvc\release\clear.exe"
  
  ; Write the installation path into the registry
  WriteRegStr HKLM SOFTWARE\clear "Install_Dir" "$INSTDIR"
  
  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear" "DisplayName" "clear"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear" "NoRepair" 1
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
SectionEnd


;--------------------------------


; Following three sections are shown as checkboxes in the components page
; And their contents are executed if they are checked

Section "desktop shortcut"

    ; Creates a shortcut on the desktop
    CreateShortCut "$DESKTOP\clear.lnk" "$INSTDIR\clear.exe" "" "$INSTDIR\clear.exe" 0

SectionEnd

Section "start menu shortcut"

    ; Creates start menu shortcut
    CreateDirectory "$SMPROGRAMS\clear"
    CreateShortcut "$SMPROGRAMS\clear\Uninstall.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\uninstall.exe" 0
    CreateShortcut "$SMPROGRAMS\clear\clear.lnk" "$INSTDIR\clear.exe" "" "$INSTDIR\clear.exe" 0

SectionEnd


;--------------------------------


; Displays a dialogbox after installation

Function .onInstSuccess
   MessageBox MB_YESNO "$(clearLaunch)" IDYES OpenApp IDNO NoOpen
  OpenApp:
    ExecShell "" '"$INSTDIR\clear.exe"'
    Goto EndDialog
  NoOpen:
  EndDialog:
FunctionEnd


;--------------------------------


; Runs when installer opens and asks to select language

Function .onInit


	;Language selection dialog

	Push ""
	Push ${LANG_ENGLISH}
	Push English
	Push ${LANG_JAPANESE}
	Push Japanese
	Push ${LANG_SPANISH}
	Push Spanish
	Push ${LANG_HINDI}
	Push Hindi
	Push ${LANG_RUSSIAN}
	Push Russian
	Push ${LANG_FRENCH}
	Push French
	Push A ; A means auto count languages
	       ; for the auto count to work the first empty push (Push "") must remain
	LangDLL::LangDialog "installer language" "please select the language of the installer"

	Pop $LANGUAGE
	StrCmp $LANGUAGE "cancel" 0 +2
		Abort


  ; Checks if clear is already open


FunctionEnd

Function .onGUIInit
  FindWindow $0 "" "clear"
  StrCmp $0 0 notRunning
      MessageBox MB_OK|MB_ICONEXCLAMATION "$(clearRunning)" /SD IDOK
      Abort
  notRunning:
FunctionEnd
;--------------------------------


; Uninstaller

Section "Uninstall"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear"
  DeleteRegKey HKLM SOFTWARE\clear

  ; Remove files and uninstaller
  Delete $INSTDIR\clear.exe
  Delete $INSTDIR\uninstall.exe

  ; Remove directories used (only deletes empty dirs)
  RMDir "$SMPROGRAMS\clear"
  RMDir "$INSTDIR"

SectionEnd