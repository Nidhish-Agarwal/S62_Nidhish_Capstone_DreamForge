const RandomStars = () => {
  const starCount = 200; // Number of stars
  const stars = Array.from({ length: starCount }, () => ({
    top: `${Math.random() * 100}%`, // Random vertical position
    left: `${Math.random() * 100}%`, // Random horizontal position
  }));

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: `${Math.random() * 2 + 1}px`, // Random size (1px to 3px)
            height: `${Math.random() * 2 + 1}px`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default RandomStars;
