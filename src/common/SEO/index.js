import { Helmet } from 'react-helmet';
import { SeoSrc } from './seoSrc';

const SEO = ({ page, title, description, href, type, image }) => {
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
      <meta property='og:image' content={'https://kattbnb-og.herokuapp.com/ogimage?name=carla&location=Stockholm&avatar=https%3A%2F%2Fkattbnb.s3.eu-north-1.amazonaws.com%2FNJTdy7X83ZEL2i9wTmgKYQGq%3Fresponse-content-disposition%3Dinline%253B%2520filename%253D%2522base.png%2522%253B%2520filename%252A%253DUTF-8%2527%2527base.png%26response-content-type%3Dimage%252Fpng%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAXJN45BDWHSNVO4EI%252F20221030%252Feu-north-1%252Fs3%252Faws4_request%26X-Amz-Date%3D20221030T182526Z%26X-Amz-Expires%3D3600%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Signature%3Dce3c5c847b37aabce33b81aea3cbc851a8c0ac07739e24b35f6d16df5a975a3a'} />
      {/* <meta property='og:image' content={`https://kattbnb.se/${seoImage}`} /> */}
    </Helmet>
  );
};

export default SEO;
