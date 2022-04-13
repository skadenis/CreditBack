module.exports = async function asyncForEach(array, callback) {
    for (let index = 0b0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};