$('#search').keyup(function (event) {
    updateSearchText()
    if (event.key == 'Enter') {
        let query = getSearchQuery()
        $('#search').val('Loading!')
        if (query) { loadURL(match(query)) }
    }
})
const updateSearchText = function () {
    //$('#searchMatch').text(match($('#val1').text() + $('#val2').text()))
    $('#searchMatch').text(match(getSearchQuery()))
}
$('#search').focus(function () {
    console.log('focus')
    $(this).addClass('searchfocus');
});
$('#search').focusout(function () {
    console.log('focusout')
    $(this).removeClass('searchfocus');
});
const getSearchQuery = function () {

    return $('#search').val()
    //return $('#val1').text() + $('#val2').text()
}