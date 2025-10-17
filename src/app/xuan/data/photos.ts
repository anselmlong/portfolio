export type SamplePhoto = { id: number; url: string; caption: string };

export const samplePhotos: SamplePhoto[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  url: `/xuan/photos/${i + 1}.jpg`,
  caption: `Memory ${i + 1}`,
}));
