import { useState } from "react";
import axios from "axios";
const ImageComp = () => {
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const uploadImages = async () => {
    if (files.length === 0) return alert("Please select files!");
    axios
      .post("http://localhost:3000/api/upload/generate-presigned-urls", {
        files: files.map((file) => ({ name: file.name, type: file.type })),
      })
      .then((res) => {
        console.log(res.data);
        axios
          .put(res.data.urls[0].uploadUrl, files[0], {
            headers: {
              "Content-Type": files[0].type,
            },
          })
          .then((res) => {
            alert("Image uploaded successfully!");
            console.log(res.data);
          });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Upload Multiple Images</h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={uploadImages}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Upload to Cloud
      </button>

      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Uploaded Images:</h3>
          <div className="flex flex-wrap gap-4">
            {uploadedUrls.map((url, index) => (
              <img key={index} src={url} alt="Uploaded" width="200" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageComp;
