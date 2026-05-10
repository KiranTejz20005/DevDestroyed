"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import { ArrowLeft, Flame } from 'lucide-react';
import Image from 'next/image';
import config from '../../config.json';

export default function HallOfShame() {
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRoasts = async () => {
      try {
        const res = await fetch(`${config.url}/api/roast/history/recent`);
        const json = await res.json();
        if (json.success) {
          setRoasts(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoasts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans overflow-hidden">
      <Background />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-24 sm:py-32 relative z-10 flex flex-col items-center">
        <button
          onClick={() => router.push('/')}
          className="absolute top-8 left-8 flex items-center text-gray-400 hover:text-gray-900 transition-colors font-mono text-xs uppercase tracking-widest bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm"
        >
          <ArrowLeft className="w-3 h-3 mr-2" />
          Back to Safety
        </button>

        <div className="text-center w-full mb-16">
          <h1 className="font-space text-5xl sm:text-7xl font-bold tracking-tighter text-gray-900 mb-6 flex items-center justify-center gap-4">
            <Flame className="w-12 h-12 text-orange-500" />
            Hall of Shame
            <Flame className="w-12 h-12 text-orange-500" />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-mono">
            A public graveyard of roasted developers. Proceed with caution.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {roasts.map((r, i) => (
              <div 
                key={i} 
                onClick={() => router.push(`/roast?user=${encodeURIComponent(r.username)}`)}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {r.avatar ? (
                      <Image src={r.avatar} alt={r.username} width={48} height={48} className="rounded-full ring-2 ring-gray-100" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold">
                        {r.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 font-space text-lg">@{r.username}</h3>
                      <p className="text-xs text-gray-400 font-mono">
                        {new Date(r.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold font-mono group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    View Roast
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100/50">
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed italic">
                    "{r.roast}"
                  </p>
                </div>
              </div>
            ))}
            
            {roasts.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-gray-500 font-mono">
                No souls have been roasted yet. Be the first.
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
