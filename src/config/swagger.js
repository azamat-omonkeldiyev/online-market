const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Market",
      version: "1.0.0",
      description: "ONLINE MARKET for my Node.js application",
    },
    servers: [
      {
        url: "http://localhost:4000", 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }], 
  },
  apis: ["./src/route/*.js"], 
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };
