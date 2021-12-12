var { unlink } = require("fs/promises");

const handleDeleteFile = async (path) => {
    let originPath = `public/${path}`;
    console.log(originPath);
    try {
        await unlink(originPath);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

module.exports = {
    handleDeleteFile
}