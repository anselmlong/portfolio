import portfolioData from './portfolio.json';

// Create mutable arrays from the JSON data
export const imageUrls = [...portfolioData.imageUrls];
export const { projects } = portfolioData;
export const { experiences } = portfolioData;

// Function to get current pictures (regenerated each time)
export const getPictures = () => imageUrls.map((url, index) => ({
  id: index + 1,
  url
}));

// Function to add a new image URL
export const addImageUrl = (url: string) => {
  imageUrls.push(url);
};

// Function to remove an image URL
export const removeImageUrl = (url: string) => {
  const index = imageUrls.indexOf(url);
  if (index > -1) {
    imageUrls.splice(index, 1);
  }
};