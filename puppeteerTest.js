const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		args: ['--start-fullscreen']
	});
	let count = {};
	let imageData = {};
	let tags = [];
	let sortedTags = [];
	let requestData = {
		"requests": [
			{
				"tasks": [
					{
						"type": "CAPTIONS"
					},
					{
						"type": "AESTHETIC_SCORE"
					},
					{
						"type": "TAGS"
					}
				],
				"image": {
					"url": "https://cdn4.eyeem.com/thumb/791d0ddd1db41ad92910236b086fe16653c25327-1490950936712/900/900"
				}
			}
		]
	};
	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 900 });
	await page.goto('https://www.eyeem.com/a/13076706');
	await page.click('#gridPhoto-0 > a:first-child')
	await page.evaluate(() => document.querySelector('.pview_stage_contextBeltImage-active').parentElement.nextSibling.click()); 
	await page.waitFor(300);
	tags = await page.evaluate(async () => {
		return [...document.querySelectorAll(".g_bubble")].map(tag => {
			return tag.innerText;
		});
	});
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
	imageData.tags = tags;
	imageData.aestheticScore = result.data.responses[0].aesthetic_score.score;
	imageData.captions = result.data.responses[0].captions.map(caption => caption.text);
	imageData.analysedTags = result.data.responses[0].tags;
	let test = JSON.stringify(imageData);
	debugger;
	fs.writeFileSync('tags.json', JSON.stringify(imageData), 'ascii',  (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
	});
	await browser.close();
})();