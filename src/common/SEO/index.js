import { Helmet } from 'react-helmet';
import { SeoSrc } from './seoSrc';

const SEO = ({page}) => {
  return (
    <Helmet>
      <title>{SeoSrc[page]['title']}</title>
      <meta
        name='description'
        content={SeoSrc[page]['description']}
      />
      <link rel='canonical' href={`https://kattbnb.se${SeoSrc[page]['href']}`} />
      <meta property='og:title' content={SeoSrc[page]['title']} />
      <meta property='og:url' content={`https://kattbnb.se${SeoSrc[page]['href']}`} />
      <meta property='og:type' content={SeoSrc[page]['type']} />
      <meta
        property='og:description'
        content={SeoSrc[page]['description']}
      />
      <meta property='og:image' content={`https://kattbnb.se/${SeoSrc[page]['image']}`} />
    </Helmet>
  );
};

export default SEO;
