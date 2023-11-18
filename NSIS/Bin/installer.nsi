; Setting metadata
VIAddVersionKey "ProductName" "clear"
VIAddVersionKey "FileDescription" "clear - video game library"
VIProductVersion "0.0.17.0"
VIAddVersionKey "FileVersion" "0.0.17"
VIAddVersionKey "ProductVersion" "0.0.17"
VIAddVersionKey "LegalCopyright" "Unlicense"


;--------------------------------


; The name of the installer
Name "clear"

; The setup filename
OutFile "clear_setup.exe"

; The setup icon
Icon "${NSISDIR}\Contrib\Graphics\Icons\classic-install.ico"

; The default installation directory
InstallDir $PROGRAMFILES\clear

; Registry key to check for directory (for writing over the old install)
InstallDirRegKey HKLM "Software\clear" "Install_Dir"


;--------------------------------


; Pages

Page components
Page instfiles

; Displays logs while installing by default
ShowInstDetails show


UninstPage uninstConfirm
UninstPage instfiles


;--------------------------------


Section "clear - video game library"

  ; Removes option to uncheck the app from installing
  SectionIn RO

  ; Set output path to the installation directory.
  SetOutPath $INSTDIR
  
  ; Put file there (you can add more File lines too)
  File "..\..\src-tauri\target\release\clear.exe"
  
  ; Write the installation path into the registry
  WriteRegStr HKLM SOFTWARE\clear "Install_Dir" "$INSTDIR"
  
  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear" "DisplayName" "clear"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\clear" "NoRepair" 1
  WriteUninstaller "$INSTDIR\uninstall.exe"

  SetAutoClose true
  
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

Section "open after install"

    ; Opens after install
    ExecShell "" '"$INSTDIR\clear.exe"'

SectionEnd

; Unchecked by default

Section /o "show installer logs"

  ; Doesn't close the installer by default so that user can look at the logs
  SetAutoClose false

SectionEnd


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