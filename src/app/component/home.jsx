'use client';
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [score, setScore] = useState(0);
  const [audioIndex, setAudioIndex] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [speedMeter, setSpeedMeter] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(Date.now());
  const [imageSrc, setImageSrc] = useState('/picture/pop.png');
  const activeAudioRef = useRef(null);

  const sounds = ["/sound/pop.ogg"];
  const specialSound = "/sound/แดน.mp3";

  // Load score from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScore = parseInt(localStorage.getItem("counter")) || 0;
      setScore(savedScore);
    }
  }, []);

  // Save score to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("counter", score);
    }
  }, [score]);

  const playSound = (src) => {
    if (isUserInteracted) {
      const audio = new Audio(src);
      audio.play();
    }
  };

  const playSpecialSound = () => {
    if (isUserInteracted && !activeAudioRef.current) {
      const audio = new Audio(specialSound);
      audio.loop = true;
      audio.play();
      activeAudioRef.current = audio;
    }
  };

  const stopSpecialSound = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
  };

  const increaseScore = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;

    if (timeSinceLastClick <= 200) {
      setSpeedMeter((prev) => Math.min(prev + 10, 100));
    } else {
      setSpeedMeter((prev) => Math.max(prev - 5, 0));
    }

    setLastClickTime(now);

    if (speedMeter >= 100) {
      setImageSrc('/picture/pup3.png');
      playSpecialSound();
    } else if (speedMeter >= 50) {
      setImageSrc('/picture/pup2.png');
      stopSpecialSound();
    } else {
      setImageSrc('/picture/pup.png');
      playSound(sounds[audioIndex]);
      setAudioIndex((prevIndex) => (prevIndex + 1) % sounds.length);
      stopSpecialSound();
    }

    setScore((prevScore) => prevScore + 1);
  };

  const handleUserInteraction = () => {
    if (!isUserInteracted) {
      setIsUserInteracted(true);
    }
  };

  useEffect(() => {
    const handlePointerDown = () => {
      setImageSrc('/picture/pup.png');
      increaseScore();
    };

    const handlePointerUp = () => {
      setImageSrc('/picture/pop.png');
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("click", handleUserInteraction);
    };
  }, [isUserInteracted, speedMeter]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastClickTime > 200) {
        setSpeedMeter((prev) => {
          const newSpeedMeter = Math.max(prev - 10, 0);
          if (newSpeedMeter < 100) {
            stopSpecialSound();
          }
          return newSpeedMeter;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [lastClickTime]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {speedMeter >= 100 && (
        <img
          src="https://i.pinimg.com/originals/c9/16/51/c9165186bddc0e6bd71d45cb720bb2c7.gif"
          alt="Special GIF"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-pink-100 via-white to-pink-100"
        style={{ zIndex: -2 }}
      />

      <div
        className="absolute top-20 bg-gray-50"
        style={{
          left: '10px',
          width: '6px',
          height: '500px',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          className="bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 transition-all duration-200 ease-linear"
          style={{
            height: `${speedMeter}%`,
            width: '100%',
            position: 'absolute',
            bottom: 0,
          }}
        />
      </div>

      <link
        href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap"
        rel="stylesheet"
      />
      <h1
        className="text-6xl text-purple-700 font-bold mb-2"
        style={{ textShadow: '2px 2px 4px pink, -2px -2px 4px pink' }}
      >
        POP PAT
      </h1>
      <p
        className="text-4xl text-pink-500 font-mono mb-2"
        style={{ textShadow: '2px 2px 4px pink, -2px -2px 4px pink' }}
      >
        {score}
      </p>
      <img
        draggable="false"
        src={imageSrc}
        alt="pop"
        className="w-120 h-120 mb-6"
      />
    </div>
  );
}
