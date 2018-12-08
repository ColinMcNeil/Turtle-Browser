//Navbar scroll detection
doc.on("mousemove", function (event) {
    if (event.pageY > $(window).height() - 40 && shown == false) {
        $("#mynavbar").slideDown(ANIMATION_SPEED);
        shown = true;
    }
    else if (event.pageY <= $(window).height() - 40 && shown == true && !$('#search').hasClass('searchfocus')) {
        $("#mynavbar").slideUp(ANIMATION_SPEED);
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
    console.log(window.height);
    switch (remote.getCurrentWindow().isMaximized()) {
        case true: { remote.getCurrentWindow().unmaximize(); break; };
        case false: { remote.getCurrentWindow().maximize(); break; };
    }
    switch ($('#top').css('top')=='-25px') {
        case true: { setTimeout( resizeContent, 100 ) }
        case false: { setTimeout( resizeContent, 100 ) }
    }
})
$('#back').on('click', function () {
    webview.goBack()
})
$('#forward').on('click', function () {
    webview.goForward()
})
const delim = 'del '

$('#bkmks').on('click', function () {
    $('#bookmarkPopup').css("display", "flex").hide().fadeIn(ANIMATION_SPEED);
    $('.bookmark').each((index, element) => {
        const text = $(element).text()
        $(element).append(`<i style="position:relative" class="fa fa-times bookmarkX" aria-hidden="true"></i>`)
    })
})
$('#closePopup').on('click', function () {
    $('#bookmarkPopup').fadeOut(ANIMATION_SPEED)
    $('.bookmarkX').remove()
})

$('#addBookmark').on('click', function () {
    const name = $('#bookmarkName').val()
    const url = $('#bookmarkUrl').val()
    saveBookmark(name, url)
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
        $('.overlay').fadeIn(ANIMATION_SPEED)
        overlayup = true;
    }
    else if (e.keyCode == 18 && overlayup) {
        $('.overlay').fadeOut(ANIMATION_SPEED)
        overlayup = false;
    }
})
