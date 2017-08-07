$(document).ready(function(){
    var hash = window.location.hash;

    // Work around Facebook return path
    if (hash == '#_=_') hash = null;

    var first = hash ? $('a[href="' + hash + '"]', '.nav-tabs') : $('a', '.nav-tabs').eq(0);
    first.tab('show');
    first.addClass('active');

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var hash = $(this).attr('href');
        window.location.hash = hash;
        $('a[href="' + hash + '"]', '.nav-tabs').tab('show');

        window.lazyload();
    });

    window.lazyload();
});