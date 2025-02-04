import { useState } from "react";
import axios from "axios";

const ImageComp = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const uploadImages = async () => {
    if (files.length === 0) return alert("Please select files!");
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:3000/api/upload/generate-presigned-urls", {
        files: files.map((file) => ({ name: file.name, type: file.type })),
      });

      // Upload all images to S3 in parallel
      const uploadPromises = data.urls.map((urlObj, index) =>
        axios.put(urlObj.uploadUrl, files[index], {
          headers: { "Content-Type": files[index].type },
        })
      );

      await Promise.all(uploadPromises);

      // Store all uploaded files info without replacing previous data
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...data.urls.map((urlObj, index) => ({
          sno: prevFiles.length + index + 1, // Maintain serial numbers correctly
          name: files[index].name,
          url: urlObj.fileUrl,
        })),
      ]);

      // alert("All images uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Error uploading images!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) return alert("Upload images first!");

    try {
      const response = await axios.post("http://localhost:3000/api/process-doc", {
        images: uploadedFiles, // Send all uploaded images
      });

      alert("Document created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error processing document!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload Multiple Images</h2>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        <button
          onClick={uploadImages}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mb-4"
        >
          {loading ? "Uploading..." : "Upload to Cloud"}
        </button>

        {uploadedFiles.length > 0 && (
          <>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Uploaded Images:</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">S.No</th>
                    <th className="border p-2">Image Name</th>
                    <th className="border p-2">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{file.sno}</td>
                      <td className="border p-2">{file.name}</td>
                      <td className="border p-2">
                        <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded-md" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md w-full"
            >
              Submit & Generate Document
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageComp;
