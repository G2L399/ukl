const jwt = require(`jsonwebtoken`);
const adminModel = require(`../models/index`).admin;
const secret = `mokleters`;

const authenticate = async (request, response, next) => {
  let dataLogin;
    if (request.body.name && request.body.password) {
      dataLogin = {
        name: request.body.name,
        password: request.body.password,
      };
    } else if (request.body.email && request.body.password) {
      dataLogin = {
        email: request.body.email,
        password: request.body.password,
      };
    }
  /** check data username and password on user's table */
  let dataUser = await adminModel.findOne({ where: dataLogin });

  /** if data user exists */
  if (dataUser) {
    /** set payload for generate token.
     * payload is must be string.
     * dataUser is object, so we must convert to string.
     */
    let payload = JSON.stringify(dataUser);
    // console.log(payload);

    /** generate token */
    let token = jwt.sign(
      { payload },
      secret
      // { expiresIn: "30s" }
    );

    // response.cookie("token", token, {
    //   httpOnly: true,
    //   maxAge: 30 * 1000,
    // });
    next();

    /** define response */
    return response.json({
      success: true,
      logged: true,
      message: `Authentication Success`,
      token: token,
      data: dataUser,
    });
  }

  /** if data user is not exists */
  return response.json({
    success: false,
    logged: false,
    message: `Authentication Failed. Invalid username or password`,
  });
};

const authorize = (request, response, next) => {
  /** get "Authorization" value from request's header */
  const authHeader = request.headers.authorization;

  /** check nullable header */
  if (authHeader) {
    /** when using Bearer Token for authorization,
     * we have to split headers to get token key.
     * values of headers = Bearers tokenKey
     */
    const token = authHeader && authHeader.split(" ")[1];

    try {
      /** verify token using jwt */
      const decodedToken = jwt.verify(token, secret);

      /** Extract payload from decoded token */
      const payload = decodedToken.payload;

      /** Parse payload as JSON */
      const parsedPayload = JSON.parse(payload);

      /** Add isAdmin to request.user */
      request.user = parsedPayload;

      /** if there is no problem, go on to controller */
      return next();
    } catch (error) {
      return response.json({
        success: false,
        auth: false,
        message: `User Unauthorized: ${error.message}`,
      });
    }

    /** verify token using jwt */
    // let verifiedUser = jwt.verify(token, secret);
    // if (!verifiedUser) {
    //   return response.json({
    //     success: false,
    //     auth: false,
    //     message: `User Unauthorized`,
    //   });
    // }

    // request.user = verifiedUser; // payload

    /** if there is no problem, go on to controller */
    next();
  } else {
    return response.json({
      success: false,
      auth: false,
      message: `User Unauthorized`,
    });
  }
};

module.exports = { authenticate, authorize };
