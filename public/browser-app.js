const formDOM = document.querySelector('.form')
const usernameInputDOM = document.querySelector('.username-input')
const passwordInputDOM = document.querySelector('.password-input')
const formAlertDOM = document.querySelector('.form-alert')
const resultDOM = document.querySelector('.result')
const btnDOM = document.querySelector('#data')
const tokenDOM = document.querySelector('.token')
const tokenHeaderDOM = document.querySelector('#token-header')
const tokenTimerDOM = document.querySelector('#timer')
var element = document.querySelector('.container');

formDOM.addEventListener('submit', async (e) => {
  formAlertDOM.classList.remove('text-success')
  tokenDOM.classList.remove('text-success')
  tokenHeaderDOM.textContent = ''
  tokenTimerDOM.textContent = ''

  e.preventDefault()
  const username = usernameInputDOM.value
  const password = passwordInputDOM.value

  try {
    const { data } = await axios.post('/api/v1/login', { username, password })

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = data.msg

    formAlertDOM.classList.add('text-success')
    usernameInputDOM.value = ''
    passwordInputDOM.value = ''

    localStorage.setItem('token', data.token)
    formDOM.style.display = 'none'
    formDOM.classList.remove("contact-form")
    tokenHeaderDOM.textContent = 'Token will expires in'
    tokenTimerDOM.textContent = ''
    element.style.display = 'block';
    startTimer()
    resultDOM.innerHTML = ''
    tokenDOM.textContent = 'Access Token Valid'
    tokenDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = error.response.data.msg
    localStorage.removeItem('token')
    resultDOM.innerHTML = ''
    tokenDOM.textContent = 'Access Token Expired'
    tokenDOM.classList.remove('text-success')
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
  }, 2000)
})

btnDOM.addEventListener('click', async () => {
  const token = localStorage.getItem('token')
  try {
    const { data } = await axios.get('/api/v1/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    resultDOM.innerHTML = `<h5>${data.msg}</h5><p>${data.secret}</p>`

    data.secret
  } catch (error) {
    localStorage.removeItem('token')
    resultDOM.innerHTML = `<p>${error.response.data.msg}</p>`
  }
})

const checkToken = () => {
  tokenDOM.classList.remove('text-success')

  const token = localStorage.getItem('token')
  if (token) {
    tokenDOM.textContent = 'token present'
    tokenDOM.classList.add('text-success')
  }
}
checkToken()

function startTimer() {
  console.log('hi')
  let timer = 180
  var display = document.getElementById("timer");
  var countdown = setInterval(function () {
    hours = parseInt((timer / 3600) % 24, 10);
    minutes = parseInt((timer / 60) % 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = hours + ":" + minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(countdown);
      localStorage.removeItem('token')
      tokenDOM.textContent = 'No token present'
      tokenDOM.classList.remove('text-success')
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, 1000);
}