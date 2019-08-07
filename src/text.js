const wrongLogin = 'Podaj login'
const wrongPassword = 'Podaj hasło'
const wrongEmail = 'Podaj email'
const accountCreated = 'Konto utworzone, sprawdź e-mail w celu aktywacji konta.'
const accountInactive = "Konto nieaktywne"
const emailExists = 'Podany e-mail już istnieje'
const userExists = 'Podany login już istnieje'
const unexpectedError = 'Wystąpił nieoczekiwany błąd'
const passwordRequirements = "Hasło musi zawierać przynajmniej 6 znaków"
const loginRequirements = "Podaj login"
const emailRequirements = "Niepoprawny adres e-mail"
const passwordChanged = "Hasło zostało zmienione"
const passwordsDifferent = "Podane hasła różnią się"
const wrongCredentials = "Dane logowania niepoprawne"

module.exports = {
	wrongLogin: wrongLogin,
	wrongPassword: wrongPassword,
	wrongEmail: wrongEmail,
	accountCreated: accountCreated,
	userExists: userExists,
	unexpectedError: unexpectedError,
	emailExists: emailExists,
	passwordRequirements: passwordRequirements,
	loginRequirements: loginRequirements,
	emailRequirements: emailRequirements,
	passwordChanged: passwordChanged,
	passwordsDifferent: passwordsDifferent,
	wrongCredentials: wrongCredentials
}