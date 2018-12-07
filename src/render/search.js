$('#search').keyup(function (event) {
    updateSearchText()
    if (event.key == 'Enter') {
        let query = getSearchQuery()
        $('#search').val('Loading!')
        if (query) { loadURL(match(query)) }
    }
})

const updateSearchText = function () {
    $('#searchMatch').text(match(getSearchQuery()))
}

$('#search').focus(function () {
    $(this).addClass('searchfocus');
});

$('#search').focusout(function () {
    $(this).removeClass('searchfocus');
});

const getSearchQuery = function () {
    return $('#search').val()
}