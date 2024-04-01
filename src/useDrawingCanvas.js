import { useRef, useEffect, useState, useCallback } from "react";

const useDrawingCanvas = () => {
  const [points, setPoints] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [fillColor, setFillColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isPenActive, setIsPenActive] = useState(false);
  const canvasRef = useRef(null);

  const activatePen = useCallback(() => {
    setIsPenActive(true);
  }, []);

  const togglePen = () => {
    setIsPenActive((prevIsPenActive) => !prevIsPenActive);
  };

  const handleMouseDown = (event) => {
    if (!isPenActive) return;
    const canvas = canvasRef.current;
    const { left, top } = canvas.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    setPoints([...points, { x, y }]);
  };

  const handleMouseMove = (event) => {
    if (!isPenActive) return;
    if (points.length > 0) {
      const canvas = canvasRef.current;
      const { left, top } = canvas.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      setPreviewPoint({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (!isPenActive) return;
    if (previewPoint && points.length > 0) {
      if (
        Math.abs(points[0].x - previewPoint.x) < 5 &&
        Math.abs(points[0].y - previewPoint.y) < 5
      ) {
        setShapes([...shapes, points]);
        setPoints([]);
      } else {
        setPoints([...points, previewPoint]);
      }
    }
    setPreviewPoint(null);
  };

  const handleMouseLeave = () => {
    if (!isPenActive) return;
    setPreviewPoint(null);
  };

  const handleFillColorChange = (event) => {
    setFillColor(event.target.value);
  };

  const handleStrokeWidthChange = (event) => {
    const width = parseInt(event.target.value);
    setStrokeWidth(width);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "p" || event.key === "P") {
        activatePen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activatePen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shapePoints) => {
      context.beginPath();
      context.moveTo(shapePoints[0].x, shapePoints[0].y);
      shapePoints.forEach((point, index) => {
        if (index > 0) {
          context.lineTo(point.x, point.y);
        }
      });
      context.closePath();
      context.fillStyle = fillColor;
      context.fill();
      context.lineWidth = strokeWidth;
      context.strokeStyle = "#000";
      context.stroke();
    });

    if (points.length > 0) {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      points.forEach((point, index) => {
        if (index > 0) {
          context.lineTo(point.x, point.y);
        }
      });
      context.lineWidth = strokeWidth;
      context.strokeStyle = "#000";
      context.stroke();
    }

    context.fillStyle = "#000";
    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 4, 0, Math.PI * 2);
      context.fill();
    });

    if (previewPoint && points.length > 0) {
      const lastPoint = points[points.length - 1];
      context.beginPath();
      context.moveTo(lastPoint.x, lastPoint.y);
      context.lineTo(previewPoint.x, previewPoint.y);
      context.strokeStyle = "#888";
      context.stroke();
    }
  }, [points, previewPoint, shapes, fillColor, strokeWidth]);

  return {
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
  };
};

export default useDrawingCanvas;
