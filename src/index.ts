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
          <a href="/survey/admin">Admin</a>
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

// API endpoint to get survey data
app.get('/api/survey', (req, res) => {
  res.json(mockSurvey)
})

// API endpoint to update survey
app.post('/api/survey/update', (req, res) => {
  const { judul_survey, pertanyaan } = req.body
  
  if (judul_survey) mockSurvey.judul_survey = judul_survey
  if (pertanyaan) mockSurvey.pertanyaan = pertanyaan
  
  res.json({ success: true, data: mockSurvey })
})

// Admin page to customize survey
app.get('/survey/admin', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Survey Admin</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
            background: #fafafa;
            color: #1a1a1a;
            line-height: 1.6;
            padding: 2rem 1rem;
          }
          nav {
            max-width: 1000px;
            margin: 0 auto 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e0e0e0;
          }
          nav a {
            margin-right: 1rem;
            color: #666;
            text-decoration: none;
          }
          nav a:hover {
            color: black;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e0e0e0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .header {
            padding: 2rem;
            border-bottom: 1px solid #e0e0e0;
          }
          .header h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: black;
            margin-bottom: 0.5rem;
          }
          .header p {
            font-size: 0.875rem;
            color: #666;
          }
          .form-content {
            padding: 2rem;
          }
          .form-group {
            margin-bottom: 2rem;
          }
          .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #333;
            margin-bottom: 0.5rem;
          }
          .form-input {
            width: 100%;
            border: 1px solid #d0d0d0;
            padding: 0.75rem;
            font-size: 0.9375rem;
            color: #1a1a1a;
            transition: border-color 0.2s;
            border-radius: 2px;
          }
          .form-input:focus {
            outline: none;
            border-color: black;
            box-shadow: 0 0 0 1px black;
          }
          .questions-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .question-card {
            border: 1px solid #e0e0e0;
            padding: 1rem;
            background: #fafafa;
            border-radius: 2px;
          }
          .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
          }
          .question-number {
            font-size: 0.75rem;
            font-weight: 600;
            color: #999;
          }
          .btn-remove {
            padding: 0.25rem 0.75rem;
            background: white;
            border: 1px solid #d0d0d0;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 2px;
          }
          .btn-remove:hover {
            background: #f5f5f5;
            border-color: #999;
          }
          .btn {
            padding: 0.75rem 1.5rem;
            background: black;
            color: white;
            border: none;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            border-radius: 2px;
            margin-right: 0.5rem;
          }
          .btn:hover {
            background: #333;
          }
          .btn-secondary {
            background: white;
            color: black;
            border: 1px solid #d0d0d0;
          }
          .btn-secondary:hover {
            background: #f5f5f5;
          }
          .success-message {
            padding: 1rem;
            background: #f0f0f0;
            border: 1px solid #d0d0d0;
            margin-bottom: 1rem;
            display: none;
            border-radius: 2px;
          }
          .success-message.show {
            display: block;
          }
        </style>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/survey">Survey</a>
          <a href="/survey/admin">Admin</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        
        <div class="container">
          <div class="header">
            <h1>Survey Admin Panel</h1>
            <p>Customize survey title and questions</p>
          </div>
          
          <div class="form-content">
            <div id="successMessage" class="success-message"></div>
            
            <form id="surveyForm">
              <div class="form-group">
                <label class="form-label">Survey Title</label>
                <input 
                  type="text" 
                  id="surveyTitle"
                  class="form-input"
                  placeholder="Enter survey title..."
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Questions</label>
                <div id="questionsList" class="questions-list"></div>
              </div>
              
              <div style="display: flex; gap: 0.5rem;">
                <button type="button" onclick="addQuestion()" class="btn btn-secondary">
                  Add Question
                </button>
                <button type="submit" class="btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <script>
          let surveyData = null;
          
          async function loadSurvey() {
            const response = await fetch('/api/survey');
            surveyData = await response.json();
            
            document.getElementById('surveyTitle').value = surveyData.judul_survey;
            renderQuestions();
          }
          
          function renderQuestions() {
            const container = document.getElementById('questionsList');
            container.innerHTML = surveyData.pertanyaan.map((q, idx) => \`
              <div class="question-card">
                <div class="question-header">
                  <span class="question-number">Question \${idx + 1}</span>
                  <button type="button" onclick="removeQuestion(\${idx})" class="btn-remove">Remove</button>
                </div>
                <input 
                  type="text" 
                  class="form-input"
                  value="\${q.teks_pertanyaan}"
                  onchange="updateQuestion(\${idx}, this.value)"
                  placeholder="Enter question text..."
                />
              </div>
            \`).join('');
          }
          
          function addQuestion() {
            const newId = surveyData.pertanyaan.length > 0 
              ? Math.max(...surveyData.pertanyaan.map(q => q.id_pertanyaan)) + 1 
              : 1;
            
            surveyData.pertanyaan.push({
              id_pertanyaan: newId,
              no_urut: surveyData.pertanyaan.length + 1,
              teks_pertanyaan: ''
            });
            
            renderQuestions();
          }
          
          function removeQuestion(index) {
            surveyData.pertanyaan.splice(index, 1);
            surveyData.pertanyaan.forEach((q, idx) => {
              q.no_urut = idx + 1;
            });
            renderQuestions();
          }
          
          function updateQuestion(index, value) {
            surveyData.pertanyaan[index].teks_pertanyaan = value;
          }
          
          document.getElementById('surveyForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('surveyTitle').value;
            
            const response = await fetch('/api/survey/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                judul_survey: title,
                pertanyaan: surveyData.pertanyaan
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              const msg = document.getElementById('successMessage');
              msg.textContent = 'Survey updated successfully!';
              msg.classList.add('show');
              
              setTimeout(() => {
                msg.classList.remove('show');
              }, 3000);
            }
          });
          
          loadSurvey();
        </script>
      </body>
    </html>
  `)
})

// Survey form route
app.get('/survey', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Survey Form</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
            background: #fafafa;
            color: #1a1a1a;
            line-height: 1.6;
            padding: 3rem 1rem;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e0e0e0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .header {
            padding: 2rem;
            border-bottom: 1px solid #e0e0e0;
          }
          .header h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: black;
            margin-bottom: 0.5rem;
          }
          .header p {
            font-size: 0.875rem;
            color: #666;
          }
          .form-content {
            padding: 2rem;
          }
          .section {
            margin-bottom: 2rem;
          }
          .section-title {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #999;
            margin-bottom: 1.5rem;
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #333;
          }
          .form-input {
            border: none;
            border-bottom: 1px solid #d0d0d0;
            padding: 0.5rem 0;
            font-size: 0.9375rem;
            color: #1a1a1a;
            background: transparent;
            transition: border-color 0.2s;
          }
          .form-input:focus {
            outline: none;
            border-bottom-color: black;
          }
          .divider {
            height: 1px;
            background: #f0f0f0;
            margin: 2rem 0;
          }
          .questions-section {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .question-item {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .question-label {
            font-size: 1rem;
            font-weight: 500;
            color: #1a1a1a;
          }
          .question-number {
            color: #999;
            margin-right: 0.5rem;
          }
          .answer-textarea {
            border: 1px solid #d0d0d0;
            padding: 0.75rem;
            font-size: 0.875rem;
            font-family: inherit;
            color: #1a1a1a;
            resize: vertical;
            transition: border-color 0.2s;
            border-radius: 2px;
          }
          .answer-textarea:focus {
            outline: none;
            border-color: black;
            box-shadow: 0 0 0 1px black;
          }
          .submit-section {
            padding-top: 1rem;
          }
          .submit-button {
            padding: 0.75rem 2rem;
            background: black;
            color: white;
            border: none;
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.025em;
            cursor: pointer;
            transition: background 0.2s;
            border-radius: 2px;
          }
          .submit-button:hover {
            background: #333;
          }
          .submit-button:focus {
            outline: 2px solid black;
            outline-offset: 2px;
          }
          .footer {
            text-align: center;
            margin-top: 2rem;
            font-size: 0.75rem;
            color: #999;
          }
          .loading {
            text-align: center;
            padding: 3rem;
            color: #999;
          }
          @media (max-width: 640px) {
            body {
              padding: 1rem;
            }
            .form-row {
              grid-template-columns: 1fr;
            }
            .header {
              padding: 1.5rem;
            }
            .form-content {
              padding: 1.5rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div id="loadingState" class="loading">Loading survey...</div>
          <div id="surveyContent" style="display: none;">
            <div class="header">
              <h1 id="surveyTitle">Form Survey Layanan</h1>
              <p>Mohon isi data diri dan jawaban Anda dengan lengkap.</p>
            </div>
            
            <form id="surveyForm" class="form-content">
              <div class="section">
                <div class="section-title">Data Responden</div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="nama" 
                      class="form-input"
                      placeholder="Isi nama anda..."
                      required 
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Tanggal</label>
                    <input 
                      type="date" 
                      name="tanggal" 
                      class="form-input"
                      required 
                    />
                  </div>
                </div>
              </div>

              <div class="divider"></div>

              <div class="section">
                <div class="section-title">Daftar Pertanyaan</div>
                <div id="questionsContainer" class="questions-section"></div>
              </div>

              <div class="submit-section">
                <button type="submit" class="submit-button">
                  Kirim Jawaban
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div class="footer">
          &copy; 2024 Survey System. Simple & Secure.
        </div>
        
        <script>
          let surveyData = null;
          
          async function loadSurvey() {
            try {
              const response = await fetch('/api/survey');
              surveyData = await response.json();
              
              document.getElementById('surveyTitle').textContent = surveyData.judul_survey;
              
              const questionsHTML = surveyData.pertanyaan.map(q => \`
                <div class="question-item">
                  <label class="question-label">
                    <span class="question-number">\${q.no_urut}.</span>
                    \${q.teks_pertanyaan}
                  </label>
                  <textarea
                    name="jawaban_\${q.id_pertanyaan}"
                    rows="3"
                    required
                    class="answer-textarea"
                    placeholder="Tulis jawaban anda disini..."
                  ></textarea>
                </div>
              \`).join('');
              
              document.getElementById('questionsContainer').innerHTML = questionsHTML;
              document.querySelector('input[name="tanggal"]').value = new Date().toISOString().split('T')[0];
              
              document.getElementById('loadingState').style.display = 'none';
              document.getElementById('surveyContent').style.display = 'block';
            } catch (error) {
              console.error('Error loading survey:', error);
              document.getElementById('loadingState').textContent = 'Error loading survey. Please refresh the page.';
            }
          }
          
          document.getElementById('surveyForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            const trx_respon = {
              nama_responden: data.nama,
              tgl_respon: data.tanggal,
              id_survey: surveyData.id_survey
            };
            
            const trx_jawaban = surveyData.pertanyaan.map(q => ({
              id_pertanyaan: q.id_pertanyaan,
              jawaban_teks: data[\`jawaban_\${q.id_pertanyaan}\`] || ''
            }));
            
            const response = await fetch('/survey/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ trx_respon, trx_jawaban })
            });
            
            if (response.ok) {
              window.location.href = '/survey/success?nama=' + encodeURIComponent(data.nama);
            }
          });
          
          loadSurvey();
        </script>
      </body>
    </html>
  `)
})

// Handle survey submission
app.post('/survey/submit', (req, res) => {
  const { trx_respon, trx_jawaban } = req.body
  
  console.log('trx_respon:', trx_respon)
  console.log('trx_jawaban:', trx_jawaban)
  
  res.json({ success: true })
})

// Success page
app.get('/survey/success', (req, res) => {
  const nama = req.query.nama || 'Responden'
  
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Submission Successful</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
            background: #fafafa;
            color: #1a1a1a;
            line-height: 1.6;
            padding: 3rem 1rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            max-width: 600px;
            width: 100%;
            background: white;
            border: 1px solid #e0e0e0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            padding: 3rem 2rem;
            text-align: center;
          }
          h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          p {
            color: #666;
            margin-bottom: 2rem;
          }
          .button {
            display: inline-block;
            padding: 0.75rem 2rem;
            background: black;
            color: white;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.025em;
            transition: background 0.2s;
            border-radius: 2px;
          }
          .button:hover {
            background: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Terima kasih, ${nama}</h2>
          <p>Survey Anda telah berhasil disimpan.</p>
          <a href="/survey" class="button">Isi Survey Lagi</a>
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