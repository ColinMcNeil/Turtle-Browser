!macro customInstall
    DetailPrint "Adding Registry Keys"
    WriteRegStr HKLM "SOFTWARE\Classes\.htm\OpenWithProgIds" "TurtleBrowser" ""
    WriteRegStr HKLM "SOFTWARE\Classes\.html\OpenWithProgIds" "TurtleBrowser" ""

    DeleteRegKey HKLM "SOFTWARE\TurtleBrowser"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser" "" "Turtle Browser HTML"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\ApplicationDescription" "" "Turtle Browser HTML"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\FileAssociations" ".htm" "TurtleBrowserHTML"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\FileAssociations" ".html" "TurtleBrowserHTML"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\FileAssociations" ".shtml" "TurtleBrowserHTML"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\FileAssociations" ".xht" "TurtleBrowserHTML"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\FileAssociations" ".xhtml" "TurtleBrowserHTML"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\Startmenu" "StartmenuInternet" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\UrlAssociations" "http" "TurtleBrowserHTML.url"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\UrlAssociations" "https" "TurtleBrowserHTML.url"
    WriteRegStr HKLM "SOFTWARE\TurtleBrowser\Capabilities\UrlAssociations" "ftp" "TurtleBrowserHTML.url"

    WriteRegStr HKLM "SOFTWARE\RegisteredApplications" "TurtleBrowser" "SOFTWARE\TurtleBrowser\Capabilities"

    WriteRegStr HKLM "TurtleBrowser\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    WriteRegStr HKLM "TurtleBrowser\shell" "" ""
    WriteRegStr HKLM "TurtleBrowser\shell\Open" "" ""
    WriteRegStr HKLM "TurtleBrowser\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"


    DeleteRegKey HKCR "TurtleBrowserHTML.url"
    WriteRegStr HKCR "TurtleBrowserHTML.url" "" "Turtle Browser HTML"
    WriteRegStr HKCR "TurtleBrowserHTML.url\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    WriteRegStr HKCR "TurtleBrowserHTML.url\shell" "" ""
    WriteRegStr HKCR "TurtleBrowserHTML.url\shell\Open" "" ""
    WriteRegStr HKCR "TurtleBrowserHTML.url\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"


!macroend