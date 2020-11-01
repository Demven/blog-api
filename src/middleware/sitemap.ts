import createSitemap, { Sitemap, ISitemapItemOptionsLoose } from 'sitemap';
import Article from '../dal/models/article';

const { WWW_HOST } = process.env;

const CACHE_TIMEOUT = 6 * 60 * 60 * 1000; // 6 hours

let _sitemap: Sitemap;
let _sitemapGeneratedDate: Date = new Date();

function fetchArticles():Promise<ISitemapItemOptionsLoose[]> {
  return new Promise((resolve) => {
    Article
      .find({}, 'slug image last_updated')
      .populate('image')
      .sort({ last_updated: 'desc' })
      .exec()
      .then(articles => {
        const urls: ISitemapItemOptionsLoose[] = articles.map((article:any) => ({
          url: `${WWW_HOST}/article/${article.slug}`,
          lastmodISO: article.last_updated.toISOString(),
          img: {
            url: article.image ? article.image.url : '',
            caption: article.image ? article.image.description : '',
            license: 'https://creativecommons.org/licenses/by-nc/4.0/'
          }
        }));

        resolve(urls);
      });
  });
}

function createNewSitemap(): Promise<Sitemap> {
  return new Promise((resolve) => {
    fetchArticles()
      .then((urls: ISitemapItemOptionsLoose[]) => {
        _sitemap = createSitemap({
          hostname: 'https://www.dmitry-salnikov.info',
          cacheTime: CACHE_TIMEOUT,
          urls
        });

        resolve(_sitemap);
      });
  });
}

function getSitemapGenerator(): Promise<Sitemap> {
  const currentDate = +(new Date());
  const cacheIsStale = currentDate - +_sitemapGeneratedDate > CACHE_TIMEOUT;

  if (!_sitemap || cacheIsStale) {
    _sitemapGeneratedDate = new Date();

    return createNewSitemap();
  } else {
    // reuse existing sitemap
    return Promise.resolve(_sitemap);
  }
}

export default function generateSitemap(req, res, next) {
  getSitemapGenerator()
    .then((sitemap: Sitemap) => {
      const xml = sitemap.toXML();

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    })
    .catch(error => next(error));
}
