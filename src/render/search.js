$('#search').keyup(function (event) {
    updateSearchText()
    if (event.key == 'Enter') {
        let query = getSearchQuery()
        
        if(query.startsWith(':://')){
            let command = query.split(':://')[1]
            console.log(command)
            if(Object.keys(commands).includes(command)) commands[command]()
            else alert(`${command} is not a valid command`)
            return
        }

        if (query) { 
            $('#search').val('Loading!')
            loadURL(match(query)) 
        }
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