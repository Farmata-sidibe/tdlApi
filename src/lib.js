import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
// import request from "request";

export async function saveApi(products, endpoint) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dataDir = path.join(__dirname, "data");

  // Crée le répertoire 'data' s'il n'existe pas
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Vérifie que 'products' contient bien des données avant de les sauvegarder
  if (!products || products.length === 0) {
    console.error(`No data to save for endpoint: ${endpoint}`);
    return;
  }

  const fileName = `${endpoint}.json`;
  const filePath = path.join(dataDir, fileName);

  try {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    console.log(`Data saved successfully for endpoint: ${endpoint}`);
  } catch (error) {
    console.error(`Error saving data for endpoint: ${endpoint}`, error);
  }
}
