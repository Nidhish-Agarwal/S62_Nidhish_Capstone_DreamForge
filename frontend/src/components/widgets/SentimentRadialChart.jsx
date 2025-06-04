import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SentimentRadialChart = ({ sentiment }) => {
  const emotions = [
    {
      label: "Positive",
      emoji: "😊",
      value: sentiment.positive,
      color: "#00ffac",
    },
    {
      label: "Neutral",
      emoji: "😐",
      value: sentiment.neutral,
      color: "#ffffff",
    },
    {
      label: "Negative",
      emoji: "😢",
      value: sentiment.negative,
      color: "#ff5757",
    },
  ];

  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-white">
        📊 Sentiment Breakdown
      </h3>
      <div className="flex justify-center gap-6">
        {emotions.map((e) => (
          <div
            key={e.label}
            className=" h-32 flex flex-col items-center gap-1 bg-white/5 p-3 rounded-xl shadow-lg backdrop-blur"
          >
            <div className="w-16">
              <CircularProgressbar
                value={e.value}
                text={`${e.value}%`}
                styles={buildStyles({
                  pathColor: e.color,
                  textColor: "#fff",
                  trailColor: "rgba(255, 255, 255, 0.1)",
                  textSize: "24px",
                })}
              />
            </div>
            <span className="text-white text-sm">
              {e.emoji} {e.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SentimentRadialChart;
