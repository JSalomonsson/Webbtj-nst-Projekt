//method used to search for a game with name as input
async function searchForGame(name) {
  const apiKey = "A6889A74CB7B9073C9AA366EDA37ADFA"; //call the steam API and use GetAppList
  const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2?key=${apiKey}&filter=game`;
  try {
    const response = await fetch(url); 
    const appList = (await response.json()).applist.apps; //get Json response

    for (const app of appList) {
      if (app.name === name) {
        return { id: app.appid, name: app.name }; //search entire list of games untill game is found and return its name and ID
      }
    }
  } catch (error) {
    console.error(error);
  }
}

//takes in search term, calls search for game, if game found then retreive game ID and Name else "Not Found"
async function main(searchTerm) {
  h4.innerHTML = "";
  console.log(searchTerm + " this is the search term");
  const game = await searchForGame(searchTerm);
  if (game) {
    console.log(`Found game: ${game.id} (${game.name})`);
    getAppInfo(game.id);
    getPriceInfo(game.id, game.name);
  } else {
    console.log("Game not found");
    alert("Could not find the game");
  }
}
//Method using games ID to fetch details about that particular game through the steam AppDetails call.
async function getAppInfo(appId) {
  const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
  const data = await response.json();
  const appData = data[appId].data;
  var header = document.getElementById('h3');
  var image = document.getElementById('my-image');

  //the data that is retrieved
  const name = appData.name;
  const release_date = appData.release_date;
  const detailedDescription = appData.detailed_description;
  const headerImage = appData.header_image;
  const website = appData.website;

  header.innerHTML = detailedDescription;
  image.src = headerImage;

  console.log(name, release_date, detailedDescription, headerImage, website);
}

//method using game ID to get price info about the game like discounts
async function getPriceInfo(appId) {
  try {
    const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?steamAppID=${appId}`); //uses cheapshark API
    const data = await response.json(); //retrieves Json info
    var header = document.getElementById('h4');
  
    
    let lowestPrice = 100000;
    let lowestPriceDeal;

    for (let i = 0; i < data.length; i++) {
      if (data[i].salePrice < lowestPrice) {
        lowestPrice = data[i].salePrice; //searches lowest price for game
        lowestPriceDeal = data[i];
      }
  }
  header.innerHTML = 
  "Lowest Price: $" + lowestPriceDeal.salePrice;
  

  console.log(lowestPriceDeal.salePrice, lowestPriceDeal.storeID);
  getStoreInfo(lowestPriceDeal.storeID);


  } catch (error) {
    console.error(error);
  }
}

//Method returning store info through the store ID.
async function getStoreInfo(storeId) {
  const response = await fetch(`https://www.cheapshark.com/api/1.0/stores`); //uses cheapshark API
  const data = await response.json();

  let store;

  for(let i = 0; i < data.length; i++) {
    if (data[i].storeID === storeId) {
      store = data[i]; //find the right store
      break;
    }
  }
  var h4 = document.getElementById("h4");
  h4.innerHTML += "\n Store name: " + store.storeName;
  console.log(store.storeName);

}


