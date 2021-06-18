const axios = require("axios");
const cheerio = require("cheerio");
const json2csv = require("json2csv").Parser;
const fs = require("fs");

// url list for movies
const moviesUrl = ["https://www.imdb.com/title/tt9544034/?ref_=nv_sr_srsg_0",
"https://www.imdb.com/title/tt9432978/?ref_=tt_sims_tti",
"https://www.imdb.com/title/tt12004706/?ref_=tt_sims_tti",
"https://www.imdb.com/title/tt9680440/?ref_=tt_sims_tti",
"https://www.imdb.com/title/tt4742876/?ref_=tt_sims_tti",
"https://www.imdb.com/title/tt14392248/?ref_=fn_al_tt_1",
"https://www.imdb.com/title/tt12392504?ref_=nv_sr_srsg_0",
"https://www.imdb.com/title/tt6473300/?ref_=tt_sims_tti"];


(async () => {
  const imdbData = [];
  try {
    for (const movie of moviesUrl) {
      const response = await axios({
        method: "get",
        url: movie,
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9",
        },
        responseType: 'text',
      });
      console.log('status: '+response.status);
  
      const $ = cheerio.load(response.data);
      // const htmlContent = $.html();
      const title = $('div[class="title_wrapper"] > h1').text().trim();
      const rating = $('.ratingValue span[itemprop="ratingValue"]').text();
      const releaseDate = $(
        '.title_wrapper > .subtext > a[title="See more release dates"]').text().trim();
      const summaryText = $(".plot_summary_wrapper .plot_summary .summary_text").text().trim();
  
      // appending data in imdb array
      imdbData.push({
        title,
        rating,
        releaseDate,
        summaryText,
      });
    }

    // converting array to csv
    const j2csvp = new json2csv();
    const csv = j2csvp.parse(imdbData);

    // save the csv to file system
    fs.writeFileSync("./imdb.csv", csv, "utf-8");

    // fs.writeFileSync("./res.html", htmlContent);

    console.log('file saved successfully');
    
  } catch (error) {
    console.error(error);
  }
})();
