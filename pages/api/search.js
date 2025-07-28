import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    res.status(400).json({ error: 'Missing search query' });
    return;
  }

  try {
    const apiUrl = 'https://dummyjson.com/products/search?q=' + encodeURIComponent(q);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }
    const data = await response.json();
    const items = (data.products || []).map((product) => ({
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      productUrl: 'https://dummyjson.com/products/' + product.id
    }));
    res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
}
