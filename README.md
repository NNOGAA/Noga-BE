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

4. Buat database MySQL:

**PENTING**: Database MySQL harus dibuat manual terlebih dahulu. Prisma hanya auto-create tables, bukan database.

```sql
-- Login ke MySQL
mysql -u root -p

-- Buat database
CREATE DATABASE nama_database;
```

5. Setup akan otomatis saat pertama kali run (skip ke step Menjalankan Server)

## Menjalankan Server

### Development (Auto-setup tables)

Otomatis generate Prisma client dan sync schema ke database, lalu start server:

```bash
npm run dev
```

### Production

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

**Catatan**: Saat pertama kali `npm install`, Prisma client akan otomatis ter-generate (postinstall hook)

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

## Docker

### Build Docker Image

```bash
docker build -t noga-backend .
```

### Run Docker Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://user:password@host:port/database" \
  -e PORT=3000 \
  noga-backend
```

### Docker Compose (Optional)

Buat file `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - PORT=3000
    volumes:
      - ./uploads:/app/uploads
```

Run dengan:

```bash
docker-compose up
```

## Deploy ke Railway

### Setup Database MySQL di Railway

1. Buka [Railway](https://railway.app) dan login

2. Klik "New Project" → pilih "Provision MySQL"

3. Setelah MySQL service dibuat, klik service tersebut

4. Buka tab "Variables" → copy nilai `DATABASE_URL`

   Contoh format:
   ```
   mysql://root:RKgrphVeECnkSZVEopgoeMmbKNKSAkSB@maglev.proxy.rlwy.net:20862/railway
   ```

### Deploy Backend

1. Push code ke GitHub repository

2. Di Railway project yang sama, klik "New" → "GitHub Repo"

3. Pilih repository Noga-BE dan connect

4. Tambahkan Environment Variables:
   - `DATABASE_URL`: Paste connection string dari MySQL service
   - `PORT`: Railway akan auto-set (tidak perlu diisi manual)

5. Railway akan otomatis detect Dockerfile dan deploy

6. Setelah deploy selesai, klik service → tab "Settings" → "Generate Domain" untuk mendapatkan public URL

### Tips Railway:

- Railway otomatis detect Dockerfile
- Bisa pakai Railway MySQL add-on atau external MySQL
- Environment variables diset di Settings → Variables
- Auto-deploy setiap push ke branch main/master
- Check logs di dashboard jika ada error

## Resources

- Dokumentasi Endpoint: [Link](https://www.notion.so/Endpoint-Database-1e780ed6311d80b2aa42fc5abcb8a856?pvs=4)
- Task Flow: [Link](https://docs.google.com/spreadsheets/d/1fz-jH1W1kdhUHGFpM4DuTEWs6ZcUTxlQkDsuijqfWp0/edit?gid=0#gid=0&fvid=1000969234)
