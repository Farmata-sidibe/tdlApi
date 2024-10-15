import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function scrapingOkaidi(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true ,
      args: [
        '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-background-networking',
    '--disable-software-rasterizer',
    '--disable-extensions',
    '--disable-sync',
    '--disable-default-apps',
    '--mute-audio',
    '--disable-gl-drawing-for-tests',
    '--disable-breakpad',
    '--disable-crash-reporter',
    '--window-size=1920,1080'
      ]
    });
    const page = await browser.newPage();
  
    try {
      await page.goto(url, { waitUntil: "networkidle2" });
    } catch (error) {
      console.error(`Error> loading the page${url}:${error}`);
      await browser.close();
      return;
    }
   
    // Scroll down the page to load more products
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  
    // wait for 5 seconds to allow more products to load
    await new Promise((resolve) => setTimeout(resolve, 5000));
  
    const products = await page.evaluate(() => {
      let products = [];
    
      let elements = document.querySelectorAll("div.product-item");
      for (let element of elements) {
        let imgUrl = element.querySelector('div.picture div.Img div.img-set img');
        let brand = element.querySelector("div.details div.brand span")?.textContent.trim();
        let title = element.querySelector("div.details a.product-title span.product-title-txt")?.textContent.trim();
        let color = element.querySelector('div.details div.existe-coloris span:last-child')?.textContent;
        let price = element.querySelector("div.details div.add-info div.prices span")?.textContent;
  
        let lis = element.querySelectorAll("div.details div.taille ul li");
        let sizes = [];
        for (let li of lis){
          let size = li.querySelector('label')?.textContent.trim();
          sizes.push(size);
        }
        let link = element.querySelector('div.details div.product-title a');
        products.push({
          img: imgUrl?.getAttribute('src') || imgUrl?.getAttribute('data-src'),
          brand: brand,
          title: title,
          color: color,
          price: price,
          link: 'https://www.okaidi.fr'+link?.getAttribute("href"),
          size: sizes
        });
   
      }
      return products;
    });

    return products;
  }
  
  
catch (error) {
  console.error(error);
    // Handle the error appropriately, e.g., by returning an empty array or a default value
  return [];
} finally {
    // Always close the browser, whether an error occurred or not
  if (browser) {
    await browser.close();
  }
}
}
// async function saveApi(products, endpoint) {
//   const __dirname = path.dirname(fileURLToPath(import.meta.url));
//   const dataDir = path.join(__dirname, "data");

//   if (!fs.existsSync(dataDir)) {
//     fs.mkdirSync(dataDir);
//   }

//   const fileName = `${endpoint}.json`; // Use the endpoint to create the file name
//   const filePath = path.join(dataDir, fileName);

//   fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
// }



