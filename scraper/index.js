const puppeteer = require("puppeteer");
const { hashTweetData } = require("./util");

(async () => {
	// constants
	const PAGE_URL = `https://twitter.com/i/topics/888105153038958593`;
	const TWEET_LIMIT = 3100;

	// storage for set of tweets
	const tweetSet = {};

	// initialize browser with page and viewport
	const browser = await puppeteer.launch({
		headless: false,
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1000,
		height: 800,
	});
	await page.goto(PAGE_URL, {
		waitUntil: "networkidle0",
	});

	// grab tweets until a) we cannot physically anymore or b) we hit the limit that we need
	let canMove = true;
	let i = 0;
	while (canMove && i < TWEET_LIMIT) {
		// press j to go to next tweet
		await page.keyboard.press("j", { delay: 200 });

		const data = await page.evaluate(() => {
			const MIN_TWEET_SPLIT_LENGTH = 5;
			// get the tweet that is focused
			const tweet = document.querySelector(
				"article[data-focusvisible-polyfill=true]",
			);
			const date = tweet ? tweet.querySelector("time") : null;

			// remove interaction counts because those mess with the innerText retrieval
			const interactions = document.querySelector("div[role=group]");
			if (interactions) interactions.remove();

			// split up tweet text into lines
			let rawTweet = tweet ? tweet.innerText : '';
			rawTweet = rawTweet.split("\n");

			// if the split tweet text does not contain the required number of splits, abort
			if (rawTweet < MIN_TWEET_SPLIT_LENGTH) return null;

			// return tweet and date if found
			return {
				name: rawTweet[0],
				handle: rawTweet[1].replace("@", ""),
				text: rawTweet.slice(4).join("\n"),
				date: date && date.dateTime,
			};
		});

		// check if tweet is in tweet set. if it is, we know to stop
		const key = data !== null ? hashTweetData(data) : null;
		if (!(key in tweetSet)) {
			if (key === null) continue;
			i++;
			tweetSet[key] = data;
		} else {
			console.log("Captured last tweet in feed. (Hit duplicate)");
			canMove = false;
		}
	}

	const allTweets = Object.values(tweetSet);
	console.log("Collected", Object.values(tweetSet).length, "tweets");
	console.log(JSON.stringify(allTweets));
})();
