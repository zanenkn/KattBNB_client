import { Helmet } from 'react-helmet';
import { SeoSrc } from './seoSrc';

const SEO = ({ page, title, description, href, type, image, dynamicOGimg }) => {
  let seoTitle, seoDescription, seoHref, seoType, seoImage;

  if (page) {
    seoTitle = SeoSrc[page]['title'];
    seoDescription = SeoSrc[page]['description'];
    seoHref = SeoSrc[page]['href'];
    seoType = SeoSrc[page]['type'];
    seoImage = SeoSrc[page]['image'];
  } else {
    seoTitle = title;
    seoDescription = description;
    seoHref = href;
    seoType = type;
    seoImage = image;
  }

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name='description' content={seoDescription} />
      <link rel='canonical' href={`https://kattbnb.se${seoHref}`} />
      <meta property='og:title' content={seoTitle} />
      <meta property='og:url' content={`https://kattbnb.se${seoHref}`} />
      <meta property='og:type' content={seoType} />
      <meta property='og:description' content={seoDescription} />
      <meta property='og:image' content={image ? `https://kattbnb.se/${seoImage}` : dynamicOGimg}/>
    </Helmet>
  );
};

export default SEO;
