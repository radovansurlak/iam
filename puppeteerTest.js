const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		args: ['--start-fullscreen']
	});
	let scrapedCount = {};
	let analysedCount = {};
	let imageData = {
		tags: [],
		analysedTags: [],
		captions: [],
	};
	let tags = [];
	let sortedTags = [];
	let requestData = {
		"requests": [
			{
				"tasks": [
					{
						"type": "CAPTIONS"
					},
					// {
					// 	"type": "AESTHETIC_SCORE"
					// },
					{
						"type": "TAGS"
					}
				],
				"image": {
					"url": ""
				}
			}
		]
	};

	// Initialize the browser
	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 900 });
	await page.goto('https://www.eyeem.com/a/13076706');
	await page.click('#gridPhoto-0 > a:first-child')

	for (let i = 0; i <= 5; i++) {
		tags = await page.evaluate(async () => [...document.querySelectorAll(".g_bubble")].map(tag => tag.innerText.toLowerCase()));

		let imageUrl = await page.evaluate(() => document.querySelector('.sc-jwKygS.khmKrD').firstChild.style.backgroundImage.match(/"(h.*)"/)[1]);

		requestData.requests[0].image.url = imageUrl;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'Bearer japladllg10s1pl887aao9tcadtsf2deoeepc752'
			},
			data: requestData,
			url: 'https://vision-api.eyeem.com/v1/analyze',
		};

		let result = await axios(options);

		imageData.tags = [...imageData.tags, ...tags];
		imageData.analysedTags = [...imageData.analysedTags, ...result.data.responses[0].tags.map(tag => tag.text)];
		imageData.captions = [...imageData.captions, ...result.data.responses[0].captions.map(caption => caption.text.toLowerCase())];

		await page.evaluate(() => document.querySelector('.pview_stage_contextBeltImage-active').parentElement.nextSibling.click()); // Navigate to the next image
		// await page.waitFor(200);
	}
	// imageData.aestheticScore = result.data.responses[0].aesthetic_score.score;
	// Count tags
	
	debugger;
	fs.writeFileSync('tags.json', JSON.stringify(imageData), 'ascii', (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
	});
	await browser.close();
})();