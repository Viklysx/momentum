const time = document.querySelector('.time'),
  greeting = document.querySelector('.greeting'),
  name = document.querySelector('.name'),
  focus = document.querySelector('.focus'),
  monthDay = document.querySelector('.month');
const showAmPm = true;
let finalMass;
let nameValue = '';
let nameFocus = '';
const btn = document.querySelector('.btn');
const btnQuote = document.querySelector('.btnQuote');
let massDay = [];
let massEvening = [];
let massMorning = [];
let massNight = [];
let massNow = [];
let todayForBG = new Date();
let hourForBG = todayForBG.getHours() + 1;

function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();
  day = today.getDate();
  dayWeek = today.getDay();
  month = today.getMonth();
  let options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  let todayText = new Intl.DateTimeFormat('en-US', options).format(today);
  if (addZero(sec) === '00' && addZero(min) === '00') {
    setBgGreet();
    hourForBG = todayForBG.getHours() + 1;
  }
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
  monthDay.innerHTML = todayText;
  setTimeout(showTime, 1000);
}

function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function setBgGreet() {
  let today = new Date(),
    hour = today.getHours();
  if (hour < 6) {
    //Night
    document.body.style.backgroundImage = `url(${finalMass[hour]})`;
    greeting.textContent = 'Good Night, ';
    massNow = massNight;
  } else if (hour < 12) {
    // Morning
    document.body.style.backgroundImage = `url(${finalMass[hour]})`;
    greeting.textContent = 'Good Morning, ';
    massNow = massMorning;
  } else if (hour < 18) {
    // Afternoon
    document.body.style.backgroundImage = `url(${finalMass[hour]})`;
    greeting.textContent = 'Good Afternoon, ';
    massNow = massDay;
  } else {
    // Evening
    document.body.style.backgroundImage = `url(${finalMass[hour]})`;
    greeting.textContent = 'Good Evening, ';
    massNow = massEvening;
  }
}

function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.keyCode === 13) {
      if (e.target.innerText === '') {
        if (localStorage.getItem('name') !== null) name.textContent = localStorage.getItem('name');
        else name.textContent = nameValue;
      } else localStorage.setItem('name', e.target.innerText);
      name.blur();
    }
  } else {
    if (e.target.innerText === '') {
      if (localStorage.getItem('name') !== null) name.textContent = localStorage.getItem('name');
      else name.textContent = nameValue;
    } else localStorage.setItem('name', e.target.innerText);
    name.blur();
  }
}

function clickName() {
  nameValue = name.textContent;
  name.textContent = '';
}

function clickFocus() {
  nameFocus = focus.textContent;
  focus.textContent = '';
}

function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

function setFocus(e) {
  if (e.type === 'keypress') {
    if (e.keyCode === 13) {
      if (e.target.innerText === '') {
        if (localStorage.getItem('focus') !== null) focus.textContent = localStorage.getItem('focus');
        else focus.textContent = nameFocus;
      } else localStorage.setItem('focus', e.target.innerText);
      focus.blur();
    }
  } else {
    if (e.target.innerText === '') {
      if (localStorage.getItem('focus') !== null) focus.textContent = localStorage.getItem('focus');
      else focus.textContent = nameFocus;
    } else localStorage.setItem('focus', e.target.innerText);
    focus.blur();
  }
}

function createMassImg() {
  massRandom(massDay, 'day');
  massRandom(massEvening, 'evening');
  massRandom(massMorning, 'morning');
  massRandom(massNight, 'night');
  finalMass = massNight.concat(massMorning, massDay, massEvening);
}

function massRandom(mass, timeOfDay) {
  let random;
  while (mass.length < 6) {
    random = Math.floor(Math.random() * 100 / 2);
    if (!mass.includes(`../assets/images/${timeOfDay}/${random}.jpg`)) {
      if (random < 21 && random > 0) mass.push(`./assets/images/${timeOfDay}/${random}.jpg`);
    }
  }
}

function viewBgImage(data) {

  const body = document.querySelector('body');
  const src = data;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {
    body.style.backgroundImage = `url(${src})`;
  };
}

function getImage() {
  // const index = i % finalMass.length + hour;
  if (hourForBG > 23) hourForBG = 0;
  const imageSrc = finalMass[hourForBG];
  viewBgImage(imageSrc);
  hourForBG++;
  btn.disabled = true;
  setTimeout(function () {
    btn.disabled = false
  }, 1000);
}

const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');

async function getQuote() {
  const url = 'https://quote-garden.herokuapp.com/api/v2/quotes/random';
  const res = await fetch(url);
  const data = await res.json();
  if (data.quote.quoteText.length <= 120) {
    blockquote.textContent = data.quote.quoteText;
    figcaption.textContent = data.quote.quoteAuthor;
  } else getQuote();
  btnQuote.addEventListener('click', getQuote);
}

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.windSpeed');
const weatherDescription = document.querySelector('.weatherDescription');
const city = document.querySelector('.city');

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=738fa740f3120d02d91801762dd7d273&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  if (data.cod === '404' || city.innerText.trim().length === 0) {
    city.textContent = 'Wrong city';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    humidity.textContent = '';
    windSpeed.textContent = '';
    weatherIcon.className = '';
  } else {
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind: ${data.wind.speed} meters per second`;
  }
}

function setCity(e) {
  if (e.type === 'keypress') {
    if (e.code === 'Enter') {
      if (e.target.innerText === '') city.textContent = localStorage.getItem('weather');
      else localStorage.setItem('weather', e.target.innerText);
      getWeather();
      city.blur();
    }
  } else {
    if (e.target.innerText === '') city.textContent = localStorage.getItem('weather');
      else localStorage.setItem('weather', e.target.innerText);
      getWeather();
      city.blur();
  }
}

function getCity() {
  if (localStorage.getItem('weather') !== null && localStorage.getItem('weather') !== '') {
    city.textContent = localStorage.getItem('weather')
  } else {
    city.textContent = 'Москва';
    localStorage.setItem('weather', 'Москва');
  }
}

function clickCity() {
  city.textContent = '';
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);
city.addEventListener('click', clickCity);
document.addEventListener('DOMContentLoaded', getQuote);
btnQuote.addEventListener('click', getQuote);
btn.addEventListener('click', getImage);
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', clickName);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', clickFocus);

// Run
createMassImg();
showTime();
setBgGreet();
getName();
getFocus();
getCity();