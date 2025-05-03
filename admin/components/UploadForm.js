import { useState } from 'react';
import { supabase } from '/utils/supabaseClient'; // your Supabase setup

export default function UploadForm() {
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!songFile || !coverFile || !title) return alert('Fill out all fields');

    // Upload song
    const { data: songData, error: songError } = await supabase.storage
      .from('songs')
      .upload(`audio/${songFile.name}`, songFile);

    // Upload cover
    const { data: coverData, error: coverError } = await supabase.storage
      .from('songs')
      .upload(`covers/${coverFile.name}`, coverFile);

    if (songError || coverError) {
      console.error(songError || coverError);
      alert('Error uploading files');
      return;
    }

    // Save song record in database
    const { error: dbError } = await supabase
      .from('songs')
      .insert([
        {
          title,
          audio_url: songData.path,
          cover_url: coverData.path,
        },
      ]);

    if (dbError) {
      console.error(dbError);
      alert('Error saving song record');
    } else {
      alert('Uploaded successfully!');
      setSongFile(null);
      setCoverFile(null);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col space-y-4 mb-6">
      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setSongFile(e.target.files[0])}
        className="border p-2 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverFile(e.target.files[0])}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Upload Song
      </button>
    </form>
  );
}
