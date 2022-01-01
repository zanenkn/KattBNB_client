require('babel-register')({
  presets: ['es2015', 'react'],
});

const router = require('./sitemap-routes').default;
const Sitemap = require('react-router-sitemap').default;
const locations = require('../Modules/locationData');

let locationQuery = [];

locations.map((location) => locationQuery.push(location['name']));

const config = {
  '/search-results?location=:query': [{ query: locationQuery }],
};

function generateSitemap() {
  return new Sitemap(router).applyParams(config).build('https://kattbnb.se').save('./public/sitemap.xml');
}

generateSitemap();
