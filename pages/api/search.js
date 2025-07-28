import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    res.status(400).json({ error: 'Missing search query' });
    return;
  }
  try {
    const url = 'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const products = [];
    $('.thumbnail').each((i, elem) => {
      const title = $(elem).find('.title').attr('title') || $(elem).find('.title').text();
      if (title && title.toLowerCase().includes(q.toLowerCase())) {
        const priceText = $(elem).find('.price').text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const link = $(elem).find('a.title').attr('href');
        const image = $(elem).find('img').attr('src');
        products.push({
          title,
          price,
          image: image ? 'https://webscraper.io' + image : null,
          productUrl: link ? 'https://webscraper.io' + link : null
        });
      }
    });
    res.status(200).json({ items: products, results: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
}
