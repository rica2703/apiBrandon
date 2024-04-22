const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Producto=db.Producto;
const Venta=db.venta;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getAllProducts = (req, res) => {
  Producto.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error retrieving products." });
    });
}
exports.createVenta =(req, res) => {
  const venta = new Venta({
    productos:req.body.productos,
    fecha:req.body.fecha,
    total:req.body.total,
    hora:req.body.hora,
    usuario:req.body.usuario,
  });
  venta.save((err, venta) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // res.status(200).send({ message: "Product created successfully!" });
    res.status(200).send({
      productos:venta.productos,
      fecha:venta.fecha,
      total:venta.total,
      hora:venta.hora,
      usuario:venta.usuario,
    });
  });
 
};
exports.getAllVentas = (req, res) => {
  Venta.find()
    .then((ventas) => {
      res.status(200).json(ventas);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error retrieving ventas" });
    });
}

exports.createProduct = (req, res) => {
  const producto = new Producto({
    codigo:req.body.codigo,
    nombre: req.body.nombre,
    precio: req.body.precio,
    cantidad:req.body.cantidad,
  });
  producto.save((err, stock) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // res.status(200).send({ message: "Product created successfully!" });
    res.status(200).send({
      codigo: stock.codigo,
      nombre: stock.nombre,
      precio: stock.precio,
      cantidad: stock.cantidad,
    });
  });
} 

exports.getProductByCode = (req, res) => {
  const codigo = req.params.codigo;

  // Buscar al usuario por su número de cuarto
  Producto.findOne({ codigo:codigo })
    .then(producto => {
      if (!producto) {
        return res.status(404).json({ message: `Producto no encontradp` });
      }
      res.status(200).json(producto);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error al buscar producto', error: err.message });
    });
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Error retrieving users." });
    });
}

exports.deleteUserById = (req, res) => {
  const numCuarto = req.params.numCuarto;

  // Encuentra y elimina al usuario por su número de cuarto
  User.findOneAndDelete({ numCuarto: numCuarto })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: `Usuario con número de cuarto ${numCuarto} no encontrado.` });
      }
      res.status(200).send({ message: "Usuario eliminado correctamente", user });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Error al eliminar usuario por número de cuarto." });
    });
};

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    email: req.body.email,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.send({ message: "Usuario registrado satisfactoriamente!!" });
    }
  });
};

exports.signin = (req, res) => {
  try {
    User.findOne({
      username: req.body.username
    })
      // .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          console.error('Error al buscar usuario:', err);
          return res.status(500).send({ message: "Error interno del servidor." });
        }

        if (!user) {
          return res.status(404).send({ message: "usuario no encontrado." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Contraseña inválida."
          });
        }

        const token = jwt.sign({ id: user.id },
          config.secret,
          {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 horas
          });

        // var authorities = [];

        // for (let i = 0; i < user.roles.length; i++) {
        //   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        // }
        res.status(200).send({
          username: user.username,
          email: user.email,
          accessToken: token
        });
      });
  } catch (error) {
    console.error('Error en el controlador de signin:', error);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};
