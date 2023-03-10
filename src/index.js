import debounce from 'lodash.debounce';
import {fetchCountries} from './js/fetchCountries'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.searchBox.addEventListener('input', debounce(onSearchBoxClick, DEBOUNCE_DELAY));

function onSearchBoxClick(e){
    const value = e.target.value.trim();

    if(value !== ''){
        renderResult(value);
        return;
    }
    clearCountryList();
    clearCountryInfo();
}

function renderResult(value){
    fetchCountries(value)
    .then(response => {
        console.log(response);
        if(response.length >= 10){
            Notify.info('Too many matches found. Please enter a more specific name.');
        }
        if(response.length === 1){
            clearCountryList()
            refs.countryInfo.innerHTML = getCountryInfoMarkup(response);
        }
        if(response.length >= 2 && response.length <= 10){
            clearCountryInfo();
            refs.countryList.innerHTML = getCountryListMarkup(response);
        }
    })
    .catch((error)=>{
        Notify.failure(error);
    });
}

function getCountryInfoMarkup(response){
    return response.map(({flags, name, capital, population, languages})=>{
        return `
            <img class="country-icon" src="${flags.svg}" alt="${flags.alt}">
            <span class="country-name">${name.official}</span>
            <ul class="list">
                <li>
                    <span class="country-data">Capitl:</span> ${capital}
                </li>
                <li>
                    <span class="country-data">Population:</span> ${population}
                </li>
                <li>
                    <span class="country-data">Languages:</span> ${Object.values(languages).join(',')}
                </li>
            </ul>`;
    })
}

function getCountryListMarkup(response){
    return response.map(({flags, name})=>{
        return `
        <li>
            <img class="country-icon" src="${flags.svg}" alt="${flags.alt}">
            <span>${name.official}</span>
        </li>`;
    }).join('');
}

function clearCountryList(){
    refs.countryList.textContent = '';
}

function clearCountryInfo(){
    refs.countryInfo.textContent = '';
}