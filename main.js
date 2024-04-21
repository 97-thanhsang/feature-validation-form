function Validator(options){

    function getParent(element,selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // hàm thực hiện validate
    function validate(inputElement,rule){
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);;
        // var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        // var errorMessage = rule.test(inputElement.value);
        var errorMessage;

        // lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // console.log(rules);

        // lập qua từng rule & kiếm tra
        // new có lỗi thì dừng việc kiểm tra
        for (let i = 0; i < rules.length; i++) {

            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':     
                    errorMessage = rules[i](
                        document.querySelector(rule.selector + ':checked')
                    );
               
                    break;
            
                default:
                    errorMessage = rules[i](inputElement.value);
                    break;
            }

            if (errorMessage) {
                break;
            }
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement,options.formGroupSelector).classList.add('invalid');
        }
        else
        {
            errorElement.innerText = '';
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid');

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
                        

                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="'+ input.name +'"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                        
                            default:
                                values[input.name] = input.value;
                                break;
                        }

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

            var inputElements = formElement.querySelectorAll(rule.selector);
            // console.log(inputElement); // input #fullname

            Array.from(inputElements).forEach(function (inputElement) {
                if (inputElement) {
                    // xử lý trường hợp blur khỏi input
                    inputElement.onblur = function () {
                        validate(inputElement,rule);
                    }
    
                    // xử lý mỗi khi người dùng nhập vào input
                    inputElement.oninput = function () {
                        var parentElement = getParent(inputElement,options.formGroupSelector);
                        var errorElement = parentElement.querySelector(options.errorSelector);;
                        errorElement.innerText = '';
                        parentElement.classList.remove('invalid');        
                    }

                    // xử lý mỗi khi onchange selected

                    inputElement.onchange = function () {
                        validate(inputElement,rule);
                    }
                }
            })


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
            return value ? undefined : message ||'Vui lòng nhập trường này !';
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
Validator.isConfirmed = function (selector,getConfirmValue, message) {
    return {
        selector : selector,
        test : function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    };
}