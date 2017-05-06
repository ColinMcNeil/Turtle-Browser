const { ipcRenderer, remote } = require('electron')
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
contentdown = false;
animating = false;
var tabContainer = []
var overlayup = false
var currentTabID = 0;

var reloadSearch = function (placeholder, color = 'white') {
    search.select2({
        placeholder: placeholder,
        tags: true,
        theme: 'material'
    });
    search.siblings('.select2-container').find('.select2-selection__placeholder').css('color', color)
}
//Navbar scroll detection
doc.on("mousemove", function (event) {
    if (event.pageY > $(window).height() - 40 && shown == false) {
        $("#mynavbar").slideDown();
        shown = true;
    }
    else if (event.pageY <= $(window).height() - 40 && shown == true && !search.data("open")) {
        $("#mynavbar").slideUp();
        shown = false;
    }
});
//Initialize a page - Called on ready and loadTab.
var init_page = function () {
    reloadSearch("Search")
    var webview = document.querySelector('#webview')
    console.log('Webview ' + webview)
    var contextMenu = require('electron-context-menu')({
        window: webview,
    });
    const indicator = $('.indicator')
    console.log(webview.shadowRoot)
    webview.addEventListener('page-title-updated', function () {
        csspath = path.resolve(__dirname, 'scrollbar.css')
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
        reloadSearch(webview.getURL(), 'white')
    })
    webview.addEventListener('did-fail-load', failload)
}
doc.ready(function () {
    $('.overlay').fadeOut(0)
    console.time("initpage");
    init_page()
    console.timeEnd("initpage");
    doc.bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0 && !contentdown) {
            console.log(animating)
            console.log('up')
            newH = $(window).height() - 20
            if (animating) {
                $('#windowbar').css('top', '0px;');
                content.css('top', '20px')
                content.css('height', newH + 'px')
            }
            else {
                $('#windowbar').animate({ top: 0 });
                animating = true;
                content.animate({
                    top: '20px',
                    height: newH
                }, function () { animating = false })
            }
            contentdown = true;
        }
        else if (e.originalEvent.wheelDelta / 120 <= 0 && contentdown) {
            console.log(animating)
            console.log('down')
            if (animating) {
                $('#windowbar').css('top', '-20px');
                content.css('top', '0')
                content.css('height', '100%')
            }
            else {
                animating = true;
                $('#windowbar').animate({ top: -20 })
                content.animate({
                    top: '0',
                    height: "100%"
                }, function () { animating = false })
            }
            contentdown = false;
        }
    });
})
$('#close').on('click', function () {
    ipcRenderer.sendSync('synchronous-message', 'close')
})
$('#min').on('click', function () {
    ipcRenderer.sendSync('synchronous-message', 'min')
})
$('#max').on('click', function () {
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
    loadURL(match(val))//from urlmatch
});
search.on("select2:open", function () {
    $(this).data("open", true);
});
search.on("select2:close", function () {
    $(this).data("open", false);
});
/**
 * Load a URL in webview.
*/
var loadURL = function (url) { //Defined as an external function for scoping with webview.
    webview.loadURL(url)
}
/**
 * Error handling script.
 */
var failload = function (error) {
    if (error.errorCode == -105) {
        console.log('loading')
        webview.loadURL('http://google.com/search?q=' + encodeURI(val))
    }
    if (!online) {
        webview.loadURL('file://pages/offline.html')
    }
}
/**
 * @param {tab} tabToLoad - The tab we are loading. 
 */
var loadTab = function (tabToLoad) {
    currentTabID = tabToLoad.id
    $('.awebview').each(function (index, elem) {
        $(elem).css('visibility', 'hidden')
        $(elem).attr("id", "hiddentab");
        console.log('Found webview '+$(elem).attr('tabID'))
        if ($(elem).attr('tabID') == tabToLoad.id) {
            $(elem).css('visibility', 'visible')
            $(elem).attr("id", "webview");
            return;
        }
    })
    init_page()
    $('.overlay').fadeOut('fast')
    overlayup = false;
}
doc.keydown(function (e) {
    //console.log(e.keyCode)
    if (e.keyCode == 123) {
        webview.openDevTools()
    }
})

class tab{
    /**
     * @param {string} URL - URL associated with tab. Currently not updating correctly, but not necessary
     * @param {number} width - Width of the image thumbnal
     * @param {number} height - Height of the image thumbnal
     * @param {string} imgsrc - Path of the actual image associated with the tab
     * @param {number} id - ID of the tab. Starting at 0 and incrememnting on creation
     */
    constructor(URL, width, height, imgsrc, id) {
        this.URL = URL;
        this.width = width;
        this.height = height;
        this.imgsrc = imgsrc;
        this.id = id;
        console.log('Constructor!')
        this.currwebview = '<webview id="webview" tabID="'+this.id+'" style="visibility:visible" class="awebview" src="'+URL+'"></webview>'
    }
    /**
     * Function to convert tab into thumbnail HTML
     * @returns {string} HTML string representing a thumbnail for tab display
     */
    getThumbnail() {
        return '<div class="tabContainer"><img class="tabPreview" \
                src="' + this.imgsrc + '"id="tab'+this.id+'" style ="width:' + this.width + ';height:' + this.height + '"></img></div>'
    }
}

doc.keyup(function (e) {
    if (e.keyCode == 18 && !overlayup) {
        $('.tabs').empty();
        img = webview.capturePage(function (image) {
            let imgsrc = image.toDataURL()
            let imgAR = image.getAspectRatio()
            let resizedW = (200 * imgAR).toString() + "px"
            let resiedH = "200px"
            if (tabContainer.length == 0) {
                tabContainer[0] = new tab(webview.getURL(), resizedW, resiedH, imgsrc, tabID)
            }
            tabContainer[currentTabID].imgsrc = imgsrc;
            for (let i = 0; i < tabContainer.length; i++) {
                $('.tabs').append(tabContainer[i].getThumbnail())
            }
            $('.tabs').append('<div class="tabContainer"><div class="tabPreview" id="newTab" \
            style ="width:' + resizedW + ';height:' + resiedH + ';background-color:rgba(0,0,0,0.5)">\
            <i class="fa fa-plus-square-o fa-4x" style="position:relative;top: 50%;transform: translateY(-50%);" aria-hidden="true"></i>\
            </div></div>')
            $('.tabPreview').on('click', function () {
                console.log('tabPreview clicked')
                if ($(this).attr('id') == 'newTab') {
                    tabID += 1;
                    newtab = new tab('file://pages/homepage.html', $(this).width(), $(this).height(), $(this).attr('src'), tabID)
                    tabContainer.push(newtab)
                    $('#content').prepend(newtab.currwebview)
                    loadTab(newtab)
                }
                else {
                    console.log(tabContainer)
                    for (let i = 0; i < tabContainer.length; i++) {
                        peekTab = tabContainer[i]
                        if ('tab' + peekTab.id == $(this).attr('id')) {
                            loadTab(peekTab)
                        }
                    }
                }
            })
        })
        $('.overlay').fadeIn('fast')
        overlayup = true;
    }
    else if (e.keyCode == 18 && overlayup) {
        $('.overlay').fadeOut('fast')
        overlayup = false;
    }
})