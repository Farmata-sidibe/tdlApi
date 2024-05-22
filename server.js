import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import app from "./app.mjs";
import { performScrapingVertbaudet } from "./src/scrapper.mjs";
import { scrapingOkaidi } from "./src/scrapeOkaidi.mjs";

import { saveApi } from "./src/lib.js";

const port = process.env.PORT;

const urlAll= process.env.URLALL;
const urlPoussette= process.env.URLPOUSSETTES;
const urlRoom= process.env.URLROOMS;
const urlMode= process.env.URLMODES;
const urlEveil= process.env.URLEVEILS;
const urlAllaitement= process.env.URLALLAITEMENTS;
const urlBiberon= process.env.URLBIBERONS;

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


app.get("/rooms", async (req, res) => {
  try {
    const dataRoom = await performScrapingVertbaudet(urlRoom);
    saveApi(dataRoom, 'rooms');
    res.json(dataRoom);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/modes", async (req, res) => {
  try {
    const dataMode = await scrapingOkaidi(urlMode);
    saveApi(dataMode, 'modes');
    res.json(dataMode);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.get("/eveils", async (req, res) => {
  try {
    const dataEveil = await performScrapingVertbaudet(urlEveil);
    saveApi(dataEveil, 'eveils');
    res.json(dataEveil);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/allaitements", async (req, res) => {
  try {
    const dataAllaitement = await performScrapingVertbaudet(urlAllaitement);
    saveApi(dataAllaitement, 'allaitements');
    res.json(dataAllaitement);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/biberons", async (req, res) => {
  try {
    const dataBiberon = await performScrapingVertbaudet(urlBiberon);
    saveApi(dataBiberon, 'biberons');
    res.json(dataBiberon);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/others", async (req, res) => {
  try {
    const dataOther = await performScrapingVertbaudet(urlAll);
    saveApi(dataOther, 'others');
    res.json(dataOther);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/all", async (req, res) => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const modes = path.join(__dirname, "src/data/modes.json");
    const rooms = path.join(__dirname, "src/data/rooms.json");
    const biberons = path.join(__dirname, "src/data/biberons.json");
    const eveils = path.join(__dirname, "src/data/eveils.json");
    const allaitements = path.join(__dirname, "src/data/allaitements.json");
    const others = path.join(__dirname, "src/data/others.json");
    const poussettes = path.join(__dirname, "src/data/poussettes.json");

    const dataOther = JSON.parse(fs.readFileSync(others));
    const dataBiberon = JSON.parse(fs.readFileSync(biberons));
    const dataAllaitement = JSON.parse(fs.readFileSync(allaitements));
    const dataEveil = JSON.parse(fs.readFileSync(eveils));
    const dataMode = JSON.parse(fs.readFileSync(modes));
    const dataRoom = JSON.parse(fs.readFileSync(rooms));
    const dataPoussette = JSON.parse(fs.readFileSync(poussettes));

    res.json({
      status: "success",
      data:{
        'others': dataOther,
        'biberons': dataBiberon,
        'poussettes': dataPoussette,
        'modes': dataMode,
        'rooms': dataRoom,
        'eveils': dataEveil,
        'allaitements': dataAllaitement,
      }
    })

  } catch (error) {
    res.status(500).send(error.message);
  }
});




//regroupement de toutes les url func dans une seule


app.get("/", async (req, res) => {
  const dataOther = await performScrapingVertbaudet(urlAll);
  const dataBiberon = await performScrapingVertbaudet(urlBiberon);
  const dataAllaitement = await performScrapingVertbaudet(urlAllaitement);
  const dataEveil = await performScrapingVertbaudet(urlEveil);
  const dataMode = await scrapingOkaidi(urlMode);
  const dataRoom = await performScrapingVertbaudet(urlRoom);
  const dataPoussette = await performScrapingVertbaudet(urlPoussette);

  saveApi(dataBiberon, 'biberons');
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
      'biberons': dataBiberon,
      'poussettes': dataPoussette,
      'modes': dataMode,
      'rooms': dataRoom,
      'eveils': dataEveil,
      'allaitements': dataAllaitement,
    }
  })    
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// server.timeout = 240000; // Set timeout to 4 minutes
