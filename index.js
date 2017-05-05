const { ipcRenderer, remote } = require('electron')
const path = require('path')
fs = require('fs')
var lastid;
var shown = true;
const online = window.navigator.onLine;
search = $('#search')
doc = $(document)
content = $("#content")
contentdown = false;

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
    newHeight = $(window).height() - 20;
    if (event.pageY < 40 && !contentdown) {
       
    }
    else if(event.pageY > 40 && contentdown){
        
    }
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
    require('electron-context-menu')({
        window: webview
    });
    const indicator = $('.indicator')
    console.log(webview.shadowRoot)
    webview.addEventListener('page-title-updated', function () {
        csspath = path.resolve(__dirname,'scrollbar.css')
        console.log(csspath)
        css = fs.readFileSync(csspath, 'utf8')
        webview.insertCSS(css);
        if (lastid) {
            $("option").each(function (index, obj) {
                if ($(obj).attr('value') == lastid) {
                    $(obj).remove()
                }
            })   
        }
        reloadSearch(webview.getURL(),'white')
    })
    webview.addEventListener('did-fail-load', failload)
    doc.bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0 && !contentdown) {
            console.log('up')
            $('#windowbar').slideDown();
            contentdown = true;
        }
        else if (e.originalEvent.wheelDelta / 120 <= 0 && contentdown) {
            console.log('down')
            $('#windowbar').slideUp();
            contentdown = false;
        }
    });
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
        console.log('loading')
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

