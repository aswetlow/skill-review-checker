const axios = require('axios');
const cheerio = require('cheerio');

const config = {
    method: 'get',
    headers: { 'User-Agent': 'skill-review-checker user agent' }
};

const skills = {
    'MovieQuiz DE': 'https://www.amazon.de/aswetlow-Movie-Quiz/dp/B07PGMCX2R/ref=pd_rhf_se_p_img_6?_encoding=UTF8&psc=1&refRID=2B0WZ64QYPQ2RQAMKV69',
    'MovieQuiz US': 'https://www.amazon.com/gp/product/B07PGMCX2R?pf_rd_p=1581d9f4-062f-453c-b69e-0f3e00ba2652&pf_rd_r=7EDZRN3ZNGK49WWBPE3P',
    'MovieQuiz UK': 'https://www.amazon.co.uk/aswetlow-Movie-Quiz/dp/B07PGMCX2R/ref=sr_1_4?fst=as%3Aoff&qid=1555339132&refinements=p_n_date%3A10389709031&rnid=10389708031&s=digital-skills&sr=1-4',
    'MovieQuiz AU': 'https://www.amazon.com.au/aswetlow-Movie-Quiz/dp/B07PGMCX2R/ref=sr_1_10?qid=1555339272&rd=1&refinements=p_n_date%3A5109183051&rnid=5109182051&s=digital-skills&sr=1-10',
    'MovieQuiz CA': 'https://www.amazon.ca/aswetlow-Movie-Quiz/dp/B07PGMCX2R/ref=sr_1_1?fst=as%3Aoff&qid=1555339365&refinements=p_n_date%3A16381759011&rnid=16381758011&s=digital-skills&sr=1-1',
};

const crawl = async (name, url) => {
    try {

        const response = await axios.get(url, config);
        const $ = cheerio.load(response.data);

        let totalVoiceRatingCountText;
        let totalReviewCountText = $(`[data-hook='total-review-count']`).text();
        let totalRatingCountText = $(`[data-hook='total-rating-count']`).text();

        let totalReviewCount = parseInt(totalReviewCountText.replace(/\D/g,'').trim()) || 0;
        let totalRatingCount = parseInt(totalRatingCountText.replace(/\D/g,'').trim()) || 0;
        let totalVoiceRatingCount = totalRatingCount - totalReviewCount < 0 ? 0 : totalRatingCount - totalReviewCount;

        totalReviewCountText = totalReviewCount === 1 ? `${totalReviewCount} review` : `${totalReviewCount} reviews`;
        totalRatingCountText = totalRatingCount === 1 ? `${totalRatingCount} rating` : `${totalRatingCount} ratings`;
        totalVoiceRatingCountText = totalVoiceRatingCount === 1 ? `${totalVoiceRatingCount} voice rating` : `${totalVoiceRatingCount} voice ratings`;

        let averageRating = $('.arp-rating-out-of-text').text();
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

