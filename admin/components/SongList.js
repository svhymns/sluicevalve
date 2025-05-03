import { useEffect, useState } from 'react';
import { supabase } from '/utils/supabaseClient';

export default function SongList() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase.from('songs').select('*');
      if (error) console.error(error);
      else setSongs(data);
    };

    fetchSongs();
  }, []);

  return (
    <div className="grid gap-4">
      {songs.map((song) => (
        <div key={song.id} className="border p-4 rounded flex flex-col">
          <img 
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/songs/${song.cover_url}`} 
            alt={song.title} 
            className="h-32 w-32 object-cover mb-2" 
          />
          <p className="font-bold">{song.title}</p>
          <audio 
            controls 
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/songs/${song.audio_url}`} 
          />
        </div>
      ))}
    </div>
  );
}