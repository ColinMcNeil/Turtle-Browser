//Injected JS to every page. 
const { ipcRenderer } = require('electron')

//Send Do-Not-Track request to every page
navigator.doNotTrack = 1;
window.doNotTrack = 1;
navigator.msDoNotTrack = 1;

//Interrupts hyperlink clicks, then sends the URL back to the render process.
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
        if (!e.target.href) { //Sometimes links are not redirects (web apps)
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        setTimeout(function () {
            var path = e.target.href;
            console.log(path)
            ipcRenderer.sendToHost('navAttempt', path);
        }, 100);
        return false;
    }, true);
});