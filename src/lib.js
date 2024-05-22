import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
// import request from "request";

export async function saveApi(products, endpoint) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dataDir = path.join(__dirname, "data");
  
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
  
    const fileName = `${endpoint}.json`; // Use the endpoint to create the file name
    const filePath = path.join(dataDir, fileName);
  
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}