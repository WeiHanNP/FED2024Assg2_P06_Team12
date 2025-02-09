//Retrieving product and displaying onto page using unique item identifier
fetch("https://mokesell1-2729.restdb.io/rest/listing/id", { //Currently lacking product id
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })