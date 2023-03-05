import debounce from 'lodash.debounce';
import './css/styles.css';
import {fetchCountries} from './js/fetchCountries'
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
}

refs.searchBox.addEventListener('input', debounce(OnSearchBoxClick, DEBOUNCE_DELAY));

function OnSearchBoxClick(e){
    fetchCountries(e.target.value)
    .then(Response => {
        if(Response.length >= 10){
            Notify.info('Too many matches found. Please enter a more specific name.');
        }
        console.log(Response);
    })
    .catch((error)=>{
        Notify.failure(error);
    });
}