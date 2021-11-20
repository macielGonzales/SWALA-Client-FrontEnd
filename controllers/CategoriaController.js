const categoria = require("../models/Categoria");

const categoriaController = {
  getCategorias: async (req, res) => {
    try {
      const categorias = await categoria.find();
      res.json(categorias);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  createCategoria: async (req, res) => {
    try {
      //si tiene rol = 1 --> admin
      //solo el admin puede crear, eliminar y actualizar categorias
      // res.json('Check admin success')

      const { nombre } = req.body;
      const category = await categoria.findOne({ nombre });
      if (category)
        return res.status(400).json({ msg: "This category already exist" });

      const newCategoria = new categoria({ nombre });

      await newCategoria.save();
      res.json({ msg: "Categoria creada" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteCategoria: async (req, res) => {
    try {
      await categoria.findByIdAndDelete(req.params.id);
      res.json({ msg: "Eliminar una categoria" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateCategoria: async (req, res) => {
    try {
      const {name} = req.body;
      await categoria.findOneAndUpdate({_id: req.params.id}, {name})
      res.json({msg: "Categoria actualizada"})
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoriaController;
