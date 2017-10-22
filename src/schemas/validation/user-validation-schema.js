//
//  user-validation-schema.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-01-25.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

module.exports = {
     'name.first': { //
        optional: false, // won't validate if field is empty
        isLength: {
            options: [{ min: 2, max: 10 }],
            errorMessage: 'Имя должно содержать не более 20 символов' // Error message for the validator, takes precedent over parameter message
        },
        isName: {
            errorMessage: 'Некорректное имя'
        }

    },
    'name.last': { //
        optional: false, // won't validate if field is empty
        isLength: {
            options: [{ min: 2, max: 10 }],
            errorMessage: 'Фамилия должна содержать не более 20 символов' // Error message for the validator, takes precedent over parameter message
        },
        isName: {
            errorMessage: 'Некорректная фамилия'
        }
    },
    'email': {
        notEmpty: {
            errorMessage: 'Вы не ввели E-mail'
        },
        isEmail: {
            errorMessage: 'E-mail введен некорректно'
        },
        isEmailAvailable : {
            errorMessage: 'Введенный Вам E-mail уже зарегистрирован!'
        }

    },
    'password': {
        notEmpty: {
            errorMessage: 'Введите пароль'
        },
        isLength: {
            options: [{ min: 6, max: 20 }],
            errorMessage: 'Пароль должен содержать не более 20 символов' // Error message for the validator, takes precedent over parameter message
        },
    },
    'repassword': {
        notEmpty: {
            errorMessage: 'Пароли не совпадают'
        }
    }
}
