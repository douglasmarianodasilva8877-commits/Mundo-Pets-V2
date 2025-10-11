export default function handler(req, res) {
  // Mock upload endpoint - replace with S3/Supabase storage integration
  res.status(200).json({ url: 'https://placehold.co/600x400' })
}
