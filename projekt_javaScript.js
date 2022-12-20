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
  const game = await searchForGame("Half-Life 2: Episode One");
  if (game) {
    console.log(`Found game: ${game.id} (${game.name})`);
    getAppInfo(game.id);
  } else {
    console.log("Game not found");
  }
}

async function getAppInfo(appId) {
  const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
  const data = await response.json();
  const appData = data[appId].data;

  const name = appData.name;
  const release_date = appData.release_date;
  const detailedDescription = appData.detailed_description;
  const headerImage = appData.header_image;
  const website = appData.website;

  console.log(name, release_date, detailedDescription, headerImage, website);
}



main();
