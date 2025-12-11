import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

// Mock data - replace with actual database queries
const mockSurvey = {
  id_survey: 1,
  judul_survey: 'Survey Kepuasan Pelanggan',
  pertanyaan: [
    { id_pertanyaan: 1, no_urut: 1, teks_pertanyaan: 'Bagaimana pendapat Anda tentang layanan kami?' },
    { id_pertanyaan: 2, no_urut: 2, teks_pertanyaan: 'Apa yang perlu kami tingkatkan?' },
    { id_pertanyaan: 3, no_urut: 3, teks_pertanyaan: 'Apakah Anda akan merekomendasikan kami?' }
  ]
}

// Home route
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/survey">Survey</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// Survey form route
app.get('/survey', (req, res) => {
  const pertanyaanHTML = mockSurvey.pertanyaan
    .map(p => `
      <div class="question-block">
        <label>Pertanyaan ${p.no_urut}:</label>
        <p>${p.teks_pertanyaan}</p>
        <label>Jawaban:</label>
        <textarea name="jawaban_${p.id_pertanyaan}" rows="4" required></textarea>
      </div>
    `).join('')

  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Survey Form</title>
        <link rel="stylesheet" href="/style.css" />
        <style>
          .survey-container {
            max-width: 600px;
            margin: 0 auto;
          }
          .form-group {
            margin-bottom: 1.5rem;
          }
          .question-block {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #ddd;
          }
          .question-block:last-child {
            border-bottom: none;
          }
          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
          input[type="text"],
          input[type="date"],
          textarea {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }
          textarea {
            resize: vertical;
          }
          button {
            padding: 0.75rem 2rem;
            background: #000;
            color: #fff;
            border: none;
            cursor: pointer;
          }
          button:hover {
            background: #333;
          }
          .success-message {
            padding: 1rem;
            background: #f0f0f0;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/survey">Survey</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <div class="survey-container">
          <h1>${mockSurvey.judul_survey}</h1>
          <form method="POST" action="/survey/submit">
            <div class="form-group">
              <label>Nama:</label>
              <input type="text" name="nama" required />
            </div>
            <div class="form-group">
              <label>Tanggal:</label>
              <input type="date" name="tanggal" value="${new Date().toISOString().split('T')[0]}" required />
            </div>
            ${pertanyaanHTML}
            <button type="submit">Submit</button>
          </form>
        </div>
      </body>
    </html>
  `)
})

// Handle survey submission
app.post('/survey/submit', (req, res) => {
  const { nama, tanggal, ...jawaban } = req.body
  
  // In production, you would:
  // 1. INSERT INTO trx_respon (nama_responden, tgl_respon, id_survey)
  // 2. Get the new id_respon
  // 3. For each jawaban_*, INSERT INTO trx_jawaban (id_respon, id_pertanyaan, jawaban_teks)
  
  console.log('Response received:')
  console.log('Nama:', nama)
  console.log('Tanggal:', tanggal)
  console.log('Jawaban:', jawaban)
  
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Survey Submitted</title>
        <link rel="stylesheet" href="/style.css" />
        <style>
          .success-container {
            max-width: 600px;
            margin: 2rem auto;
            text-align: center;
          }
          .success-message {
            padding: 2rem;
            background: #f0f0f0;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/survey">Survey</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <div class="success-container">
          <div class="success-message">
            <h2>Terima kasih, ${nama}</h2>
            <p>Survey Anda telah berhasil disimpan.</p>
          </div>
          <a href="/survey">Isi Survey Lagi</a>
        </div>
      </body>
    </html>
  `)
})

// Example API endpoint
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app