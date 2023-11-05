import { storage } from "../utilities/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Compress from 'compress.js';

const UploadOneImage = async (imageBlob, blobCategory, theUserID) => {
    if (!imageBlob || !blobCategory || !theUserID) return null;

    try {
        const compress = new Compress();
        const resizedImage = await compress.compress([imageBlob], {
            size: 2, // the max size in MB, defaults to 2MB
            quality: .75, // the quality of the image, max is 1
            maxWidth: 600, // the max width of the output image, defaults to 1920px
            maxHeight: 800, // the max height of the output image, defaults to 1920px
            resize: true // defaults to true, set false if you do not want to resize the image width and height
        });
        
        const img = resizedImage[0];
        const base64str = img.data;
        const imgExt = img.ext;
        const resizedFile = Compress.convertBase64ToFile(base64str, imgExt);
        
        const storageRef = ref(storage, `/images/${theUserID}/${blobCategory}/${Date.now()}_${imageBlob.name}`);
        const snapshot = await uploadBytes(storageRef, resizedFile);
        const URL = await getDownloadURL(snapshot.ref);
        
        return URL;
    } catch (error) {
        console.error("There was an error uploading the image: ", error);
        return null;
    }
};

export default UploadOneImage;
