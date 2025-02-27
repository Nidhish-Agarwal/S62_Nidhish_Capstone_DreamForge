import React from "react";

function ShootingStars() {
  return (
    <div>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            className="absolute bg-gradient-to-r from-white to-transparent rounded-full pointer-events-none"
            key={i}
            style={{
              width: "2px",
              height: "100px",
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              transform: "rotate(45deg)",
              animation: "shooting-star 2s linear infinite",
              animationDelay: `${Math.random() * 2}s`, // Staggered animations
            }}
          ></div>
        ))}
    </div>
  );
}

export default ShootingStars;
