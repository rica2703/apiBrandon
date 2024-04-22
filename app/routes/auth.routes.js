const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/authJwt");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      // verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  app.get("/api/auth/users",[authJwt.verifyToken],controller.getAllUsers);
  app.post("/api/auth/signin",controller.signin);
  app.post("/api/auth/crearproducto",[authJwt.verifyToken],controller.createProduct);
  app.get("/api/auth/productos",[authJwt.verifyToken],controller.getAllProducts);
  app.get("/api/auth/productos/:codigo",[authJwt.verifyToken],controller.getProductByCode);
  app.post("/api/auth/crearVenta",[authJwt.verifyToken], controller.createVenta);
  app.get("/api/auth/verVentas",[authJwt.verifyToken],controller.getAllVentas);
  
};
