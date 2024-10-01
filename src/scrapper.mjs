import puppeteer from "puppeteer";


export async function performScrapingVertbaudet(url) {
  let browser;
  try {
  browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url,{ waitUntil: 'networkidle0' });

  // Scroll down the page to load more products
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // wait for 5 seconds to allow more products to load
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const products = await page.evaluate(() => {
    let products = [];

    let elements = document.querySelectorAll("div.product-content");
    for (let element of elements) {
      // let imgUrl = element.querySelector("div.picture span.picture-container img")?.getAttribute("data-frz-src");

      let brand = element.querySelector("div.product-informations div.brand a")?.textContent.trim();
      let title = element.querySelector("div.product-informations div.title a")?.textContent.trim();
      let link = element.querySelector("div.product-informations div.title a")?.href;
      let id = element.querySelector("div.product")?.getAttribute('data-productid');
      let imgUrl = element.querySelector("div.picture span.picture-container img");
      // const imageUrl = element.querySelector('div.picture span.picture-container img').getAttribute('src') || 
      //            element.querySelector('div.picture span.picture-container img').getAttribute('data-src') || 
      //            element.querySelector('div.picture span.picture-container img').getAttribute('data-lazy-src') || 
      //            element.querySelector('div.picture span.picture-container source').getAttribute('srcset')

      
      let price = element.querySelector("div.product-informations div.pricecontainer span.price-value.public-price")?.textContent.trim();
    
      let clubPrice = element.querySelector('div.product-informations div.pricecontainer span.price-value.club-price')?.textContent.trim();

      // if (imageUrl.startsWith("https") || imageUrl.startsWith("http")) {
        products.push({
          // img: imageUrl,
          brand: brand,
          title: title,
          price: price,
          link: link,
          clubPrice: clubPrice,
          img: imgUrl?.getAttribute('data-src') || imgUrl?.getAttribute('src') || imgUrl?.getAttribute('data-lazy-src'),

          // id: id,

        });
      // }
    }
    return products;
  });

 // console.log("======>", products, "======");

  // await saveApi(products, endpoint);

return products;
} catch (error) {
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