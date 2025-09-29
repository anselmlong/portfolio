import portfolioData from './portfolio.json';

export const { imageUrls, projects } = portfolioData;

export const pictures = imageUrls.map((url, index) => ({
  id: index + 1,
  url
}));