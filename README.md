# 🎙️ DubMaster AI – AI-Powered Media Processing Backend

DubMaster AI is a backend system built with Node.js and Express.js to support smart media processing features using AI, including:

- Text-to-Speech Conversion (English & Arabic)  
- Automatic Video Subtitling  
- AI-based Video Dubbing  
- Full-featured User Management & Authentication

This project aims to simplify and automate working with media content through intelligent services that can be integrated easily into any frontend interface or platform.

---

## 🚀 Key Features

- Secure user authentication using JWT and OTP  
- Email verification & password reset  
- Text-to-speech generation in multiple languages  
- Video upload and automatic processing for subtitles and dubbing  
- Cloudinary integration for managing media files  
- Clean, scalable modular codebase  
- Input validation and centralized error handling

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express.js  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT, bcrypt  
- **Media Handling:** Multer, Cloudinary  
- **Emailing:** Nodemailer (via Gmail SMTP)  
- **HTTP Requests:** Axios  
- **Validation:** Joi  

---

## 📡 Main API Endpoints

### 🔐 User Management
- `POST /user/signup` – Register a new user  
- `POST /user/login` – Login and receive a JWT  
- `GET /user/verifyEmail/:token` – Verify email address  
- `POST /user/forgot-password` – Start password reset process  
- `POST /user/verify-otp` – Verify OTP code  
- `POST /user/change-password` – Change account password  
- `GET /user/getuser` – Get user profile info  
- `PATCH /user/updateuser` – Update user profile  
- `DELETE /user/deleteuser` – Delete user account  

### 🗣️ Text-to-Speech
- `POST /speech/text-to-speech-en` – Convert English text to speech  
- `POST /speech/text-to-speech-ar` – Convert Arabic text to speech  
- `GET /speech/text-to-speech` – Retrieve all generated speech files  
- `PATCH /speech/text-to-speech/:id` – Rename speech file  
- `DELETE /speech/text-to-speech/:id` – Delete speech file  

### 🎬 Video Subtitling
- `POST /subtitle/video-subtitle` – Generate subtitles for a video  
- `GET /subtitle/video-subtitle` – Get all subtitled videos  
- `PATCH /subtitle/video-subtitle/:id` – Rename subtitle video  
- `DELETE /subtitle/video-subtitle/:id` – Delete subtitle video  

### 🎤 Video Dubbing
- `POST /dubbing/video-dubbing` – Generate dubbed video  
- `GET /dubbing/video-dubbing` – Get all dubbed videos  
- `PATCH /dubbing/video-dubbing/:id` – Rename dubbed video  
- `DELETE /dubbing/video-dubbing/:id` – Delete dubbed video  

---

## ⚙️ Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/dubmaster-ai-backend.git
cd dubmaster-ai-backend

# Install dependencies
npm install

# Create your environment config
touch .env

# Start the server
npm start
📜 License

This project is for educational and non-commercial use only.


---

🙋‍♂️ Author

Osama Samy
