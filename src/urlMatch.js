const tld = require('tldjs')
const match = function (query) {
    if(query == ''){return 'http://pages/homepage.html'}
    splitquery = query.split('.')
    if (query.startsWith('r/') || query.startsWith('/r/')) { return 'https://reddit.com/r/' + query.split('r/')[1] }
    if (splitquery.length == 1) {
        return 'http://google.com/search?q=' + encodeURI(query);
    }
    if (query.startsWith('http://') || query.startsWith('https://')) {
        return query;
    }
    else if (query.startsWith('www.')){
        return 'http://'+query
    }
    domain = splitquery[splitquery.length - 2] + '.' + splitquery[splitquery.length - 1]
    //console.log('verifying ' + domain)
    
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
