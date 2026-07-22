import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  channel: string;
  description: string;
  thumbnail: string;
  url: string;
}

interface VideoSectionProps {
  topic: string;
}

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <a 
      href={video.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col bg-[#140D33] border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:scale-[1.02] transition-all cursor-pointer group shadow-xl"
    >
      <div className="relative aspect-video w-full bg-gray-900">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-indigo-500/90 flex items-center justify-center backdrop-blur-sm shadow-lg transform group-hover:scale-110 transition-transform">
            <Play fill="currentColor" size={20} className="text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wide">
          {video.duration}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
          {video.title}
        </h4>
        <div className="text-[11px] font-semibold text-gray-400 mt-2 mb-1 flex items-center gap-1">
          {video.channel}
        </div>
        <p className="text-[10px] text-gray-500 line-clamp-2 mt-auto">
          {video.description}
        </p>
      </div>
    </a>
  );
}

export function VideoRecommendationSection({ topic }: VideoSectionProps) {
  const [loading, setLoading] = useState(true);
  const [videos3d, setVideos3d] = useState<VideoItem[]>([]);
  const [videos2d, setVideos2d] = useState<VideoItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchVideos() {
      try {
        setLoading(true);
        const res = await fetch(`/api/videos/search?q=${encodeURIComponent(topic)}`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        
        if (isMounted) {
          setVideos3d(data.videos3d || []);
          setVideos2d(data.videos2d || []);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchVideos();
    return () => { isMounted = false; };
  }, [topic]);

  if (error) {
    return (
      <div className="my-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs">
        Failed to load video recommendations: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-8 space-y-6 animate-pulse">
        <div>
          <div className="h-6 w-48 bg-white/10 rounded-md mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl aspect-video w-full" />
            ))}
          </div>
        </div>
        <div>
          <div className="h-6 w-48 bg-white/10 rounded-md mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl aspect-video w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 space-y-8 pointer-events-auto w-full">
      {/* 3D Videos Section */}
      <section>
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          🎥 3D Learning Videos
        </h3>
        {videos3d.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos3d.map((vid) => <VideoCard key={vid.id} video={vid} />)}
          </div>
        ) : (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 italic">
            No high-quality 3D educational videos are available for this topic. Check out the 2D videos below!
          </div>
        )}
      </section>

      {/* 2D Videos Section */}
      <section>
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          📺 2D Learning Videos
        </h3>
        {videos2d.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos2d.map((vid) => <VideoCard key={vid.id} video={vid} />)}
          </div>
        ) : (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 italic">
            No videos found for this topic.
          </div>
        )}
      </section>
    </div>
  );
}
