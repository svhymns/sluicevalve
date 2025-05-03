import { v4 as uuidv4 } from 'uuid'

export async function uploadSongToStorage(file, supabase) {
  // Generate a unique filename using UUID
  const fileExt = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from('songs')
    .upload(filePath, file)

  if (error) throw error
  return data.path
}

export async function uploadImageToStorage(file, supabase) {
  const fileExt = file.name.split('.').pop()
  const fileName = `cover-${uuidv4()}.${fileExt}`
  const filePath = `covers/${fileName}`

  const { data, error } = await supabase.storage
    .from('songs')
    .upload(filePath, file)

  if (error) throw error
  return data.path
}