import useDrawingCanvas from "./useDrawingCanvas";
import { CiPen } from "react-icons/ci";

const App = () => {
  const {
    canvasRef,
    fillColor,
    strokeWidth,
    isPenActive,
    togglePen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleFillColorChange,
    handleStrokeWidthChange,
  } = useDrawingCanvas();

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center bg-gray-900">
      <h1 className="text-white text-center mb-2">
        Free Form Path Creation Tool
      </h1>

      <div className="flex items-center justify-between gap-8 w-[90%]">
        <div className="flex-col">
          <button
            className={`py-2 px-4 rounded-md mb-4 text-white ${
              isPenActive ? "bg-blue-500" : "bg-black "
            }`}
            onClick={togglePen}
          >
            <CiPen />
          </button>
          <div className="flex gap-4 p-2">
            <label className="text-white">Stroke Width:</label>
            <input
              className="p-2  bg-gray-700 text-white rounded-md"
              type="number"
              value={strokeWidth}
              onChange={handleStrokeWidthChange}
            />
          </div>
          <div className="mt-10 flex gap-4">
            <label className="text-white">Fill Color:</label>
            <input
              type="color"
              value={fillColor}
              onChange={handleFillColorChange}
            />
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-white rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isPenActive ? "move" : "default" }}
        />
      </div>
    </div>
  );
};

export default App;
