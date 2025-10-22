const selectors = {
    form: '[data-js-form]',
    fieldErrors: '[data-js-form-field-errors]'
}

const errorsList = {
    valueMissing: () => 'пожалуйста, заполните это поле',
    patternMismatch: (field) => field.title || 'неверный формат',
    tooShort: (field) => {
        const minLength = 'minLength' in field ? field.minLength : -1;
        return `минимум символов — ${minLength}`;
    },
    tooLong: (field) => {
        const maxLength = 'maxLength' in field ? field.maxLength : -1;
        return `максимум символов — ${maxLength}`;
    },
}

function manageErrors(fieldControlElement, errorMessages) {
    const fieldErrorsElement = fieldControlElement.parentElement?.querySelector(selectors.fieldErrors)

    if (!fieldErrorsElement) return

    fieldErrorsElement.innerHTML = errorMessages
        .map((message) => `<span class="field__error">${message}</span>`)
        .join('')
}

function validateField(fieldControlElement) {
    const errors = fieldControlElement.validity;
    const errorMessages = [];

    // Проверяем только известные свойства
    if (errors.valueMissing) {
        errorMessages.push(errorsList.valueMissing());
    }
    if (errors.patternMismatch) {
        errorMessages.push(errorsList.patternMismatch(fieldControlElement));
    }
    if (errors.tooShort) {
        errorMessages.push(errorsList.tooShort(fieldControlElement));
    }
    if (errors.tooLong) {
        errorMessages.push(errorsList.tooLong(fieldControlElement));
    }

    manageErrors(fieldControlElement, errorMessages);

    const isValid = errorMessages.length === 0;
    fieldControlElement.ariaInvalid = (!isValid).toString();

    return isValid;
}

function onBlur(event) {
    const target = event.target

    if (!target) return

    const isFormField = target.closest(selectors.form)
    const isRequired = target.required

    if (isFormField && isRequired) {
        validateField(target)
    }
}

function onInput(event) {
    const target = event.target

    if (!target) return;

    const errorSpan = target.closest('label')?.querySelector('.fields_error');

    if (errorSpan) {
        errorSpan.textContent = '';
    }
}

function onChange(event) {
    const target = event.target

    if (!target) return

    const isRequired = target.required
    const isToggleType = ['radio', 'checkbox'].includes(target.type)

    if (isToggleType && isRequired) {
        validateField(target)
    }
}

function onSubmit(event) {
    const target = event.target

    if (!target) return false;

    const isFormElement = target.matches(selectors.form)
    if (!isFormElement) {
        return false;
    }

    const formElements = Array.from(target.elements)
    const requiredControlElements = formElements.filter(element => element.required)

    let isFormValid = true
    let firstInvalidFieldControl = null

    requiredControlElements.forEach((element) => {
        const isFieldValid = validateField(element)

        if (!isFieldValid) {
            isFormValid = false
            if (!firstInvalidFieldControl) {
                firstInvalidFieldControl = element
            }
        }
    })

    if (!isFormValid && firstInvalidFieldControl) {
        event.preventDefault()

        if ('focus' in firstInvalidFieldControl) {
            (firstInvalidFieldControl).focus();
        }
    }

    return isFormValid;
}

function onCheckSubmit(event, func) {
    const check = onSubmit(event);

    if (check) {
        func()
    }
}

export { onBlur, onInput, onSubmit, onChange, onCheckSubmit }