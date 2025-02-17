import multer from 'multer'

// Multer configuration
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export { 
    upload 
}