async function searchForGame(name) {
  const apiKey = "A6889A74CB7B9073C9AA366EDA37ADFA";
  const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2?key=${apiKey}`;
  //blir bara "Game not found om &type=game&include_non_steam_sp=0 används i slutet av urln"
  try {
    const response = await fetch(url);
    const appList = (await response.json()).applist.apps;

    for (const app of appList) {
      if (app.name === name) {
        return { id: app.appid, name: app.name };
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  const game = await searchForGame("Just Cause 2");
  if (game) {
    console.log(`Found game: ${game.id} (${game.name})`);
    getAppInfo(game.id);
    getPriceInfo(game.id, game.name);
  } else {
    console.log("Game not found");
  }
}

async function getAppInfo(appId) {
  const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
  const data = await response.json();
  const appData = data[appId].data;
  var header = document.getElementById('h3');

  const name = appData.name;
  const release_date = appData.release_date;
  const detailedDescription = appData.detailed_description;
  const headerImage = appData.header_image;
  const website = appData.website;

  header.innerHTML = detailedDescription;

  console.log(name, release_date, detailedDescription, headerImage, website);
}

async function getPriceInfo(appId, name) {
  try {
    //const response = await fetch(`https://www.cheapshark.com/api/1.0/games?steamAppId=${appId}`);
    const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?steamAppID=${appId}`);
    const data = await response.json();
    
    let lowestPrice = 100000;
    let lowestPriceDeal;

    for (let i = 0; i < data.length; i++) {
      if (data[i].salePrice < lowestPrice) {
        lowestPrice = data[i].salePrice;
        lowestPriceDeal = data[i];
      }
  }

  console.log(lowestPriceDeal.salePrice, lowestPriceDeal.storeID);

  } catch (error) {
    console.error(error);
  }
}


