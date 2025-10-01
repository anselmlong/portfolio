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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Photo Gallery</h1>
          <p className="text-gray-300">Explore my photography collection</p>
        </div>


        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Image Section */}
          <div className="relative group">
            <div className="overflow-hidden rounded-xl shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <img 
                src={imageUrl} 
                alt={`Photo ${photoId}`} 
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-white mb-4">Me on a boat</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">
                    This is me standing on a boat, enjoying a beautiful day on the water. 
                    The experience was incredible and this photo captures a perfect moment 
                    of adventure and tranquility.
                  </p>
                </div>


                <div>
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Adventure</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Nature</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Boats</span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">Water</span>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
	
  );
}