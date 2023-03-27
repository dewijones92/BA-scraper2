import { firefox } from 'playwright-core';
import { createCursor } from './cursor';
import { delay } from './utils';

(async () => {
	try {
		const browser = await firefox.launch({
			headless: false,
		});
		const browserContext = await browser.newContext({
			viewport: null,
		});

		

		
		const page = await browserContext.newPage();
		page.on('request', request => console.log('REQUEST_URL >>', request.method(), request.url()));
		page.on('response', async response => {
			console.log('RESPONSE_URL <<', response.status(), response.url());
			try{
				const responseHeaders = await response.allHeaders();
				Object.keys(responseHeaders).forEach(key => {
					const value = responseHeaders[key];
					console.log(`${key}: ${value}`);
				});
				console.log(`response.url(): ${response.url()}`)
				if(
				//	responseHeaders["content-type"].includes("includes")
				// &&
				 response.url().includes("flightavailability")
				) {
					console.log("LOGGING BODY")
					console.log(`{{FLIGHTDATA}}${await response.body()}`)
				}
			}
			catch(e) {
				console.log(`error getting body`)
			}
			
		});

	
		const cursor = await createCursor(page);

		await page.goto(process.argv[2]);

		const randomPoint = await cursor.getRandomPointOnViewport();

		const cookieButtonSelector = 'button[aria-label="Agree To All Cookies"]'

		await cursor.actions.move(await cursor.getRandomPointOnViewport());
		await cursor.actions.move(await cursor.getRandomPointOnViewport());

		await cursor.actions.click(
			{ target: cookieButtonSelector, waitBetweenClick: [20, 50] },
			{
				paddingPercentage: 50,
				waitBeforeMove: [1_000, 2_000],
				waitForSelector: 30_000,
			}
		);
		await cursor.actions.move(await cursor.getRandomPointOnViewport());
		await cursor.actions.move(await cursor.getRandomPointOnViewport());
		await cursor.actions.move({ x: 13, y: 13 });

		const moveAround = async () => {
			while(true){
				console.log("MOVE AROUND");

				await cursor.actions.move(await cursor.getRandomPointOnViewport());
			//	await page.mouse.wheel(10, 10);
				await cursor.actions.move(await cursor.getRandomPointOnViewport());
				//await page.mouse.wheel(-10, -10);
				await delay(500)

			}
		}

		moveAround()


		async function reload() {
			// Your code here
			    console.log("PAGE RELOAD STARTED");
				page.reload()
		  }
		  
		  setInterval(async () => {
			await reload();
		  }, 5000); 
	




	
	} catch (error: any) {
		console.log(error.message);
	}
})();
