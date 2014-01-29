var _editor = null;

$(function() {
    _editor = new Editor({
        article: _article,
        element: $("#wrapper")
    });
    $("#textcontent").hallo({
        plugins: {
            'halloformat': {},
            'halloheadings' : {}
        },
        toolbar: 'halloToolbarFixed'
    });
})