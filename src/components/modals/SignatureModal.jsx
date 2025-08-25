import React, { useRef, useEffect, useState } from "react";

const SignatureModal = ({ show, onClose, onSignatureUpload }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [option, setOption] = useState(""); // 'upload' or 'draw'

  useEffect(() => {
    if (!show) {
      setOption("");
    }
  }, [show]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSignatureUpload(file);
      onClose();
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);

    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const submitCanvas = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const file = new File([blob], "signature.png", { type: "image/png" });
      onSignatureUpload(file);
      onClose();
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Choose Signature Option
        </h3>

        {!option ? (
          <>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              <button
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
                onClick={() => setOption("upload")}
              >
                Upload Image
              </button>
              <button
                className="px-4 py-2 border border-gray-500 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                onClick={() => setOption("draw")}
              >
                Draw Signature
              </button>
            </div>

            <div className="text-sm text-gray-600">
              <p className="text-pink-500 font-medium">
                * Only upload a PNG file without a background
              </p>
              <p>
                If your image has a background, use{" "}
                <a
                  href="https://www.iloveimg.com/remove-background"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  il💙veimg
                </a>{" "}
                to remove it before uploading.
              </p>
              <p className="mt-1">Or use the "Draw Signature" option.</p>
            </div>
          </>
        ) : option === "draw" ? (
          <div className="flex flex-col items-center">
            <p className="text-gray-600 mb-2">Sign in the box below</p>
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="border border-gray-300 rounded-lg mb-3"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
            ></canvas>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                onClick={clearCanvas}
              >
                Clear
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                onClick={submitCanvas}
              >
                Upload
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleUpload}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-600
                hover:file:bg-blue-100"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
