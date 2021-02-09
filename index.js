const axios = require('axios');
const cheerio = require('cheerio');

const config = {
    method: 'get',
    headers: { 'User-Agent': 'skill-review-checker user agent' }
};

const skills = {
    'MovieQuiz DE': 'https://www.amazon.de/product-reviews/B07PGMCX2R/',
    'MovieQuiz US': 'https://www.amazon.com/gp/product-reviews/B07PGMCX2R',
    'MovieQuiz AU': 'https://www.amazon.com.au/product-reviews/B07PGMCX2R',
    'MovieQuiz CA': 'https://www.amazon.ca/product-reviews/B07PGMCX2R',
    'Escape the room': 'https://www.amazon.com/product-reviews/B075J914W2',
    'Find My Phone': 'https://www.amazon.com/product-reviews/B076PHYQD2',
    'Song Quiz': 'https://www.amazon.com/product-reviews/B06XWGR7XZ',
};

const crawl = async (name, url) => {
    try {

        const response = await axios.get(url, config);
        const $ = cheerio.load(response.data);

        let totalVoiceRatingCountText;
        let totalReviewRatingCountText = $(`[data-hook='cr-filter-info-review-rating-count']`).text().split('|');
        let totalReviewCountText = totalReviewRatingCountText[1];
        let totalRatingCountText = totalReviewRatingCountText[0];
        let totalReviewCount = parseInt(totalReviewCountText.replace(/\D/g,'').trim()) || 0;
        let totalRatingCount = parseInt(totalRatingCountText.replace(/\D/g,'').trim()) || 0;
        let totalVoiceRatingCount = totalRatingCount - totalReviewCount < 0 ? 0 : totalRatingCount - totalReviewCount;

        totalReviewCountText = totalReviewCount === 1 ? `${totalReviewCount} review` : `${totalReviewCount} reviews`;
        totalRatingCountText = totalRatingCount === 1 ? `${totalRatingCount} rating` : `${totalRatingCount} ratings`;
        totalVoiceRatingCountText = totalVoiceRatingCount === 1 ? `${totalVoiceRatingCount} voice rating` : `${totalVoiceRatingCount} voice ratings`;

        let averageRating = $(`[data-hook="rating-out-of-text"]`).text();
        averageRating = averageRating.substr(0, averageRating.indexOf(' ')); // remove blank
        averageRating = averageRating.replace(/,/g,'.');

        console.log(`${name}: ${averageRating} - ${totalReviewCountText} / ${totalVoiceRatingCountText}`);
    } catch (e) {
        console.log(e);
    }
};

const getReviews = async (skills) => {
    console.log();
    const crawls = [];
    for ([name, url] of Object.entries(skills)) {
        crawls.push(crawl(name, url))
    }
    await Promise.all(crawls);
    console.log();
};

getReviews(skills);

