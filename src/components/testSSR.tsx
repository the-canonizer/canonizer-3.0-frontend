

async function getData() {
  const res = await  
//   fetch("https://jsonplaceholder.typicode.com/todos",{ cache: 'no-store' })

fetch("https://service.canonizer.com/api/v1/topic/getAll", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiZjViNDZmODQ4OWMyMWQ0ZWIyM2E1NTI3NWRkYzM0ZThhZGM4N2M1ZDkyMTg0N2IwNmQzOWE0NTAxYzRkY2FjOWZjZDVjZmEwZWQ2ODNlYjAiLCJpYXQiOjE2ODAxNzAxMTIuMDA0MTM1LCJuYmYiOjE2ODAxNzAxMTIuMDA0MTM5LCJleHAiOjE3MTE3OTI1MTEuOTc3OTA5LCJzdWIiOiIxMjMwIiwic2NvcGVzIjpbIioiXX0.jAyqJORPBZTWJiK1k_oLX9puRGVCznCYysRzjkJIou7_mCxqYxks6jEZextLgfiZx5KNi5MViZ2kZPgWTKOP8LP23icevk74t4ljffLJz7pDfe7qfeBNznNGhzbeiabCb17xPLh9gCCRlObqr4TjXu1cZOMnToiSoHoZnhf4hWoiOSaxwppjiQGCdB3ch8ec1qg3zUg3ziSpdhnkXY2reLCrHyVuWkvl3BTa4ZGgokEotTcbL4GuL_nUvnnHl-6rei-wras4nPYHuRhXgnv43wHzPGdc_bBiOX6My4_PlAeNtL9OfjuT7m6p9HnmgewtV_Tct1RD8lV8LfYLOlJCKvGvz1UbGLDR6CaRfphJQ8OLAjk1_HHjIg5_p4-ZBN48zhYYikogyYfnhR_sPuE1Gm4X6yVjScBVwAQ4_36nfdX7WFYDq4FpzfO8QAsuo0BykKyc1Uaa_Ojc50x7v_57ea25OFTF8W-0Abf_tmeHjmY4ZdeXar5UYAKkxn-wH2xlBqdazXDXx6HOSs-RaTBE0PhBCEdTYC1DXUmgWJvfgr-ZX-vKmKZEBSuxqKBfr7BGig1N-5dRENeCqAKSlomRSK6GqyAVIe32mc8UttP60Mt5YtQRqZJZdV28wBky1xp9wmTTy7L5CIjmJCuE4cSFLXJKKROndmbXBBQupO1snsQ",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1"
  },
  "referrer": "https://canonizer3.canonizer.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"algorithm\":\"blind_popularity\",\"asofdate\":1685011620.921,\"namespace_id\":16,\"page_number\":1,\"page_size\":15,\"search\":\"\",\"filter\":\"\",\"asof\":\"default\",\"user_email\":\"\",\"is_archive\":0}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include",
   "cache": 'no-store' 
}, );

  
 
  return res?.json();
  
}
 
export default async function ListingPage() {
  const data = await getData();
   console.log('response', data?.data?.topic)
 
  return <main>
     <h1>ListingPage</h1> 
      <ul>
        {data?.data?.topic?.map((topic) => {
          return (
            <li key={topic.topic_id}>
              <h2>{topic.topic_name}</h2>
              <span>{topic.topic_score}</span>
            
            </li>
          );
        })}
      </ul>
  </main>;
}


