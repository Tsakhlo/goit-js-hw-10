import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';


const refs = {
    inputField: document.querySelector('#search-box'),
    countryList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info"),
};

const DEBOUNCE_DELAY = 300;

refs.inputField.addEventListener('input', debounce(onInputField, DEBOUNCE_DELAY));

function onInputField() {
    const name = refs.inputField.value.trim();
    if (name === "") {
        return (refs.countryList.innerHTML = ""), 
        (refs.countryInfo.innerHTML = "")
    };

fetchCountries(name)
    .then(countries => {
        refs.countryList.innerHTML = ''
        refs.countryInfo.innerHTML = ''
        if (countries.length === 1) {
            refs.countryList.insertAdjacentHTML('beforeend', searchCountryList(countries))
            refs.countryInfo.insertAdjacentHTML('beforeend', searchCountryInfo(countries))
        } else if (countries.length >= 10) {
            alertTooManyMatches()
        } else {
            refs.countryList.insertAdjacentHTML('beforeend', searchCountryList(countries))
        }
        })
    .catch(alertWrongName)
};  

function searchCountryList(flagList) {
    const markup = flagList
        .map(({ flags, name }) => {
            return `<li class="country-list_item"><img  class="country-list__flag"  src="${flags.svg}" alt="Flag of ${name.official}" width = 40px height = 30px><h2>${name.official}</h2> </li>`
        }).join("")
    return markup
};

function searchCountryInfo(infoList) {
    const markup = infoList
        .map(({ capital, population, languages }) => {
            return `<ul class="country-info_list">
            <li class = country-info_item><p><b>Capital: </b>${capital}</p></li>
            <li class = country-info_item><p><b>Population: </b>${population}</p></li>
            <li class = country-info_item><p><b>Languages: </b>${Object.values(languages).join(',')}</p></li></ul>`
        }).join("")
    return markup;
};

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name')
}

function alertTooManyMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
}

