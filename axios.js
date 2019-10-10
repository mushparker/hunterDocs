const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const fs = require('fs');
const justUsDomains = require('./justUsDomains.json')
const someDomains = require('./someUsDomains.json')
 
// sets max 2 requests per 1 second, other will be delayed
const http = rateLimit(axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
}), { maxRequests: 2, perMilliseconds: 1000 });

let collectedData = []; 

let domainsValues = Object.values(justUsDomains);

function hunterRequests(domains)  {
  for ( const domain of domains) {

      http.get(`https://api.hunter.io/v2/domain-search?domain=${domain.domain}&api_key=ea53a5f840e1a9df77a65ca02b198e27e5fdafa0`)
      
      .then((response) => {
        console.log(response.status); 

        // handle success
        for (let i = 0; i < response.data.data.emails.length; i++) { 
          if (response.data.data.emails === undefined) {
            i++} 
            else {
              let datum = response.data.data.emails[i];
          
              let agencyData = {
                  email: datum.value,
                  type: datum.type,
                  confidence: datum.confidence,
                  first_name: datum.first_name,
                  last_name: datum.last_name,
                  position: datum.position,
                  seniority: datum.seniority,
                  department: datum.department,
                  linkedin: datum.linkedin,
                  twitter: datum.twitter,
                  phone_number: datum.phone_number
              }
            fs.appendFile('./thirdgo.txt', JSON.stringify(agencyData), (err) => {
              if (err) throw err;
              console.log('The file has been saved!');
          });
        } 
         }
       })

      .catch((error) => {
        // handle error
        console.log(error);
       })
   }
 }
    
hunterRequests(domainsValues); 

