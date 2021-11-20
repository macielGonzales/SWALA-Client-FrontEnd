const Producto = require("../models/Producto");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query
    // console.log({ before: queryObj }); //before delete page

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete(queryObj[el]));

    // console.log({ after: queryObj }); //after delete page

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);

    //gte = greater than or equal
    //lte = lesse than or equal
    //lt = lesser than
    //gt = greater than
    //regex = filter by letter

    this.query.find(JSON.parse(queryStr))
    return this;
  }
  sorting() {
    if( this.queryString.sort){
      const sortBy = this.queryString.sort.split(',').join('')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this;
  }
  pagination() {
    const page = this.queryString.page *1 || 1
    const limit = this.queryString.limit *1 || 9
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit)
    return this;
  }
}

const productoController = {
  getProducto: async (req, res) => {
    try {
      console.log(req.query);
      const features = new APIfeatures(Producto.find(), req.query).filtering().sorting().pagination()
      const producto = await features.query;
      res.json({
        status: 'success',
        result: producto.length,
        producto: producto
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  crearProducto: async (req, res) => {
    try {
      const {
        producto_id,
        nombre,
        precio,
        descripcion,
        contenido,
        imagen,
        categoria,
      } = req.body;
      if (!imagen) return res.status(400).json({ msg: " Imagen no subida" });

      const producto = await Producto.findOne({ producto_id });
      if (producto)
        return res.status(400).json({ msg: "Este producto ya existe" });

      const newProducto = new Producto({
        producto_id,
        nombre: nombre.toLowerCase(),
        precio,
        descripcion,
        contenido,
        imagen,
        categoria,
      });

      await newProducto.save();
      res.json({ msg: "Producto creado" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  eliminarProducto: async (req, res) => {
    try {
      await Producto.findByIdAndDelete(req.params.id);
      res.json({ msg: "Producto eliminado" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  actualizarProducto: async (req, res) => {
    try {
      const { nombre, precio, descripcion, contenido, imagen, categoria } =
        req.body;
      if (!imagen) return res.status(400).json({ msg: "Imagen no subida" });
      await Producto.findOneAndUpdate(
        { _id: req.params.id },
        {
          nombre: nombre.toLowerCase(),
          precio,
          descripcion,
          contenido,
          imagen,
          categoria,
        }
      );
      res.json({ msg: "Producto actualizado" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productoController;
