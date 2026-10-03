import { createClient } from '@supabase/supabase-js'

const supabaseUrl = ''
const supabaseKey = ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getData() {
  const { data, error } = await supabase
    .from('Liz')
    .select('id, role, text')
    .order('id', { ascending: false })

  if (error) {
    console.error('Error fetching data:', error)
    return { dataTransfer: [], idData: 0 }
  }

  const dataTransfer = data.map((item) => ({
    role: item.role === 'assistant' ? 'model' : item.role,
    parts: [
      {
        text: item.text
      }
    ]
  }))

  const idData = data.length > 0 ? data[0].id : 0

  return { dataTransfer, idData }
}

export async function postData(id, role, text) {
  let targetId = id

  // Jika ID kosong, ambil ID terakhir + 1
  if (!targetId) {
    const { idData } = await getData()
    targetId = idData + 1
  }

  const { data, error } = await supabase
    .from('Liz')
    .insert([
      {
        id: targetId,
        role: role,
        text: text
      }
    ])

  if (error) {
    console.error('Error inserting data:', error)
    throw error
  }

  return data
}
