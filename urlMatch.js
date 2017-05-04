const tld = require('tldjs')
const match = function (query) {
    if (query.startsWith('http://') || query.startsWith('https://')) {
        return query;
    }
    else if (query.startsWith('www.')){
        return 'http://'+query
    }
    splitquery = query.split('.')
    domain = splitquery[splitquery.length - 2] + '.' + splitquery[splitquery.length - 1]
    console.log('verifying ' + domain)
    if (tld.isValid(domain)) {
        return 'http://'+query
    }
    else {
        return query;
    }
}