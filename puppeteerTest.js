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
	let sortedScrapedTags = [];
	let sortedAnalysedTags = [];
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

	for (let i = 0; i <= 200; i++) {
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
		await page.waitFor(1000);
	}
	// imageData.aestheticScore = result.data.responses[0].aesthetic_score.score;
	// Count tags

	imageData.tags.map(tag => {
		if (scrapedCount.hasOwnProperty(tag)) {
			scrapedCount[tag]++;
		} else {
		  Object.defineProperty(scrapedCount, tag, {value: 1, writable: true, enumerable: true});
		}
	});

	imageData.analysedTags.map(tag => {
		if (analysedCount.hasOwnProperty(tag)) {
			analysedCount[tag]++;
		} else {
		  Object.defineProperty(analysedCount, tag, {value: 1, writable: true, enumerable: true});
		}
	});

	for (let tag in scrapedCount) {
    	sortedScrapedTags.push([tag, scrapedCount[tag]]);
	};
	for (let tag in analysedCount) {
    	sortedAnalysedTags.push([tag, analysedCount[tag]]);
	};
	
	sortedScrapedTags.sort((a,b) => b[1] - a[1]);
	sortedAnalysedTags.sort((a,b) => b[1] - a[1]);

	let output = {
		organicTags: sortedScrapedTags,
		analysedTags: sortedAnalysedTags,
		captions: imageData.captions,
	}

	debugger;

	fs.writeFileSync('tags.json', JSON.stringify(output), 'ascii', (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
	});

	await browser.close();
})();