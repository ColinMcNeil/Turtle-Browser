//Navbar scroll detection
doc.on("mousemove", function (event) {
    if (event.pageY > $(window).height() - 40 && shown == false) {
        $("#mynavbar").slideDown();
        shown = true;
    }
    else if (event.pageY <= $(window).height() - 40 && shown == true && !$('#search').hasClass('searchfocus')) {
        $("#mynavbar").slideUp();
        shown = false;
    }
});
$('#close').on('click', function () {
    remote.getCurrentWindow().close();
})
$('#min').on('click', function () {
    remote.getCurrentWindow().minimize();
})
$('#max').on('click', function () {
    console.log(remote.getCurrentWindow().isMaximized())
    switch (remote.getCurrentWindow().isMaximized()) {
        case true: { remote.getCurrentWindow().unmaximize(); break; };
        case false: { remote.getCurrentWindow().maximize(); break; };
    }
})
$('#back').on('click', function () {
    webview.goBack()
})
$('#forward').on('click', function () {
    webview.goForward()
})
$('#bkmks').on('click', function () {
    $('#bookmarkPopup').css("display", "flex").hide().fadeIn();
})
$('#closePopup').on('click', function () {
    $('#bookmarkPopup').fadeOut()
})

$('#addBookmark').on('click', function () {
    const name = $('#bookmarkName').val()
    const url = $('#bookmarkUrl').val()
    saveBookmark(name, url)
})

$('#removeBookmark').on('click', function () {
    try{
        const name = $('#bookmarkName').val()
        removeBookmark(name)
    }
    catch(e) {
        alert(`No bookmark named ${name}`)
    }
    
})

$('#export').on('click', function () {
    exportBookmarks()
})

$('#import').on('click', function () {
    importBookmarks()
})


$('#dev').on('click', ()=>webview.openDevTools())

doc.keydown(function (e) {
    if (e.keyCode === 123) {
        remote.getCurrentWindow().toggleDevTools();
    }
    if (e.keyCode === 116) {
        webview.reload();
    }
    if (e.keyCode == 27) {
        webview.sendInputEvent({ type: 'keyDown', keyCode: 'Esc' })
    }
})


doc.keyup(function (e) {
    if (document.readyState !== 'complete') { return }
    if (e.keyCode == 18 && !overlayup) {
        initializeTabs()
        $('.overlay').fadeIn('fast')
        overlayup = true;
    }
    else if (e.keyCode == 18 && overlayup) {
        $('.overlay').fadeOut('fast')
        overlayup = false;
    }
})
