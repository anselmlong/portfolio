import { imageUrls } from "~/data";
import Image from "next/image";

const getImage = (id: number) => {
  return imageUrls[id - 1];
};

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: photoId } = await params;
  const imageUrl = getImage(Number(photoId));
  
  if (!imageUrl) {
    return <div className="container mx-auto p-4">Photo not found</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Photo {photoId}</h1>
      <Image src={imageUrl} alt={`Photo ${photoId}`} className="w-[400px] h-auto rounded-lg" width={400} height={300} />
    </div>
  );
}