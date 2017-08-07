validate = function(rule, field) {
    var param = null,
        value = field.val().trim();

    if (rule.indexOf(':') != -1) {
        var t = rule.split(':');
        rule  = t[0];
        param = t[1];
    }

    switch (rule) {
        case 'required':
            if (value === '')
                return 'This field is required';

            return true;

        case 'email':
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (value !== '' && !re.test(value))
                return 'This field does not seem to be a proper email address';

            return true;

        case 'alphanumeric':
            var re = /^[a-z0-9]+$/i;
            if (value !== '' && !re.test(value))
                return 'This field should only contain alphanumerical value';

            return true;

        case 'max':
            if (value !== '' && value.length > param)
                return 'This field is too long - max ' + param;

            return true;

        case 'min':
            if (value !== '' && value.length < param)
                return 'This field is too short - min ' + param;

            return true;

        case 'less_than':
            if (value !== '' && value > param)
                return 'This field should be at most ' + param;

            return true;

        case 'greater_than':
            if (value !== '' && value < param)
                return 'This field should be at least ' + param;

            return true;

        case 'matches':
            var compare = $('#' + param).val();
            if (value !== '' && value !== compare)
                return 'This field does not match the field ' + param;

            return true;

        case 'phone':
            if (value !== '' && field.intlTelInput('isValidNumber')) {
                var number  = field.intlTelInput('getNumber'),
                    country = field.intlTelInput('getSelectedCountryData');

                $('#' + field.attr('id') + '_number').val(number);
                $('#' + field.attr('id') + '_country').val(country['iso2'].toUpperCase());

                return true;
            }

            return value === '' ? true : 'This phone number is invalid';
    }
};

$(document).ready(function() {
    $(document).on('blur', 'form.validate input', function() {
        var validation = $(this).data('validate'),
            block      = $(this).closest('.form-group');

        block.removeClass('has-error');

        if (validation !== undefined) {
            var rules = validation.split(' ');

            for (var i in rules) {
                var rule = rules[i],
                    res  = validate(rule, $(this));

                if (res !== true) {
                    if ($(this).hasClass('phone'))
                        $(this).parent().next('small.error').html(res);
                    else $(this).next('small.error').html(res);

                    block.addClass('has-error');

                    break;
                }
            }
        }
    });

    $(document).on('focus', 'form.validate input', function() {
        var block = $(this).closest('.form-group.has-error');

        if (block.length)
            block.removeClass('has-error');
    });

    $(document).on('submit', 'form.validate', function(event) {
        var form   = $(this),
            submit = $('input[type="submit"], button[type="submit"]', form);

        submit.attr('disabled', 'disabled');

        // Let's remove all the errors
        $('.form-group.has-error', form).removeClass('has-error');

        var proceed = true;

        // Let's go through all the fields that require validation and pof
        $('input', form).each(function(idx, element){
            var el         = $(element),
                validation = el.data('validate'),
                block      = $(this).closest('.form-group');

            block.removeClass('has-error');

            if (validation !== undefined) {
                var rules = validation.split(' ');

                for (var i in rules) {
                    var rule = rules[i],
                        res  = validate(rule, $(this));

                    if (res !== true) {
                        if ($(this).hasClass('phone'))
                            $(this).parent().next('small.error').html(res);
                        else $(this).next('small.error').html(res);

                        block.addClass('has-error');

                        proceed = false;

                        break;
                    }
                }
            }
        });

        submit.removeAttr('disabled');

        if (!proceed)
            form.addClass('invalid');
        else form.removeClass('invalid');
    });
});