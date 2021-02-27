const puppeteer = require('puppeteer');

module.exports.scrapping = (name) => {
	return new Promise(async (resolve, reject) => {
		try {
			/* Initiate the Puppeteer browser */
			const browser = await puppeteer.launch(); //{ headless: false }
			const page = await browser.newPage();
			/* Go to the IMDB Movie page and wait for it to load */
			await page.goto('https://www.imdb.com', { waitUntil: 'networkidle0' });
			await page.type('#suggestion-search', name);
			await page.click('#suggestion-search-button');
			await page.waitForSelector('.article');
			const aTagElements = await page.$$('td[class="result_text"] > a');
			await aTagElements[0].click();
			await page.waitForSelector('.castlist_label');
			/* Run javascript inside of the page */
			const data = await page.evaluate(async () => {
				let title = document.querySelector('div[class="title_wrapper"] > h1') ? document.querySelector('div[class="title_wrapper"] > h1').innerText : 'not available';
				let rating = document.querySelector('span[itemprop="ratingValue"]') ? document.querySelector('span[itemprop="ratingValue"]').innerText : 'not available';
				let ratingCount = document.querySelector('span[itemprop="ratingCount"]') ? document.querySelector('span[itemprop="ratingCount"]').innerText : 'not available';
				let poster = document.querySelector('div[class="poster"] > a > img') ? document.querySelector('div[class="poster"] > a > img').src : 'not available';
				let summary_text = document.querySelector('div[class="summary_text"]') ? document.querySelector('div[class="summary_text"]').innerText : 'not available';
				let Director = document.querySelector('div[class="credit_summary_item"] > a') ? document.querySelector('div[class="credit_summary_item"] > a').innerText : 'not available';

				let photoCast = [];
				document.querySelectorAll('td[class="primary_photo"] > a  > img').forEach((item) => {
					photoCast.push(item.attributes?.loadlate?.nodeValue);
				});

				let nameCast = [];
				document.querySelectorAll('td[class="character"]').forEach((item) => {
					nameCast.push(item.innerText);
				});

				let nameRealCast = [];
				document.querySelectorAll('td:nth-child(2) > a').forEach((item) => {
					nameRealCast.push(item.innerText);
				});
				/* Returning an object filled with the scraped data */
				return {
					title,
					rating,
					ratingCount,
					poster,
					summary_text,
					Director,
					photoCast,
					nameCast,
					nameRealCast,
				};
			});

			/* Outputting what we scraped */
			console.log('data :>> ', data);
			await browser.close();
			return resolve(data);
		} catch (error) {
			console.log(`Error from funcScrapping function : ${error}`);
			throw Error(error);
		}
	});
};
