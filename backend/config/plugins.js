module.exports = ({ env }) => ({
    // ...
    io: {
        enabled: true,
        config: {
            contentTypes: [
                { uid: 'api::product.product', actions: ['create', 'update', 'delete'] }
            ],
            events: [
                {
                    name: 'connection',
                    handler({ strapi }, socket) {
                        strapi.log.info(`[io] a new client with id ${socket.id} has connected`);
                    },
                },
            ],
        },
    },
    // ...
});