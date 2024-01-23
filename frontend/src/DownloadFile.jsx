import React from "react";

const CloudinaryPDFDownload = () => {
  const handleDownload = async () => {
    // Replace 'your-cloudinary-pdf-url' with the correct direct URL of your Cloudinary PDF file
    const cloudinaryPdfUrl =
      "https://res.cloudinary.com/djeb94ndn/raw/authenticated/s--NzEsXBQf--/v1705509192/pdf-templates/1705509172216-289914389.pdf";

    try {
      const response = await fetch(cloudinaryPdfUrl);
      const blob = await response.blob();

      // Create a link element
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      // Specify the download attribute along with the filename
      link.download = "your-download-filename.pdf";

      // Append the link to the document
      document.body.appendChild(link);

      // Trigger a click event on the link to start the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div>
      {/* Create a button to trigger the download */}
      <button onClick={handleDownload}>Download PDF from Cloudinary</button>
    </div>
  );
};

export default CloudinaryPDFDownload;
