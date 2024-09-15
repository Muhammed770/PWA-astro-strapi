module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    let { Server } = require("socket.io");
    function sanitizeProduct(product) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        pid: product.pid,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        photos: product.photos[0].formats.medium.url
      }
    }
    let io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      console.log("a user connected");
      strapi.io = io;
      // const interval = setInterval(() => {
      //   socket.emit('server:heartbeat', { message: 'Heartbeat from server', timestamp: new Date() });
      // }, 5000); // emit every 5 seconds
      strapi.db.lifecycles.subscribe((event) => {
        if (event.action === 'afterCreate') {
          // console.log("emit product:create", event);

          const { model } = event;
          if (model.collectionName === 'products') {
            const { result } = event;
            const sanitizedResult = sanitizeProduct(result);
            socket.emit('product:create', sanitizedResult); // Emit event to clients
          }
        }
        if (event.action === 'afterUpdate') {
          // console.log("emit product:update", event);

          const {  model } = event;
          if (model.collectionName === 'products') {
            const { result } = event;
            const sanitizedResult = sanitizeProduct(result);
            socket.emit('product:update', sanitizedResult); // Emit event to clients
          }
        }
        if (event.action === 'afterDelete') {
          // console.log("emit product:delete", event);
          const {  model } = event;
          
          if (model.collectionName === 'products') {
            const { result } = event;
            const sanitizedResult = sanitizeProduct(result);
            socket.emit('product:delete', sanitizedResult); // Emit event to clients
          }
        }
      });
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

  },
};
