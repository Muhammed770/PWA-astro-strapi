module.exports = ({ env }) => ({

    io: {
        enabled: true,
        config: {
            // This will listen for all supported events on the article content type
            contentTypes: ['api::article.article'],
        },
    },

});