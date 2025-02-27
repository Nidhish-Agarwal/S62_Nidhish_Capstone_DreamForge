import React from "react";
import star from "../assets/star.png";
import cloud from "../assets/cloud_2.png";

function RandomCloudsAndStars() {
  return (
    <div className="absolute inset-0">
      {Array(15)
        .fill(0)
        .map((_, i) => {
          const isStar = i < 9;
          const imgSrc = isStar ? star : cloud;
          const size = isStar ? "w-6 h-6" : "h-16";

          return (
            <div
              key={i}
              className="absolute animate-float pointer-events-none"
              style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                animationDuration: `${Math.random() * 4 + 4}s`,
                opacity: Math.random() * 0.5 + 0.5,
                //   transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              <img
                src={imgSrc}
                className={`${size}`}
                alt={isStar ? "Star" : "Cloud"}
              />
            </div>
          );
        })}
    </div>
  );
}

export default RandomCloudsAndStars;
