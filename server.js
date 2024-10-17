import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import app from "./app.mjs";
import { performScrapingRedoute } from "./src/scrapper.mjs";
import { scrapingOkaidi } from "./src/scrapeOkaidi.mjs";

import { saveApi } from "./src/lib.js";
import cron from 'node-cron';


const port = process.env.PORT;

const urlAll= process.env.URLALL;
const urlPoussette= process.env.URLPOUSSETTES;
const urlRoom= process.env.URLROOMS;
const urlMode= process.env.URLMODES;
const urlEveil= process.env.URLEVEILS;
const urlAllaitement= process.env.URLALLAITEMENTS;
const urlToilette= process.env.URLTOILETTES;

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get("/poussettes", async (req, res) => {
  try {
    const dataPoussette = await performScrapingVertbaudet(urlPoussette);
    saveApi(dataPoussette, 'poussettes');
    console.log(dataPoussette);
    res.json(dataPoussette); // send the data as JSON response
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Planification d'une reload tous les jours à partir de minuit
cron.schedule('0 0 * * *', () => {
  console.log('Rechargement des données de produits...');
  app.get("/", async (req, res) => {
    const dataOther = await performScrapingRedoute(urlAll);
    const dataToilette = await performScrapingRedoute(urlToilette);
    const dataAllaitement = await performScrapingRedoute(urlAllaitement);
    const dataEveil = await performScrapingRedoute(urlEveil);
    const dataMode = await scrapingOkaidi(urlMode);
    const dataRoom = await performScrapingRedoute(urlRoom);
    const dataPoussette = await performScrapingRedoute(urlPoussette);
  
    saveApi(dataToilette, 'toilettes');
    saveApi(dataAllaitement, 'allaitements');
    saveApi(dataOther, 'others');
    saveApi(dataEveil, 'eveils');
    saveApi(dataMode, 'modes');
    saveApi(dataRoom, 'rooms');
    saveApi(dataPoussette, 'poussettes');
  
    res.json({
      status: "success",
      data:{
        'others': dataOther,
        'toilettes': dataToilette,
        'poussettes': dataPoussette,
        'modes': dataMode,
        'rooms': dataRoom,
        'eveils': dataEveil,
        'allaitements': dataAllaitement,
      }
    })    
  });
});


app.get("/", async (req, res) => {
  const dataOther = await performScrapingRedoute(urlAll);
  const dataToilette = await performScrapingRedoute(urlToilette);
  const dataAllaitement = await performScrapingRedoute(urlAllaitement);
  const dataEveil = await performScrapingRedoute(urlEveil);
  const dataMode = await scrapingOkaidi(urlMode);
  const dataRoom = await performScrapingRedoute(urlRoom);
  const dataPoussette = await performScrapingRedoute(urlPoussette);

  saveApi(dataToilette, 'toilettes');
  saveApi(dataAllaitement, 'allaitements');
  saveApi(dataOther, 'others');
  saveApi(dataEveil, 'eveils');
  saveApi(dataMode, 'modes');
  saveApi(dataRoom, 'rooms');
  saveApi(dataPoussette, 'poussettes');

  res.json({
    status: "success",
    data:{
      'others': dataOther,
      'toilettes': dataToilette,
      'poussettes': dataPoussette,
      'modes': dataMode,
      'rooms': dataRoom,
      'eveils': dataEveil,
      'allaitements': dataAllaitement,
    }
  })    
});

app.get("/", async (req, res) => {
  // Récupérer les paramètres page et limit depuis la requêt
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // function paginer les données
  const paginate = (array, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return array.slice(startIndex, endIndex);
  };

  // Scrapping des données
  const dataOther = await performScrapingRedoute(urlAll);
  const dataToilette = await performScrapingRedoute(urlToilette);
  const dataAllaitement = await performScrapingRedoute(urlAllaitement);
  const dataEveil = await performScrapingRedoute(urlEveil);
  const dataMode = await scrapingOkaidi(urlMode);
  const dataRoom = await performScrapingRedoute(urlRoom);
  const dataPoussette = await performScrapingRedoute(urlPoussette);

  // Sauvegarde des données dans l'API (si nécessaire)
  saveApi(dataToilette, 'toilettes');
  saveApi(dataAllaitement, 'allaitements');
  saveApi(dataOther, 'others');
  saveApi(dataEveil, 'eveils');
  saveApi(dataMode, 'modes');
  saveApi(dataRoom, 'rooms');
  saveApi(dataPoussette, 'poussettes');

  // Application de la pagination aux datasets scrappés
  const paginatedOthers = paginate(dataOther, page, limit);
  const paginatedToilette = paginate(dataToilette, page, limit);
  const paginatedPoussette = paginate(dataPoussette, page, limit);
  const paginatedMode = paginate(dataMode, page, limit);
  const paginatedRoom = paginate(dataRoom, page, limit);
  const paginatedEveil = paginate(dataEveil, page, limit);
  const paginatedAllaitement = paginate(dataAllaitement, page, limit);
  // Calcul du nombre total de pages
  const totalPagesOther = Math.ceil(dataOther.length / limit);
  const totalPagesToilette = Math.ceil(dataToilette.length / limit);
  const totalPagesPoussette = Math.ceil(dataPoussette.length / limit);
  const totalPagesMode = Math.ceil(dataMode.length / limit);
  const totalPagesRoom = Math.ceil(dataRoom.length / limit);
  const totalPagesEveil = Math.ceil(dataEveil.length / limit);
  const totalPagesAllaitement = Math.ceil(dataAllaitement.length / limit);

  // Réponse JSON avec les données paginées
  res.json({
    status: "success",
    currentPage: page,
    totalPagesOther: totalPagesOther,
    totalPagesToilette: totalPagesToilette,
    totalPagesPoussette: totalPagesPoussette,
    totalPagesMode: totalPagesMode,
    totalPagesRoom: totalPagesRoom,
    totalPagesEveil: totalPagesEveil,
    totalPagesAllaitement: totalPagesAllaitement,
    data: {
      'others': paginatedOthers,
      'toilettes': paginatedToilette,
      'poussettes': paginatedPoussette,
      'modes': paginatedMode,
      'rooms': paginatedRoom,
      'eveils': paginatedEveil,
      'allaitements': paginatedAllaitement,
    }
  });
});

// app.get("/", async (req, res) => {
//   try {
//     // Exécuter les appels en parallèle
//     const [
//       dataOther,
//       dataToilette,
//       dataAllaitement,
//       dataEveil,
//       dataMode,
//       dataRoom,
//       dataPoussette
//     ] = await Promise.all([
//       performScrapingRedoute(urlAll),
//       performScrapingRedoute(urlToilette),
//       performScrapingRedoute(urlAllaitement),
//       performScrapingRedoute(urlEveil),
//       scrapingOkaidi(urlMode),
//       performScrapingRedoute(urlRoom),
//       performScrapingRedoute(urlPoussette)
//     ]);

//     // Sauvegarde des données
//     saveApi(dataToilette, 'toilettes');
//     saveApi(dataAllaitement, 'allaitements');
//     saveApi(dataOther, 'others');
//     saveApi(dataEveil, 'eveils');
//     saveApi(dataMode, 'modes');
//     saveApi(dataRoom, 'rooms');
//     saveApi(dataPoussette, 'poussettes');

//     // Envoi de la réponse
//     res.json({
//       status: "success",
//       data: {
//         'others': dataOther,
//         'toilettes': dataToilette,
//         'poussettes': dataPoussette,
//         'modes': dataMode,
//         'rooms': dataRoom,
//         'eveils': dataEveil,
//         'allaitements': dataAllaitement,
//       }
//     });
//   } catch (error) {
//     console.error("Error during scraping:", error);
//     res.status(500).json({ status: "error", message: "Scraping failed" });
//   }
// });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// server.timeout = 240000; // Set timeout to 4 minutes
