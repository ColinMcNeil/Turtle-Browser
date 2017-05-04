const { ipcRenderer } = require('electron')
var lastid;
var shown = true;
const online = window.navigator.onLine;
search = $('#search')
doc = $(document)

var reloadSearch = function (placeholder,color='white') {
    search.select2({
        placeholder: placeholder,
        tags: true,
        theme: 'material'
    });
    search.siblings('.select2-container').find('.select2-selection__placeholder').css('color', color)
}
//NAVBAR
doc.on("mousemove", function (event) {
    if (event.pageY > $(window).height()-40 && shown == false) {
        $("#mynavbar").slideDown();
        shown = true;
    }
    else if (event.pageY <= $(window).height() - 40 && shown == true && !search.data("open")) {
        $("#mynavbar").slideUp();
        shown = false;
    }
});
doc.ready(function () {
    reloadSearch("Search")
    const webview = document.querySelector('webview')
    const indicator = $('.indicator')
    webview.addEventListener('page-title-updated', function () {
        if (lastid) {
            $("option").each(function (index, obj) {
                if ($(obj).attr('value') == lastid) {
                    $(obj).remove()
                }
            })   
        }
        reloadSearch(webview.getURL(),'white')
    })
})

$('#close').on('click', function () {
    console.log('closed in web view')
    ipcRenderer.sendSync('synchronous-message', 'close')
})
$('#min').on('click', function () {
    console.log('closed in web view')
    ipcRenderer.sendSync('synchronous-message', 'min')
})
$('#max').on('click', function () {
    console.log('closed in web view')
    ipcRenderer.sendSync('synchronous-message', 'max')
})
$('#back').on('click', function () {
    webview.goBack()
})
$('#forward').on('click', function () {
    webview.goForward()
})
search.on("select2:select", function (e) {
    val = e.params.data.text;
    lastid = e.params.data.id
    webview.loadURL(match(val))//from urlmatch
});
search.on("select2:open", function () {
    $(this).data("open", true);
});
search.on("select2:close", function () {
    $(this).data("open", false);
});
failload = function (error) {
    console.log(error)
    if (error.errorCode == -105) {
        webview.loadURL('http://google.com/search?q='+encodeURI(val))
    }
    if (!online) {
        webview.loadURL('file://pages/offline.html')
    }
}
doc.keydown(function (e) {
    if (e.keyCode == 123) {
        webview.openDevTools()
    }
})

