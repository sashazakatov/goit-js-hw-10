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

refs.searchBox.addEventListener('input', debounce(OnSearchBoxClick, DEBOUNCE_DELAY));

function OnSearchBoxClick(e){
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
    .then(Response => {
        console.log(Response);
        if(Response.length >= 10){
            Notify.info('Too many matches found. Please enter a more specific name.');
        }
        if(Response.length === 1){
            clearCountryList()
            refs.countryInfo.innerHTML = getCountryInfoMarkup(Response);
        }
        if(Response.length >= 2 && Response.length <= 10){
            clearCountryInfo();
            refs.countryList.innerHTML = getCountryListMarkup(Response);
        }
    })
    .catch((error)=>{
        console.log('aaa');
        Notify.failure(error);
    });
}

function getCountryInfoMarkup(Response){
    return Response.map(({flags, name, capital, population, languages})=>{
        console.log(languages);
        return `
            <img width="20" height="14" src="${flags.svg}" alt="${flags.alt}">
            <span>${name.official}</span>
            <ul>
                <li>
                    <span>Capitl:</span> ${capital}
                </li>
                <li>
                    <span>Population:</span> ${population}
                </li>
                <li>
                    <span>Languages:</span> ${Object.values(languages).join(', ')}
                </li>
            </ul>`;
    })
}

function getCountryListMarkup(Response){
    return Response.map(({flags, name})=>{
        return `
        <li>
            <img width="20" height="14" src="${flags.svg}" alt="${flags.alt}">
            <span>${name.official}</span>
        </li>`;
    }).join('');
}

function clearCountryList(){
    refs.countryList.innerHTML = '';
}

function clearCountryInfo(){
    refs.countryInfo.innerHTML = '';
}