import cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    res.status(400).json({ error: 'Missing search query' });
    return;
  }
  const searchUrl = `https://www.amazon.es/s?k=${encodeURIComponent(q)}`;
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const body = await response.text();
    const $ = cheerio.load(body);
    const items = [];
    $('div.s-result-item[data-component-type="s-search-result"]').each((_, element) => {
      const title = $(element).find('h2 a span').text().trim();
      const priceWhole = $(element).find('.a-price .a-price-whole').first().text().trim();
      const priceFraction = $(element).find('.a-price .a-price-fraction').first().text().trim();
      const price = priceWhole ? priceWhole + (priceFraction ? ',' + priceFraction : '') : null;
      const image = $(element).find('img.s-image').attr('src');
      const relativeUrl = $(element).find('h2 a').attr('href');
      const productUrl = relativeUrl ? 'https://www.amazon.es' + relativeUrl : null;
      if (title) {
        items.push({
          title,
          price,
          image,
          url: productUrl
        });
      }
    });
    res.status(200).json({ results: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
