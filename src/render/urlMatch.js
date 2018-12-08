const tld = require('tldjs')
const match = function (query) {
    splitquery = query.split('.')
    if (query.startsWith('r/') || query.startsWith('/r/')) { return 'https://reddit.com/r/' + query.split('r/')[1] }
    
    if (query.startsWith('file://')) {
        return query;
    }
    if(query.startsWith(':://')){
        return 'Run Command: '+query.split(':://')[1]
    }
    if (query.startsWith('http://') || query.startsWith('https://')) {
        return query;
    }
    if (query.startsWith('www.')){
        return 'http://'+query
    }
    if (splitquery.length == 1) {
        return 'http://google.com/search?q=' + encodeURI(query);
    }
    domain = splitquery[splitquery.length - 2] + '.' + splitquery[splitquery.length - 1]
    
    if (tld.isValid(domain)) {
        return 'http://'+query
    }
    else {
        return query;
    }
}
const getDomain = function (query) {
    return query.split('://')[1].split('/')[0]
}
