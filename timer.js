function updateTimer() {
    $('.countdown').each(function(i, j){
        var span  = $(this),
            start = new Date(span.data('date')),
            ts    = countdown(start);

        if (ts.value < 0) {
            span.html(ts.toHTML());

            requestAnimationFrame(updateTimer);
        }
    });
}

$(document).ready(function(){
    updateTimer();
});