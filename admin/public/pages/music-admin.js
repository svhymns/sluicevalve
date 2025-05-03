import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Head from 'next/head'

export default function MusicAdmin() {
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [songs, setSongs] = useState([])
  const [showUploadForm, setShowUploadForm] = useState(false)

  // Add authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
      }
    }
    checkAuth()
  }, [])

  // Fetch songs on component mount
  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching songs:', error)
    } else {
      setSongs(data || [])
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      const audioPath = `songs/${Date.now()}-${audioFile.name}`
      const coverPath = `covers/${Date.now()}-${coverFile.name}`

      const { error: audioError } = await supabase.storage
        .from('songs')
        .upload(audioPath, audioFile)
      if (audioError) throw audioError

      const { error: coverError } = await supabase.storage
        .from('songs')
        .upload(coverPath, coverFile)
      if (coverError) throw coverError

      const { error: dbError } = await supabase
        .from('songs')
        .insert([
          {
            title,
            audio_url: audioPath,
            cover_url: coverPath
          }
        ])
      if (dbError) throw dbError

      setTitle('')
      setAudioFile(null)
      setCoverFile(null)
      setShowUploadForm(false)
      alert('Song uploaded successfully!')
      fetchSongs()
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Head>
        <title>Music Admin - Sluice Valve</title>
      </Head>

      {/* User Profile Section */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-700">U</span>
        </div>
        <h1 className="text-3xl font-bold mt-4">Welcome, Admin</h1>
      </div>

      {/* Upload Song Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Upload Song
        </button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Upload Song</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Song Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Audio File</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                  className="w-full"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Songs List */}
      <div className="space-y-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center gap-4 border rounded-lg shadow-lg p-4 bg-white"
          >
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/songs/${song.cover_url}`}
              alt={song.title}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{song.title}</h3>
              <audio
                id={`song-${song.id}`}
                controls
                className="w-full"
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/songs/${song.audio_url}`}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}