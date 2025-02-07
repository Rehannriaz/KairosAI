import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const { data } = await axios.get('https://example-job-board.com/jobs');
    const $ = cheerio.load(data);

    let jobs = [];
    $('.job-listing').each((index, element) => {
      jobs.push({
        title: $(element).find('.job-title').text().trim(),
        company: $(element).find('.company-name').text().trim(),
        link: $(element).find('a').attr('href'),
      });
    });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ error: 'Scraping failed' });
  }
}
