// import puppeteer from "puppeteer-extra";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";

// puppeteer.use(StealthPlugin());

// export async function performScrapingRedoute(url) {
//   let browser;
//   try {
//     browser = await puppeteer.launch({ 
//       headless: true , 
//       args: [
//       '--no-sandbox',
//     '--disable-setuid-sandbox',
//     '--disable-dev-shm-usage',
//     '--disable-gpu',
//     '--disable-accelerated-2d-canvas',
//     '--no-first-run',
//     '--no-zygote',
//     '--single-process',
//     '--disable-background-networking',
//     '--disable-software-rasterizer',
//     '--disable-extensions',
//     '--disable-sync',
//     '--disable-default-apps',
//     '--mute-audio',
//     '--disable-gl-drawing-for-tests',
//     '--disable-breakpad',
//     '--disable-crash-reporter',
//     '--window-size=1920,1080'
//     ]});
//     const page = await browser.newPage();
  
//     try {
//       await page.goto(url, { waitUntil: "networkidle2" });
//     } catch (error) {
//       console.error(`Error> loading the page${url}:${error}`);
//       await browser.close();
//       return;
//     }
   
//     // Scroll down the page to load more products
//     await page.evaluate(() => {
//       window.scrollTo(0, document.body.scrollHeight);
//     });
  
//     // wait for 5 seconds to allow more products to load
//     await new Promise((resolve) => setTimeout(resolve, 5000));
  
//     const products = await page.evaluate(() => {
//       let products = [];
    
//       let elements = document.querySelectorAll("div.pl-product-content");
//       for (let element of elements) {
//         let imgUrl = element.querySelector('div.pl-picture picture img');
//         let brand = element.querySelector("div.product-info div.product-info-wrapper div.product-info-details")?.textContent.trim();
//         let title = element.querySelector("div.product-title.pl-product-name")?.textContent.trim();
//         // let color = element.querySelector('div.details div.existe-coloris span:last-child')?.textContent;
//         let price = element.querySelector("div.pl-price-line div.product-price-container span.product-price")?.textContent.trim();
//         let link = element.querySelector('a.pl-product-link').href;
//         products.push({
//           img: imgUrl?.getAttribute('src') || imgUrl?.getAttribute('data-src'),
//           brand: brand,
//           title: title,
//           price: price,
//           link: link
//         });
   
//       }
//       return products;
//     });

//     return products;
//   }
  
  
// catch (error) {
//   console.error(error);
//     // Handle the error appropriately, e.g., by returning an empty array or a default value
//   return [];
// } finally {
//     // Always close the browser, whether an error occurred or not
//   if (browser) {
//     await browser.close();
//   }
// }
// }


import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function performScrapingRedoute(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true, 
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
    
    await page.goto(url, { waitUntil: "networkidle0" });

    await autoScroll(page); // Utiliser le défilement automatique optimisé

    const products = await page.evaluate(() => {
      let products = [];
      let elements = document.querySelectorAll("div.pl-product-content");
      
      elements.forEach((element) => {
        let imgUrl = element.querySelector('div.pl-picture picture img');
        let brand = element.querySelector("div.product-info div.product-info-details")?.textContent.trim();
        let title = element.querySelector("div.product-title.pl-product-name")?.textContent.trim();
        let price = element.querySelector("div.pl-price-line div.product-price-container span.product-price")?.textContent.trim();
        let link = element.querySelector('a.pl-product-link')?.href;

        products.push({
          img: imgUrl?.getAttribute('src') || imgUrl?.getAttribute('data-src'),
          brand: brand,
          title: title,
          price: price,
          link: link
        });
      });

      return products;
    });

    return products;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}
