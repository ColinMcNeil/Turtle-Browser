const { ipcRenderer, remote } = require('electron')
const isDev = require('electron-is-dev');
var tabID = 0;
const { Menu, MenuItem } = remote
const path = require('path')
fs = require('fs')
var lastid;
var shown = true;
const online = window.navigator.onLine;
search = $('#search')
doc = $(document)
content = $("#content")
var tabContainer = []
var overlayup = false
var currentTabID = 0;
var currentURL = ''
var currentScroll = 0;
var lastScroll = 0;


//Initialize a page - Called on ready and loadTab.
var init_page = function () {
    var webview = document.querySelector('#webview')
    var contextMenu = require('electron-context-menu')({
        window: webview,
    });
    const indicator = $('.indicator')
    webview.addEventListener('page-title-updated', function () {
        $('#search').val(webview.getURL())
        
        //$('#val').css('width', '50%')

        csspath = path.resolve(__dirname, 'scrollbar.css')
        css = fs.readFileSync(csspath, 'utf8')
        webview.insertCSS(css);
        if (lastid) {
            $("option").each(function (index, obj) {
                if ($(obj).attr('value') == lastid) {
                    $(obj).remove()
                }
            })
        }
    })
    webview.addEventListener('did-fail-load', failload)
    webview.addEventListener('did-get-response-details', function (response) {
        
    })
    /**
     * Handles link override:
     * If a user clicks a link, the preload script interrupts it and sends the url here
     * Allows injecting headers and programmatic control for every navigation.
     */
    webview.addEventListener('ipc-message', function (event) {
        if (event.channel == "navAttempt") {
            clickedURL = event.args[0]
            if (clickedURL) { loadURL(clickedURL) }
        }
        if (event.channel == "scrollY") {
            currentScroll = event.args[0]
        }
    })
}

doc.ready(function () {
    $('.overlay').fadeOut(0)
    loadBookmarks()
    arg = remote.getGlobal('sharedObj').args[(isDev ? 2 : 1)]
    init_page()
    lastHeight = $(window).height()
    $(window).resize(function () {
        if($(this).height()==lastHeight){return}
        $('#top').css('top', '0px');
        $('#bookmarks').css('top', '0px');
        lastHeight=$(window).height()
    });
    doc.bind('mousewheel', function (e) {
        let tall = $(window).height() - 50
        let short = $(window).height() - 25
        if (e.originalEvent.wheelDelta / 120 > 0 && $('#top').css('top')=='-25px') {
            $('#top').animate({ top: 0 });
            $('#bookmarks').animate({ top: 25 });
            resizeContent('tall');
        }
        else if (e.originalEvent.wheelDelta / 120 <= 0 && $('#top').css('top') == '0px') {
            $('#top').animate({ top: -25 });
            $('#bookmarks').animate({ top: 0 });
            resizeContent('short');
        }
    });
    window.setTimeout(checkArgs, 100);
})
var checkArgs = function () {
    if (arg) { //If the program has started with an argument (file to load)
        if (!fs.existsSync(arg)) { //If file does not exist, it's either a URL we will try to load, or we redirect to DNE page.
            if (arg.startsWith('http')) {
                loadURL(arg)
            }
            else {
                loadURL('file:\\\\' + __dirname + '\\pages\\DNE.html')
            }
            return;
        }
        ext = path.extname(arg)
        if (ext == '.url') {
            fs.readFile(arg, 'utf8', function (err, data) {
                let url = data.split('URL=')[1]
                loadURL(url)
            })
        }
        else if (ext == '.html') {
            let url = path.resolve(arg);
            loadURL(url)
        }
    }
}


/**
 * Load a URL in webview.
*/
var loadURL = function (url,scoll=0) { //Defined as an external function for scoping with webview.
    lastScroll = currentScroll;
    $('#search').focusout()
    webview.loadURL(url, {
        extraHeaders:"DNT:1\n"
    })
    webview.send('scrollTo',scroll)
}
/**
 * Error handling script.
 */
var failload = function (error) {
    if (error.errorCode == -105) {
        webview.loadURL('http://google.com/search?q=' + encodeURI(val))
    }
    if (!online) {
        webview.loadURL('file://pages/offline.html')
    }
}


var resizeContent = function (height) {
    const tall = $(window).outerHeight() - 50
    const short = $(window).outerHeight() - 25
    switch (height) {
        case 'tall': { content.animate({ top: '50px', height: tall }); break }
        case 'short': { content.animate({ top: '25px', height: short }); break }
    }
}

