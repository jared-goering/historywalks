"use client";

export default function WebGLError() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">WebGL2 Not Supported</h1>
        <p className="text-gray-300">
          Your browser or device does not support WebGL2, which is required to
          render Gaussian splats. Please try a modern browser like Chrome, Edge,
          or Safari on a device with GPU support.
        </p>
      </div>
    </div>
  );
}
