/**
 * @param {tab} tabToLoad - The tab we are loading. 
 */
var loadTab = function (tabToLoad) {
    for (let i = 0; i < tabContainer.length; i++) {
        if (tabContainer[i].id === tabToLoad.id) {
            currentTabID = i;
            break;
        }
    }
    $('.awebview').each(function (index, elem) {
        $(elem).css('visibility', 'hidden')
        $(elem).attr("id", "hiddentab");
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
class tab {
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
        this.currwebview = '<webview id="webview" preload="src/preload.js" tabID="' + this.id + '" style="visibility:visible" class="awebview" src="' + URL + '"></webview>'
    }
    /**
     * Function to convert tab into thumbnail HTML
     * @returns {string} HTML string representing a thumbnail for tab display
     */
    getThumbnail() {
        return '<div class="tabContainer">\
        <i class="fa fa-times closeTab" id="closeTab' + this.id + '" aria-hidden="true"></i>\
        <img class="tabPreview" src="' + this.imgsrc + '"id="tab' + this.id + '" style ="width:' + this.width + ';height:' + this.height + '">\
        </img></div>'
    }
    remove(container) {
        $('.webview').each(function (index, elem) {
            if ($(elem).attr('tabID') == this.id.toString()) {
                $(elem).remove()
            }
        })

        if (container.length == 1 && container[0].id == this.id) {
            for (let i = 0; i < container.length; i++) {
                if (container[i].id == this.id) {
                    container.splice(i, 1)
                    return;
                }
            }
            tabID += 1;
            let newtab = new tab('file://pages/homepage.html', this.width, this.height, 'null', tabID)
            container.push(newtab)
            $('#content').prepend(newtab.currwebview)
            loadTab(newtab)
        }
        for (let i = 0; i < container.length; i++) {
            if (container[i].id == this.id) {
                container.splice(i, 1)
                let nextTab = (container[i - 1] ? i - 1 : i)
                loadTab(container[nextTab])
                return;
            }
        }

    }
}
const initializeTabs = function () {
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
        tabContainer[currentTabID].width = resizedW;
        for (let i = 0; i < tabContainer.length; i++) {
            $('.tabs').append(tabContainer[i].getThumbnail())
        }
        $('.tabs').append('<div class="tabContainer"><div class="tabPreview" id="newTab" \
            style ="width:' + resizedW + ';height:' + resiedH + ';background-color:rgba(0,0,0,0.5)">\
            <i class="fa fa-plus-square-o fa-4x" style="position:relative;top: 50%;transform: translateY(-50%);" aria-hidden="true"></i>\
            </div></div>')
        $('.tabPreview').on('click', function () {
            if ($(this).attr('id') == 'newTab') {
                tabID += 1;
                newtab = new tab('pages/homepage.html', $(this).width(), $(this).height(), $(this).attr('src'), tabID)
                tabContainer.push(newtab)
                $('#content').prepend(newtab.currwebview)
                loadTab(newtab)
            }
            else {
                for (let i = 0; i < tabContainer.length; i++) {
                    peekTab = tabContainer[i]
                    if ('tab' + peekTab.id == $(this).attr('id')) {
                        loadTab(peekTab)
                    }
                }
            }
        })
        $('.closeTab').on('click', function () {
            let myID = $(this).attr('id').split('closeTab')[1]
            $('#tab' + myID).fadeOut('fast', function () {
                for (let i = 0; i < tabContainer.length; i++) {
                    let peekTab = tabContainer[i]
                    if (peekTab.id == myID) {
                        peekTab.remove(tabContainer)
                    }
                }
                $(this).remove()
            })
        })
    })
}