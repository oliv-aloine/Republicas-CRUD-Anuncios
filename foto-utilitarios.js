/**
 * Esta função redimensiona a imagem para ela ocupar menos espaço no localStorage
 * https://imagekit.io/blog/how-to-resize-image-in-javascript/
 * https://stackoverflow.com/questions/10333971/html5-pre-resize-images-before-uploading
 * @param {File} pictureFile
 * @returns {Promise<Blob>}
 */
function resizeImage(pictureFile) {
    return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.onload = () => {
            // Calcular scale da imagem
            const MAX_WIDTH = 130; // comprimento maximo em px
            const MAX_HEIGHT = 130; // altura maxima em px

            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width = width * (MAX_HEIGHT / height);
                    height = MAX_HEIGHT;
                }
            }

            // Dynamically create a canvas element
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
            ctx.imageSmoothingEnabled = false;

            // Actual resizing
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                console.debug(`Resize: ${formatBytes(pictureFile.size)} -> ${formatBytes(blob.size)}`);
                console.debug(`Resize: ${img.width}x${img.height} -> ${width}x${height}`);

                resolve(blob);
            }, pictureFile.type);
        };
        img.src = URL.createObjectURL(pictureFile);
    });
}

/**
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
}

function formatBytes(bytes, decimals = 2) {
    if (bytes == 0) {
        return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}