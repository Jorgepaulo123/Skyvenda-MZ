import React, { useEffect, useRef } from "react";
import View360, { EquirectProjection } from "@egjs/view360";
import "@egjs/react-view360/css/view360.min.css";

const Vista3d = ({ src }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current) {
      // Certifique-se de que um <canvas> esteja presente no contêiner
      const canvas = document.createElement("canvas");
      viewerRef.current.appendChild(canvas);

      new View360(viewerRef.current, {
        projection: new EquirectProjection({
          src: 'img.jpg',
          video: false,
          
        }),
      });
    }
  }, [src]);

  return <div ref={viewerRef} className="w-full h-auto rounded-lg shadow-lg" />;
};

export default Vista3d;
