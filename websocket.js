websocketInit = function() {
    window.connection = new autobahn.Connection({
        url:    bf.ws,
        realm: 'realm1'
    });

    window.connection.onopen = function (session) {
        for (var room in connections) {
            var fn = connections[room];
            if (typeof fn === 'function')
                session.subscribe(room, fn);
            else console.log(fn, 'Not a function');
        }
    };
};

websocketDirectUserEvent = function(data) {
    console.log('USER DIRECT', data);

    for (var i in data) {
        var object = data[i];

        if (object.balance !== null) {
            var balance = object.balance;
            for (var currency in balance)
                $('.balance.' + currency + '_available').text(balance[currency].available);
        }
    }
};

$(document).ready(function(){
    websocketInit();

    window.connection.open();
});