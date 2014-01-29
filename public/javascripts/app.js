var _editor = null;

$(function() {
    _editor = new Editor({
        article: _article,
        element: $("#textcontent")
    });
    $("#textcontent").hallo({
        plugins: {
            'halloformat': {},
            'halloheadings' : {}
        },
        toolbar: 'halloToolbarFixed'
    });
})