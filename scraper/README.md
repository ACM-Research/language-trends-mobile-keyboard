# Tweet Scraper

Used by two teams in the Fall 2021 semester to collect data unsupported by the Twitter API.

> ⚠️ **Warning**
> This is **very** brittle, so use with caution! It's prone to breaking at any time.

## Usage
Make sure you have Node.js installed.

1. `cd scraper`
2. `npm install`
3. Change URL in `index.js`, line 6, as well as tweet limit on line 7. Set this arbitrarily high to keep going until no more tweets load.
4. `node index.js`.

