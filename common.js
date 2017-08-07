$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$.noty.defaults.killer    = true;
$.noty.defaults.layout    = 'topCenter';
$.noty.defaults.theme     = 'relax';
$.noty.defaults.timeout   = 3000;
$.noty.defaults.animation = {
    open: 'animated fadeInDown',
    close: 'animated fadeOutUp'
};

function precision(currency) {
    switch (currency.toUpperCase()) {
        case 'USD':
            return 2;

        default:
            return 8;
    }
}

getNumber = function(value, dp){
    var reg = '^[0-9]*' + (dp > 0 ? '\\.?[0-9]{0,' + dp + '}' : '\\.?[0-9]*') + '$';

    var regex = new RegExp(reg);
    if (regex.test(value)) return value;

    var reg = '[^0-9' + (dp != 0 ? '.' : '') + ']';
    var regex = new RegExp(reg, 'g');
    value = value.replace(regex, '');

    if (dp != 0) {
        var reg = /\./g;
        var regArray = reg.exec(value);
        if (regArray != null) {
            var reg3Right = value.substring(regArray.index + regArray[0].length);
            reg3Right = reg3Right.replace(reg, '');
            reg3Right = dp > 0 ? reg3Right.substring(0, dp) : reg3Right;
            value = value.substring(0, regArray.index) + '.' + reg3Right;
        }
    }

    return value;
};

blockNonNumbers = function(obj, e){
    var key,
        isCtrl = false,
        keychar,
        reg;

    if (window.event) {
        key    = e.keyCode;
        isCtrl = window.event.ctrlKey
    }
    else if(e.which) {
        key    = e.which;
        isCtrl = e.ctrlKey;
    }

    if (isNaN(key)) return true;

    keychar = String.fromCharCode(key);

    // check for backspace or delete, or if Ctrl was pressed
    if (key == 8 || isCtrl)
        return true;

    reg = /\d/;
    var isFirstD = keychar == '.' && obj.value.indexOf('.') == -1;

    return isFirstD || reg.test(keychar);
};

checkFieldLimit = function(field) {
    var name   = field.attr('name'),
        value  = parseFloat(field.val()),
        err    = field.closest('div.input-group').next('small.text-danger'),
        limits = window.emporium.limits;

    err.html('');

    if (isNaN(value))
        return;

    if (limits[name + '_min'] > 0 && limits[name + '_min'] > value)
        err.html('too low - min: ' + limits[name + '_min']);
    else if (limits[name + '_max'] > 0 && limits[name + '_max'] < value)
        err.html('too high - max: ' + limits[name + '_max']);
};

clearFieldLimit = function(field) {
    var name = field.attr('name'),
        err  = field.closest('div.input-group').next('small.text-danger');

    err.html('');
};

copyToClipboard = function(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;

    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    }
    else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.bottom = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function")
        currentFocus.focus();

    if (isInput)
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    else
        // clear temporary content
        target.textContent = "";

    return succeed;
};