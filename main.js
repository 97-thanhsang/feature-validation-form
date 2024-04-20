function Validator(options){

    // hàm thực hiện validate
    function validate(inputElement,rule){
        var errorElement = inputElement.parentElement.querySelector('.form-message');
        var errorMessage = rule.test(inputElement.value);
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }
        else
        {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');

        }
    }

    // lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(function (rule) {
            console.log(rule.selector); // #fullname

            var inputElement = formElement.querySelector(rule.selector);
            console.log(inputElement); // input #fullname

            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement,rule);
                }
            }
        })
    }
}

/**
 * Nguyên tắc của các rules
 * 1.   Khi có lỗi  ->  trả ra message lỗi
 * 2.   Khi hợp lệ  ->  không trả ra cái gì cả underfined
 */

Validator.isRequired = function (selector) {
    return {
        selector : selector,
        test : function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này !';
        }
    };
}
Validator.isEmail = function (selector) {
    return {
        selector : selector,
        test : function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            
            return regex.test(value) ? undefined : 'Trường này phải là email!';
        }
    };
}