import { useState } from "react";
import imageCompression from "browser-image-compression";
import useShowToast from "./useShowToast";

// const usePreviewImg = () => {
//   const [imgUrl, setImgUrl] = useState(null);
//   const showToast = useShowToast();
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setImgUrl(reader.result);
//       };

//       reader.readAsDataURL(file);
//     } else {
//       showToast("Invalid file type", " Please select an image file", "error");
//       setImgUrl(null);
//     }
//   };
//   return { handleImageChange, imgUrl, setImgUrl };
// };

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        // Compress the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 800, // Maximum width or height
          useWebWorker: true, // Use web worker for faster compression
        });

        // Convert the compressed image to a Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgUrl(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        showToast("Compression error", "Failed to compress image", "error");
        setImgUrl(null);
      }
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
    }
  };

  return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
