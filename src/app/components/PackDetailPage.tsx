import { useParams, Link } from 'react-router';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Pause, Download, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Mock data - in production this would come from an API
const PACK_DATA: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Chromatic Waves',
    artist: 'Sweet T Lo',
    coverImage: 'https://images.unsplash.com/photo-1768936919311-58724077d894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    price: 24,
    description: '120 analog drum hits\nRecorded at Lobster Studio\nProfessional quality WAV files',
    tags: ['Drums', 'Analog', 'Hip-Hop'],
    samples: [
      { id: '1', name: 'kick_01.wav', duration: '0:02' },
      { id: '2', name: 'snare_01.wav', duration: '0:01' },
      { id: '3', name: 'hat_01.wav', duration: '0:01' },
      { id: '4', name: 'clap_01.wav', duration: '0:01' },
      { id: '5', name: 'perc_01.wav', duration: '0:02' },
    ]
  },
  '2': {
    id: '2',
    title: 'Moonrise',
    artist: 'Do and the Jay',
    coverImage: 'https://images.unsplash.com/photo-1616663395403-2e0052b8e595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    price: 18,
    description: 'Ethereal synth textures\n80 unique sounds\nPerfect for ambient and electronic music',
    tags: ['Synth', 'Ambient', 'Electronic'],
    samples: [
      { id: '1', name: 'pad_ethereal.wav', duration: '0:08' },
      { id: '2', name: 'lead_shimmer.wav', duration: '0:04' },
      { id: '3', name: 'bass_sub.wav', duration: '0:05' },
      { id: '4', name: 'fx_rise.wav', duration: '0:03' },
      { id: '5', name: 'pluck_soft.wav', duration: '0:02' },
    ]
  },
};

export function PackDetailPage() {
  const { id } = useParams();
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const pack = PACK_DATA[id || '1'] || PACK_DATA['1'];

  const handlePlayPause = (sampleId: string) => {
    setPlayingId(playingId === sampleId ? null : sampleId);
  };

  const handleBuyPack = () => {
    // In production, this would integrate with Stripe/payment processor
    toast.success('Redirecting to checkout...');
  };

  const handlePreview = () => {
    toast.info('Preview feature coming soon');
  };

  return (
    <div className="flex-1 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to collection
        </Link>

        {/* Pack Header */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 mb-4">
              <img
                src={pack.coverImage}
                alt={pack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {pack.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-medium mb-2">{pack.title}</h1>
              <p className="text-neutral-600">By {pack.artist}</p>
            </div>

            <div className="mb-8">
              <p className="text-neutral-700 whitespace-pre-line">{pack.description}</p>
            </div>

            <div className="mb-8">
              <div className="text-3xl font-medium mb-1">€{pack.price}</div>
              <p className="text-sm text-neutral-500">One-time purchase • Lifetime access</p>
            </div>

            <div className="space-y-3 mt-auto">
              <Button 
                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-base"
                onClick={handleBuyPack}
              >
                Buy Pack
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 text-base"
                onClick={handlePreview}
              >
                <Play className="w-4 h-4 mr-2" />
                Preview Pack
              </Button>
            </div>

            <p className="text-xs text-neutral-500 mt-6">
              Instant download after purchase • No account required
            </p>
          </div>
        </div>

        {/* Sample List */}
        <div>
          <h2 className="text-2xl font-medium mb-6">What's included</h2>
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            {pack.samples.map((sample: any, index: number) => (
              <div
                key={sample.id}
                className={`flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors ${
                  index !== 0 ? 'border-t border-neutral-200' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePlayPause(sample.id)}
                    className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    {playingId === sample.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                  <div>
                    <div className="font-medium text-sm">{sample.name}</div>
                    <div className="text-xs text-neutral-500">{sample.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
