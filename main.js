let id = 0
let userAnswers = []

//Botones
const UserRestartButton = document.querySelector('.restart.menuButton')
const userFormButton = document.querySelector('.register.menuButton')
const userSendButton = document.querySelector('.send.menuButton')
const registerBtnText = document.querySelector('.register p')
const sendBtnText = document.querySelector('.send p')

//Span
const namesSpan = document.querySelector('.user-form .nombre span')
const lastnameSpan = document.querySelector('.user-form .apellido span')
const emailSpan = document.querySelector('.user-form .correo span')
const sendBtnSpan = document.querySelector('.sendButtonContainer .buttonMessage')
var questionSpan

//Inputs
const names = document.querySelector('.user-form #nombre')
const lastname = document.querySelector('.user-form #apellidos')
const email = document.querySelector('.user-form #correo')
var radioInputs

//Vistas
const registerForm = document.querySelector('.user-view.view')
const testForm = document.querySelector('.test-view.view')
const confirmationForm = document.querySelector('.confirmationBg')

//Spinners
const spinnerForm = document.querySelector('.register .spinner')
const spinnerSend = document.querySelector('.send .spinner')

//Cuadro de preguntas
const testFormDiv = document.querySelector('.test-form.test')

//Cuadro de error
const errorMessage = document.querySelector('.errorMessage')
const errorText = document.querySelector('.errorMessage p')


const nameError = (message) => {
	names.classList.add('wrong')
	namesSpan.textContent = message
	namesSpan.classList.remove('hide')
}

const lastnameError = (message) => {
	lastname.classList.add('wrong')
	lastnameSpan.textContent = message
	lastnameSpan.classList.remove('hide')
}

const emailError = (message) => {
	email.classList.add('wrong')
	emailSpan.textContent = message
	emailSpan.classList.remove('hide')
}

const showSpinnerRegister = () => {
	spinnerForm.classList.remove('hide')
	registerBtnText.classList.add('hide')
}

const showErrorMessage = () => {
	errorMessage.classList.add('showError')
}

const hideErrorMessage = () => {
	errorMessage.classList.remove('showError')
}

const setErrorMessage = (message) => {
	errorText.innerHTML = message
}

const hideSpinnerRegister = () => {
	spinnerForm.classList.add('hide')
	registerBtnText.classList.remove('hide')
}

const showSpinnerSend = () => {
	spinnerSend.classList.remove('hide')
	sendBtnText.classList.add('hide')
}

const hideSpinnerSend = () => {
	spinnerSend.classList.add('hide')
	sendBtnText.classList.remove('hide')
}

const showSendButtonMessage = () =>{
	sendBtnSpan.classList.remove('hide')
}

const hideSendButtonMessage = () =>{
	sendBtnSpan.classList.add('hide')
}

const showConfirmationForm = () =>{
	confirmationForm.classList.remove('hide')
}

const hideConfirmationForm = () =>{
	confirmationForm.classList.add('hide')
}

const showTestForm = () => {
	registerForm.classList.add('hide')
	testForm.classList.remove('hide')
	hideSpinnerRegister()
}

const showRegisterForm = () => {
	registerForm.classList.remove('hide')
	testForm.classList.add('hide')
	hideConfirmationForm()
	hideSpinnerRegister()
}
showRegisterForm()

const validateUser = () => {
	const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (names.value.trim() === "") {
    nameError('Required field.')
		return false
  }

	if (names.value.length < 2 || names.value.length > 50) {
		nameError('Invalid name.')
		return false
	}

	if (!namePattern.test(names.value)) {
		nameError('Invalid name.')
		return false
	}

	if (lastname.value.trim() === "") {
		lastnameError('Required field.')
		return false
	}

	if (lastname.value.length < 2 || names.value.length > 50) {
		lastnameError('Invalid last name.')
		return false
	}

	if (!namePattern.test(lastname.value)) {
		lastnameError('Invalid last name.')
		return false
	}

	if (email.value.trim() === "") {
    emailError('Required field.')
		return false
  }

  if (!emailPattern.test(email.value)) {
    emailError('Invalid email.')
		return false
  }

	return true
}

const foundMissing = () =>{
	let missing = []
	for (let x = 0; x < 5; x++) {
		let cn = 0
		for (let y = 0; y < 4; y++) {
			if (!document.querySelector(`#opcion${y}_${x}`).checked) {
				cn++
			}
		}
		if (cn === 4) {
			missing.push(x)
		}
	}
	return missing
}


names.addEventListener('input', () => {
	names.classList.remove('wrong')
	namesSpan.classList.add('hide')
})

lastname.addEventListener('input', () => {
	lastname.classList.remove('wrong')
	lastnameSpan.classList.add('hide')
})

email.addEventListener('input', () => {
	email.classList.remove('wrong')
	emailSpan.classList.add('hide')
})

UserRestartButton.addEventListener('click', () => {
	location.reload();
})

userFormButton.addEventListener('click', (event) => {
	event.preventDefault()
	if (validateUser() === true) {
		showSpinnerRegister()
		registerEstudiante()
	}
})

userSendButton.addEventListener('click', (event) => {
	event.preventDefault()
	showSpinnerSend()
	hideSendButtonMessage()

	let missing = foundMissing()

	if (missing.length === 0) {

		for (let i = 0; i < radioInputs.length; i++) {
			if (radioInputs[i].checked) {
				userAnswers.push(radioInputs[i].value)
			}
		}
		sendAnswers(userAnswers)

	}else{

		hideSpinnerSend()
		showSendButtonMessage()
		for (let i = 0; i < missing.length; i++) {
			questionSpan[missing[i]].classList.remove('hide')
		}

	}
})


const registerEstudiante = async() => {
	
	const url = 'https://kodigo-academy.fly.dev/api/v1/estudiantes/register'

	const data = {
		nombres: `${names.value}`,
		apellidos: `${lastname.value}`,
		correo: `${email.value}`,
	}

	try {

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}

		const response = await fetch(url, options)
		
		if (!response.ok) {
			hideSpinnerRegister()
			throw new Error('Already registered.')

		}else{
			const responseData = await response.json()

			if (responseData.status) {
				getQuestions(responseData.data)
				showTestForm()
				hideSpinnerRegister()
			}

		}

	} catch (error) {
		hideSpinnerRegister()
		if(error.message === 'Failed to fetch'){
			errorText.innerHTML = "Failed to connect to the server."
		}else if (error.message === "Already registered.") {
			errorText.innerHTML = "This email is already registered."
		}

		showErrorMessage()
		setTimeout(() => {
			hideErrorMessage()
		}, 5000);
	}
}

const getQuestions = async(data) => {

	const url = 'https://kodigo-academy.fly.dev/api/v1/questions/get'

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}

	try {

		const response = await fetch(url, options)
		
		if (!response.ok) {
			throw new Error('There was a problem getting the questionnaire questions.')
		} else {
			
			const responseData = await response.json()
			const questions = responseData.data.questions
			id = responseData.data.user_id
			showQuestions(questions)

		}

	} catch (error) {
		console.log("Error: "+error)
	}
}


const showQuestions = (questions) => {
	
	questions.forEach((question, x) => {
		testFormDiv.innerHTML += `
			<div class="questionContainer">
				<p class="question">${x+1}. ${question.statement}<span class="errorSpan hide">*</span></p>
				<div class="optionContainer${x} option">
					<div class="wrapper0"></div>
					<div class="wrapper1"></div>
				</div>
			</div>
		`

		let questionOptions = question.options	

		questionOptions.forEach((option, i) => {
			if (i === 0 || i === 1) {
				document.querySelector(`.optionContainer${x} .wrapper0`).innerHTML += `
					<div>
						<input type="radio" id="opcion${i}_${x}" name="opciones${x}" value="${option.option_id}">
						<label for="opcion${i}_${x}">${option.text}</label>
					</div>
				`
			}else if(i === 2 || i === 3){
				document.querySelector(`.optionContainer${x} .wrapper1`).innerHTML += `
					<div>
						<input type="radio" id="opcion${i}_${x}" name="opciones${x}" value="${option.option_id}">
						<label for="opcion${i}_${x}">${option.text}</label>
					</div>
				`
			}
		})
	})
	radioInputs = document.querySelectorAll('input[type="radio"]')
	questionSpan = document.querySelectorAll('.question span')
}

const sendAnswers = async(userAnswers) => {

	url = 'https://kodigo-academy.fly.dev/api/v1/answers/create'

	const data = {
		user_id: id,
		answers: userAnswers
	}

	try{
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}

		const response = await fetch(url, options)

		if (!response.ok) {
			throw new Error("There was a problem sending your answers.")
			
		}else{
			const responseData = await response.json()
			hideSpinnerSend()
			showConfirmationForm()
		}

	}catch(error){
		console.log(error)
		hideSpinnerSend()
	}
}
