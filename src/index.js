import debounce from 'lodash.debounce';
import './css/styles.css';
import {fetchCountries} from './js/fetchCountries'
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 0;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),

}

refs.searchBox.addEventListener('input', debounce(OnSearchBoxClick, DEBOUNCE_DELAY));

function OnSearchBoxClick(e){
    const value = e.target.value.trim();
    console.log(value);
    if(value === ''){
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
        return;
    }
    fetchCountries(value)
    .then(Response => {
        if(Response.length >= 10){
            Notify.info('Too many matches found. Please enter a more specific name.');
            return;
        }
        if(Response.length >= 2 && Response.length <= 10){
            refs.countryInfo.innerHTML = '';
            const markup = Response.map(({flags:{svg, alt}, name:{official}})=>{
                return `
                <li>
                    <img width="20" height="14" src="${svg}" alt="${alt}">
                    <span>${official}</span>
                </li>`;
            }).join('');
            refs.countryList.innerHTML = markup;
            return;
        }
        if(Response.length === 1){
            refs.countryList.innerHTML = '';
            const markup = Response.map(({flags:{svg, alt}, name:{official}, capital, population, languages})=>{
                return `
                    <img width="20" height="14" src="${svg}" alt="${alt}">
                    <span>${official}</span>
                    <ul>
                        <li>
                            <span>Capitl:</span> ${capital}
                        </li>
                        <li>
                            <span>Population:</span> ${population}
                        </li>
                        <li>
                            <span>Languages:</span> ${languages}
                        </li>
                    </ul>`;
            })
            refs.countryInfo.innerHTML = markup;
            return;
        }
    })
    .catch((error)=>{
        Notify.failure(error);
    });
}