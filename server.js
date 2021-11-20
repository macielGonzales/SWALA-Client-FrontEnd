require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')


//5:29:00
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

//Routes
app.use('/usuario', require('./routes/UsuarioRouter'))
app.use('/api', require('./routes/CategoriaRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/ProductoRouter'))
// app.use('/api', require('./routes/PagoRouter'))



//Connet to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to MongoDB')
})

app.get('/',(req, res) => {
    res.json({msg: "hola bb"})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port',PORT)
})