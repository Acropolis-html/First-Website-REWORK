const accordionButtonElement = document.querySelectorAll('.question')

accordionButtonElement.forEach((element) => {    // Чтобы addEventListener работал сразу на множество объектов, его нужно сначала перебрать
    element.addEventListener('click', () => {
        const answer = element.parentElement.querySelector('.answer');      // Мы типо находим answer по родительскому элементу, то есть по article, и не выходим за его пределы
        const plus = element.parentElement.querySelector('.accordion-plus')
        answer.classList.toggle('answer-onclick');

        if(answer.classList.contains('answer-onclick')) {
            plus.textContent = '–'
        } else {
            plus.textContent = '+'
        }
        })
})

function scrollSlider(direction) {
    const slider = document.getElementById("slider");
    const cardWidth = slider.querySelector(".card").offsetWidth;
    slider.scrollLeft += direction * cardWidth;
}

const formInputElement = document.querySelectorAll('.form-input')
const labelTimeElement = document.querySelector('.label-time')

formInputElement.forEach((input) => {

    const label = input.previousElementSibling;

    if(input.value.trim().length !== 0) {
        input.classList.add('form-input-focus');
        label.classList.add('label-focus')
    }

    input.addEventListener('focus', () => {
        input.classList.add('form-input-focus')
        label.classList.add('label-focus')
    })

    input.addEventListener('blur', () => {
        if (input.value.trim().length === 0) {
            input.classList.remove('form-input-focus')
            label.classList.remove('label-focus')
        }
    })
})

const timeElementBefore = document.querySelector('.time-input-before')
const timeElementAfter = document.querySelector('.time-input-after')
const timeLabel = document.querySelector(".label-time")


function updateTimeLabel() {
    if (timeElementBefore.value.length !== 0 && timeElementAfter.value.length !== 0) {
        timeLabel.classList.add('label-focus');
    } else {
        timeLabel.classList.remove('label-focus');
    }
}

updateTimeLabel();

timeElementBefore.addEventListener('input', updateTimeLabel);
timeElementAfter.addEventListener('input', updateTimeLabel);

const registrationForm = document.querySelector('.form-form')

registrationForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const now = new Date()
    const isoDate = now.toISOString().split('T')[0]

    const dateInputElement = document.querySelector('#date')
    
    if(dateInputElement.value < isoDate) {
        alert('Ваша дата раньше чем сегодня, выберите новую дату')
        return
    }

    if(timeElementBefore.value > timeElementAfter.value) {
        alert('Вы неправильно написали время')
        return
    }

    const formData = new FormData(registrationForm)
    const formDataObject = Object.fromEntries(formData)

    fetch('http://localhost:3000/bookings')
        .then(response => response.json())
        .then(booking => {
            let hasConflict = booking.some(bookings =>
                bookings.date === formDataObject.date &&
                bookings['field-selector'] === formDataObject['field-selector'] &&
                formDataObject['from-time'] < bookings['to-time'] &&
                formDataObject['to-time'] > bookings['from-time']
            )

            if (hasConflict) {
                alert('Занято, выберите другое время или поле');
                return
            }

            alert('Успешно!')
            registrationForm.reset()

            fetch('http://localhost:3000/bookings', {
                method: 'post',
                body: JSON.stringify({...formDataObject})
                }).then((response) => {
                    return response.json()
            })
            
        })
    
})

