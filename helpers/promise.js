
function createPromise(array_awal, onPrebuild, onResult, onError) {
    let array_save = [];
    Promise.all(array_awal.map(function (rows) {
        let promise = new Promise(function (resolve, reject) {
            //and want to push it to an array
            onPrebuild(rows, res => {
                resolve(res)
            }, rej => {
                reject(rej)
            });
        });
        return promise.then(function (result) {
            array_save.push(result); //ok
        }).catch(error => {
            onError(error);
        });
    })).then(function () {
        // result
        onResult(array_save);
    });
}

const simulateAsyncPause = async (delay) => await new Promise(async resolve => {
    await setTimeout(async () => await resolve(), delay);
});

module.exports = {
    createPromise,
    simulateAsyncPause,
}