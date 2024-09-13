module.exports = ({ env }) => ({

    io: {
        enabled: true,
        config: {
            contentTypes: ['api::product.product'], // Listen for changes in the 'Product' collection
        },
    },

});