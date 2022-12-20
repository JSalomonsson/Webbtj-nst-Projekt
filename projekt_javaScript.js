async function searchForGame(name) {
  const apiKey = "A6889A74CB7B9073C9AA366EDA37ADFA";
  const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2?key=${apiKey}&type=game&include_non_steam_sp=0`;

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
  } else {
    console.log("Game not found");
  }
}

main();
