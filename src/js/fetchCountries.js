const URL = 'https://restcountries.com';
const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages'
});


export const fetchCountries = (name = '') => {
    return fetch(`${URL}/v3.1/name/${name}?${searchParams}`)
    .then(Response => {
        if(!Response.ok){
            return Promise.reject('Oops, there is no country with that name');
        }    
        return Response.json()
    });
}