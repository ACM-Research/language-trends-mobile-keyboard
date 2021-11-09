function hashCode(str) {
	var hash = 0;
	if (str.length == 0) {
		return hash;
	}
	for (var i = 0; i < str.length; i++) {
		var char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

function hashTweetData(data) {
	return hashCode(`${data.rawTweet}${data.date}`);
}

module.exports = { hashCode, hashTweetData };
