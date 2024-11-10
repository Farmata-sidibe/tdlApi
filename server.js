import { config } from "dotenv";
config();
import app from "./app.mjs";
import { performScrapingRedoute } from "./src/scrapper.mjs";
import { scrapingOkaidi } from "./src/scrapeOkaidi.mjs";
import { saveApi } from "./src/lib.js";
import cron from 'node-cron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { EventEmitter } from 'node:events';

// Augmenter le nombre maximum d'auditeurs
EventEmitter.defaultMaxListeners = 20;

const urlAll = process.env.URLALL;
const urlPoussette = process.env.URLPOUSSETTES;
const urlRoom = process.env.URLROOMS;
const urlMode = process.env.URLMODES;
const urlEveil = process.env.URLEVEILS;
const urlAllaitement = process.env.URLALLAITEMENTS;
const urlToilette = process.env.URLTOILETTES;

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Planification d'une reload tous les jours à partir de minuit
cron.schedule('0 0 * * *', async () => {
  console.log('Rechargement des données de produits...');
  try {
    const [dataOther, dataToilette, dataAllaitement, dataEveil, dataMode, dataRoom, dataPoussette] = await Promise.all([
      performScrapingRedoute(urlAll),
      performScrapingRedoute(urlToilette),
      performScrapingRedoute(urlAllaitement),
      performScrapingRedoute(urlEveil),
      scrapingOkaidi(urlMode),
      performScrapingRedoute(urlRoom),
      performScrapingRedoute(urlPoussette)
    ]);

    saveApi(dataToilette, 'toilettes');
    saveApi(dataAllaitement, 'allaitements');
    saveApi(dataOther, 'others');
    saveApi(dataEveil, 'eveils');
    saveApi(dataMode, 'modes');
    saveApi(dataRoom, 'rooms');
    saveApi(dataPoussette, 'poussettes');

    console.log('Data updated successfully.');
  } catch (error) {
    console.error("Error during scraping:", error);
  }
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
    data: {
      others: dataOther,
      toilettes: dataToilette,
      poussettes: dataPoussette,
      modes: dataMode,
      rooms: dataRoom,
      eveils: dataEveil,
      allaitements: dataAllaitement,
    }
  });
});

// Use data json combine to one endpoint
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readJsonFile = (filePath) => {
  const absolutePath = path.resolve(__dirname, filePath);
  const data = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(data);
};

// Function to read and assign each JSON dataset
const getAllData = () => {
  const dataAllaitement = readJsonFile('src/data/allaitements.json');
  const dataEveil = readJsonFile('src/data/eveils.json');
  const dataMode = readJsonFile('src/data/modes.json');
  const dataOther = readJsonFile('src/data/others.json');
  const dataPoussette = readJsonFile('src/data/poussettes.json');
  const dataRoom = readJsonFile('src/data/rooms.json');
  const dataToilette = readJsonFile('src/data/toilettes.json');

  return {
    others: dataOther,
    toilettes: dataToilette,
    poussettes: dataPoussette,
    modes: dataMode,
    rooms: dataRoom,
    eveils: dataEveil,
    allaitements: dataAllaitement
  };
};

// API endpoint to get structured data
app.get('/data', (req, res) => {
  const allData = getAllData();

  res.json({
    status: "success",
    data: allData
  });
});

const port = process.env.PORT || 8081;
const host = 'http://localhost';
app.listen(port, () => {
  console.log(`Server is running on port ${host}:${port}`);
});
