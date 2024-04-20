function Validator(options){

    var selectorRules = {};

    // hàm thực hiện validate
    function validate(inputElement,rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        // var errorMessage = rule.test(inputElement.value);
        var errorMessage;

        // lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // console.log(rules);

        // lập qua từng rule & kiếm tra
        // new có lỗi thì dừng việc kiểm tra
        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) {
                break;
            }
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }
        else
        {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');

        }

        return !errorMessage;
    }

    // lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {

        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // lặp qua từng rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement,rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });


            if (isFormValid) {
                // example 1  : using function & javascript
                if (typeof options.onSubmit === 'function') {

                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');

                    var formValues = Array.from(enableInputs).reduce(function (values,input) {
                        values[input.name] = input.value;
                        return values;
                    },{});
        
                    // console.log(enableInputs);
                    // console.log(formValues);
        
                    
                    options.onSubmit(formValues);
                }
                // example 2 : using submit with default
                else
                {
                    formElement.submit();
                }
            }            
        }

        // lặp qua mỗi rule và xử lý (lắng nghe sự kiện, blur, input ...)
        options.rules.forEach(function (rule) {
            // console.log(rule.selector); // #fullname

            // lưu lại các rules cho mỗi input
            // selectorRules[rule.selector] = rule.test;
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);

            }else{
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
            // console.log(inputElement); // input #fullname

            if (inputElement) {
                // xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement,rule);
                }

                // xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');        
                }
            }
        });

        // console.log(selectorRules)
    }
}

/**
 * Nguyên tắc của các rules
 * 1.   Khi có lỗi  ->  trả ra message lỗi
 * 2.   Khi hợp lệ  ->  không trả ra cái gì cả underfined
 */

Validator.isRequired = function (selector,message) {
    return {
        selector : selector,
        test : function (value) {
            return value.trim() ? undefined : message ||'Vui lòng nhập trường này !';
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
Validator.minLength = function (selector,min) {
    return {
        selector : selector,
        test : function (value) {
            
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
        }
    };
}
Validator.isConfirmed = function (selector,getCofirmValue, message) {
    return {
        selector : selector,
        test : function (value) {
            return value === getCofirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    };
}