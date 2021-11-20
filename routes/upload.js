const router = require("express").Router();
const cloudinary = require("cloudinary");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");

//subir imagenes desde cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//subir image
router.post("/subir", (req, res) => {
  try {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json("No files were uploaded");

    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      //1024*1024 = 1mb //1024*1024*5 = 5mb

      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Tamaño muy grande" });
    }

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Formato de archivo incorrecto" });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "test" },
      async (err, result) => {
        if (err) throw err;
        removeTmp(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}) //puedes borrar el auth y authAdmin, los puse al final nomas, bueno eso es para que solo tenga acceso el admin

//delete image
router.post('/eliminar', (req, res) => {
  try {
    const {public_id} = req.body;
    if(!public_id) return res.status(500).json({msg: 'Imagen no seleccionada'})

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if(err) throw err;

      res.json({msg:' Imagen eliminada'})
    })

  } catch (err) {
    return res.status(500).json({msg: err.message})
  }
   
})

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
