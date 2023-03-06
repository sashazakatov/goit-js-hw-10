const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages'
});


export const fetchCountries = (name = '') => {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(Response => {
        if(!Response.ok){
            return Promise.reject('Oops, there is no country with that name');
        }    
        return Response.json()
    });
}