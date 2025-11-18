# Backend Noga 🎇

Backend service untuk aplikasi analisis nutrisi makanan menggunakan OCR dan AI. Service ini menangani upload gambar label makanan dan koordinasi dengan Python AI service untuk pemrosesan OCR.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL + Prisma ORM
- **File Upload**: Multer
- **Environment**: dotenv

## Instalasi

1. Clone repository dan masuk ke direktori:
```bash
cd Noga-BE
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan:
```
PORT=3000
DATABASE_URL=mysql://user:password@host:port/database
```

4. Setup database:
```bash
npx prisma migrate dev
npx prisma generate
```

## Menjalankan Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### POST /api/image/packaged-food
Upload gambar untuk makanan kemasan berlabel.

**Form Data:**
- `composition`: File gambar komposisi/ingredient
- `nutrition_info`: File gambar informasi nutrisi
- `sessionid`: Session ID (string)

**Response:**
```json
{
  "composition": "http://localhost:3000/uploads/composition/composition-xxx.jpg",
  "nutrition_info": "http://localhost:3000/uploads/nutrition_info/nutrition_info-xxx.jpg",
  "sessionid": "session-123"
}
```

### POST /api/image/prepared-food
Upload gambar untuk makanan siap saji tanpa label.

**Form Data:**
- `foods`: File gambar makanan
- `sessionid`: Session ID (string)

**Response:**
```json
{
  "foods": "http://localhost:3000/uploads/foods/foods-xxx.jpg",
  "sessionid": "session-123"
}
```

## Struktur Database

Table `ocr_table`:
- `sessionid` (String, Primary Key): ID unik untuk setiap sesi
- `status` (String): Status pemrosesan
- `ingredients` (Text): JSON data ingredient
- `nutrition_info` (Text): JSON data informasi nutrisi

## Struktur Project

```
Noga-BE/
├── routes/          # Definisi endpoint API
├── controller/      # Logic handling request
├── function/        # Utility functions
├── prisma/          # Database schema
├── uploads/         # Temporary file storage
├── app.js           # Express configuration
└── bin/www          # Server startup
```

## Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name nama_migrasi

# Open database GUI
npx prisma studio

# Push schema tanpa migration
npx prisma db push
```

## Resources

- Documentasi Endpoint: [Link](https://www.notion.so/Endpoint-Database-1e780ed6311d80b2aa42fc5abcb8a856?pvs=4)
- Task Flow: [Link](https://docs.google.com/spreadsheets/d/1fz-jH1W1kdhUHGFpM4DuTEWs6ZcUTxlQkDsuijqfWp0/edit?gid=0#gid=0&fvid=1000969234)