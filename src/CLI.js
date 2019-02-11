const CLI = {
    askFor(params) {

    },

    async question(text) {
        return new Promise((resolve, reject) => {
            process.stdin.on('data', text => {

            });
        });
    }
};


module.exports = CLI;
