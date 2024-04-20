function Validator(options){
    var formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(function (rule) {
            console.log(rule.selector); // #fullname

            var inputElement = formElement.querySelector(rule.selector);
            var errorElement = inputElement.parentElement.querySelector('.form-message');
            console.log(inputElement); // input #fullname

            if (inputElement) {
                inputElement.onblur = function () {
                    // value : inputElement.value
                    // test func : rule.test
                    // rule.test();

                    var errorMessage = rule.test(inputElement.value);
                    if (errorMessage) {
                        errorElement.innerText = errorMessage;
                    }
                    else
                    {
                        errorElement.innerText = '';
                    }


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
        test : function () {
            
        }
    };
}