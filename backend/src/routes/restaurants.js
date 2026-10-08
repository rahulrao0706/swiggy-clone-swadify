const router = require('express').Router();
const restaurants = require('../data/restaurants');

const summary = ({ menu, ...rest }) => rest;

// GET /api/restaurants?search=&cuisine=&veg=true&minRating=4&fast=true&sort=rating|eta|costLow|costHigh
router.get('/', (req, res) => {
  const { search = '', cuisine = '', veg, minRating, fast, sort = 'relevance' } = req.query;
  const q = search.trim().toLowerCase();
  const c = cuisine.trim().toLowerCase();

  let list = restaurants.filter((r) => {
    if (q) {
      const hay = [r.name, ...r.cuisines, ...r.menu.map((m) => m.name)].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (c && !r.cuisines.some((x) => x.toLowerCase().includes(c))) return false;
    if (veg === 'true' && !r.pureVeg) return false;
    if (minRating && r.rating < Number(minRating)) return false;
    if (fast === 'true' && r.eta > 25) return false;
    return true;
  });

  const sorters = {
    rating: (a, b) => b.rating - a.rating,
    eta: (a, b) => a.eta - b.eta,
    costLow: (a, b) => a.costForTwo - b.costForTwo,
    costHigh: (a, b) => b.costForTwo - a.costForTwo,
  };
  if (sorters[sort]) list = [...list].sort(sorters[sort]);

  res.json(list.map(summary));
});

router.get('/:id', (req, res) => {
  const r = restaurants.find((x) => x.id === req.params.id);
  if (!r) return res.status(404).json({ message: 'Restaurant not found' });
  res.json(r);
});

module.exports = router;
