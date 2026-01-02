const ImageKit = require('imagekit');

let imagekit;

function getImageKit() {
    if (!imagekit) {
        imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
    }
    return imagekit;
}

async function uploadFile(file, fileName) {
    const ik = getImageKit();

    const result = await ik.upload({
        file,
        fileName,
    });

    return result;
}

module.exports = {
    uploadFile
};
