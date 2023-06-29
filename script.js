

const input = document.querySelector('.select__input');
const btnSelect = document.querySelector('.select__city');
const btnMyCity = document.querySelector('.select__my-city');

const weatherCity = document.querySelector('.city');
const btnToday = document.querySelector('.btn-today');
const weatherDegry = document.querySelector('.weather__degry');
const weatherSort = document.querySelector('.weather__sort');
const weatherIcon = document.querySelector('.weather__icon img');
const weatherWindSpeed = document.querySelector('.weather__wind-speed');
const weatherHumidity = document.querySelector('.weather__humidity');
const weatherRain = document.querySelector('.weather__rain');
const weatherSnow = document.querySelector('.weather__snow');
const btnDays = document.querySelectorAll('.btns__day');
const weatherNext = document.querySelectorAll('.weather-next'); 
const weatherToday = document.querySelector('.weather_today');
const blockName = document.querySelectorAll('.weather__name-block');
const btnLang = document.querySelector('.btn-lang');


const key = '8d39974b640672279c1e2a7a2226aff0';

let lang = 'en';

async function getCity() {
  const geo = await fetch('https://ipapi.co/json');
  const geoJSON = await geo.json();
  return city = await geoJSON.city;
};

getCity()
  .then(city => getWeather(lang, city))
;

async function getWeather(lang, city) {

  const arrBlockNamesRu = ['Описание', 'Температура', 'Скорость ветра', 'Влажность', 'Дождь',  'Снег'];
  const arrBlockNamesEng = ['Description', 'Temp', 'Wind speed', 'Humidity', 'Rain',  'Snow'];

  let nameWind;
  let nameHumidity;
  let nameRain;
  let nameSnow;

  if(lang == 'ru') {
    nameWind = 'Скорость ветра';
    nameHumidity = 'Влажность';
    nameRain = 'Дождь';
    nameSnow = 'Снег';
  };

  if(lang == 'en') {
    nameWind = 'Wind speed';
    nameHumidity = 'Humidity';
    nameRain = 'Rain';
    nameSnow = 'Snow';
  };

  if(lang == 'ru') {
    blockName.forEach((elem, ind) => elem.textContent = arrBlockNamesRu[ind]);
    btnToday.textContent = 'Сегодня';
    btnMyCity.textContent = 'Мой город';
    btnSelect.textContent = 'Выбрать';
  };

  if(lang == 'en') {
    blockName.forEach((elem, ind) => elem.textContent = arrBlockNamesEng[ind]);
    btnToday.textContent = 'Today';
    btnMyCity.textContent = 'My city';
    btnSelect.textContent = 'Select';
  };
 
  // where you are now
  const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=${lang}&appid=${key}`);
  const data = await resp.json();

  if(data.weather[0].icon == '01d') weatherIcon.src = 'img/weather_icons/sun.png';
  if(data.weather[0].icon == '01n') weatherIcon.src = 'img/weather_icons/moon.png';
  if(data.weather[0].icon == '02d') weatherIcon.src = 'img/weather_icons/sun_cloud.png';
  if(data.weather[0].icon == '03d' || data.weather[0].icon == '03n' || data.weather[0].icon == '02n') weatherIcon.src = 'img/weather_icons/min_cloud.png';
  if(data.weather[0].icon == '04d' || data.weather[0].icon == '04n') weatherIcon.src = 'img/weather_icons/cloud.png';
  if(data.weather[0].icon == '09d' || data.weather[0].icon == '09n' || data.weather[0].icon == '10n') weatherIcon.src = 'img/weather_icons/rain.png';
  if(data.weather[0].icon == '10d') weatherIcon.src = 'img/weather_icons/sun_rain.png';
  if(data.weather[0].icon == '11d' || data.weather[0].icon == '11n') weatherIcon.src = 'img/weather_icons/storm.png';
  if(data.weather[0].icon == '12d' || data.weather[0].icon == '12n') weatherIcon.src = 'img/weather_icons/snow.png';

  weatherCity.textContent = data.name;
  weatherDegry.textContent = Math.round(data.main.temp) + '°';
  weatherSort.textContent = data.weather[0].description.slice(0,1).toUpperCase() + data.weather[0].description.slice(1);
  weatherWindSpeed.textContent = data.wind.speed + ' m/s';
  weatherHumidity.textContent =  data.main.humidity + '%';

  data.rain?.['1h'] ? weatherRain.textContent = data.rain['1h'] + ' mm/h' : weatherRain.textContent = '-';
  data.snow?.['1h'] ? weatherSnow.textContent = data.snow['1h'] + ' mm/h' : weatherSnow.textContent = '-';


  // what you like find 
  const respDays = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=${lang}&appid=${key}`);
  const days = await respDays.json();

  const newDate = new Date();

  for(let j = 0; j < 4; j++) {

    let timeTemp;

    weatherNext[j].innerHTML = '';
    
    const currDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + j + 1);

    let year = currDate.getFullYear();
    let month = currDate.getMonth() + 1;
    let date = currDate.getDate();
    let day = currDate.getDay();
 
    month < 9 ? month = '0' + month : month = month;
    date < 9 ? date = '0' + date : date = date;
    
    const arrDaysEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const arrDaysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    lang == 'en' ? btnDays[j].textContent = arrDaysEn[day] : btnDays[j].textContent = arrDaysRu[day];

    const dateNow = `${year}-${month}-${date}`;
    const arrTemps = [];
    let arrContent = [];

    for(let i = 0; i < days.list.length; i++) {

      if(days.list[i].dt_txt.includes(dateNow)) {
        arrTemps.push(days.list[i].main.temp);

        let rain;
        let snow;

        const nextDate = days.list[i].dt_txt.replace(/(\d+\-\d+\-\d+)\s(\d+:\d+)(:\d+)/, "$2");

        days.list[i].rain?.['3h'] ? rain = days.list[i].rain?.['3h'] + ' mm/h' : rain = '-';
        days.list[i].snow?.['3h'] ? snow = days.list[i].snow?.['3h'] + ' mm/h' : snow = '-';
        
        timeTemp = `
          <div class="day">
            <span class="day__time">${nextDate}</span>
            <span class="day__temp">${Math.round(days.list[i].main.temp)}°</span>
            <img src="https://openweathermap.org/img/wn/${days.list[i].weather[0].icon}@2x.png" alt="" class="day__img">
          </div>
          <div class="day__info">
          <span class="day__desc">${days.list[i].weather[0].description.slice(0,1).toUpperCase() + days.list[i].weather[0].description.slice(1)}</span>
          <div class="day__block">
            <span class="day__name-block">${nameWind}</span>
            <span class="day__sort">${days.list[i].wind.speed} m/s</span>
          </div>
          <div class="day__block">
            <span class="day__name-block">${nameHumidity}</span>
            <span class="day__sort">${days.list[i].main.humidity} %</span>
          </div>
          <div class="day__block">
            <span class="day__name-block">${nameRain}</span>
            <span class="day__sort">${rain} </span>
          </div>
          <div class="day__block">
            <span class="day__name-block">${nameSnow}</span>
            <span class="day__sort">${snow} </span>
          </div>
        </div>
        `;

        arrContent.push(timeTemp);
      };

    };

    arrContent.forEach((elem) => weatherNext[j].innerHTML += elem )

  };

  const newTime = document.querySelectorAll('.day');

  newTime.forEach(el => {
    el.addEventListener('click' , () => {

      el.classList.toggle('day__active')

      let next = el.nextElementSibling;
      console.log(next);

      if(!el.classList.contains('day__active')) {
        console.log(1)
        next.style.maxHeight = null;

        // document.querySelectorAll('.day__info').forEach(el => el.style.maxHeight = null)
      } else {
        // document.querySelectorAll('.day__info').forEach(el => el.style.maxHeight = null)
        next.style.maxHeight = next.scrollHeight + 'px';
      };

    });

  });


};


btnSelect.addEventListener('click' , () => {

  if(input.value) {
    city = input.value;
    /[а-яёА-ЯЁ]/.test(input.value) ? lang = 'ru' : lang = 'en';
    lang == 'ru' ? btnLang.textContent = 'ru': btnLang.textContent = 'en'; 
    getWeather(lang, city)
    input.value = '';
  };

});

btnMyCity.addEventListener('click' , () => {
  getCity()
    .then(city => getWeather(lang, city))
  ;
});


btnToday.addEventListener('click' , () => {

  btnDays.forEach(day => day.classList.remove('active', 'color-active'));
  weatherNext.forEach(day => day.classList.remove('active'));
  weatherToday.classList.add('active', );
  btnToday.classList.add('color-active');
  weatherIcon.parentElement.classList.remove('hide');
  
});

btnDays.forEach((btn, ind) => {
  btn.addEventListener('click' , () => {

    btnDays.forEach(day => day.classList.remove('active' ,'color-active'));
    weatherNext.forEach(day => day.classList.remove('active'));
    weatherToday.classList.remove('active');
    btnToday.classList.remove('color-active');

    weatherIcon.parentElement.classList.add('hide')
    
    weatherNext[ind].classList.add('active');
    btn.classList.add('active', 'color-active');
  })
});


btnLang.addEventListener('click' , () => {
  btnLang.classList.toggle('active');
  
  if(btnLang.classList.contains('active')) {
    lang = 'ru';
    btnLang.textContent = 'ru'
  } else {
    lang = 'en'
    btnLang.textContent = 'en'
  };

  getWeather(lang, city);
});




