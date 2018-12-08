const dialog = require('electron').remote.dialog;

function saveBookmark(name, URL){
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {}
    if(!bookmarks[name]) addBookmarkLink(name, URL)
    else editBookmarkLink(name, URL)
    bookmarks[name] = URL;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks)) 
}

function removeBookmark(name){
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {}
    delete bookmarks[name];
    removeBookmarkLink(name)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks)) 
}

function exportBookmarks(){
    let bookmarks = localStorage.getItem('bookmarks')
    let path = dialog.showSaveDialog({filters:[{name:'json', extensions:['json']}]})
    fs.writeFile(path, bookmarks, 'utf8', ()=>alert(`Exported bookmarks to ${path}`))
}

function importBookmarks(){
    if(!confirm('WARNING: This will override existing bookmarks. Continue?')) return
    let path = dialog.showOpenDialog({filters:[{name:'json', extensions:['json']}]})
    fs.readFile(path[0], (err, data)=>{
        if(err) throw err
        localStorage.setItem('bookmarks', data) 
        loadBookmarks()
    })
}


function addBookmarkLink(name, URL){
    $( "#bookmarks" ).append( `<a class="bookmark" id=${name} url=${URL}>${name}</a>` );
    $(`#${name}`).click( function () {
        const url = $(this).attr("url")
        const matched = match(url)
        console.log(matched)
        loadURL(matched) 
    })
}

function editBookmarkLink(name, URL){
    $(`#${name}`).attr("url", URL)
}

function removeBookmarkLink(name){
    $(`#${name}`).remove()
}

function loadBookmarks(){
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {}
    for (let [name, URL] of Object.entries(bookmarks)){
        addBookmarkLink(name, URL)
    }
}
