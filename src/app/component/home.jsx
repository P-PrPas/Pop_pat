'use client';
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [score, setScore] = useState(() => parseInt(localStorage.getItem("counter")) || 0);
  const [audioIndex, setAudioIndex] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [speedMeter, setSpeedMeter] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(Date.now());
  const [imageSrc, setImageSrc] = useState('/picture/pop.png');
  
  const activeAudioRef = useRef(null); // Reference for the currently playing audio

  const sounds = ["/sound/pop.ogg"];
  const specialSound = "/sound/แดน.mp3"; // เสียงพิเศษเมื่อหลอด 100%

  const playSound = (src) => {
    if (isUserInteracted) {
      const audio = new Audio(src);
      audio.play();
    }
  };

  const playSpecialSound = () => {
    if (isUserInteracted && !activeAudioRef.current) {
      const audio = new Audio(specialSound);
      audio.loop = true; // เปิดเสียงให้เล่นวนซ้ำ
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
      playSpecialSound(); // เล่นเสียงแดน.mp3 เมื่อหลอดเต็ม
    } else if (speedMeter >= 50) {
      setImageSrc('/picture/pup2.png');
      stopSpecialSound(); // หยุดเสียงพิเศษถ้าหลอดลดลงต่ำกว่า 100%
    } else {
      setImageSrc('/picture/pup.png');
      playSound(sounds[audioIndex]);
      setAudioIndex((prevIndex) => (prevIndex + 1) % sounds.length);
      stopSpecialSound(); // หยุดเสียงพิเศษถ้าหลอดลดลงต่ำกว่า 100%
    }

    const newScore = score + 1;
    setScore(newScore);
    localStorage.setItem("counter", newScore);
  };

  const handleUserInteraction = () => {
    if (!isUserInteracted) {
      setIsUserInteracted(true);
    }
  };

  useEffect(() => {
    const img = document.getElementById("pop");

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
  }, [score, audioIndex, isUserInteracted, speedMeter]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastClickTime > 200) {
        setSpeedMeter((prev) => {
          const newSpeedMeter = Math.max(prev - 10, 0);
          if (newSpeedMeter < 80) {
            stopSpecialSound(); // หยุดเสียงพิเศษเมื่อหลอดต่ำกว่า 100%
          }
          return newSpeedMeter;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [lastClickTime]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* GIF จะแสดงเมื่อ speedMeter ถึง 100% */}
      {speedMeter >= 100 && (
        <img
          src="https://i.pinimg.com/originals/c9/16/51/c9165186bddc0e6bd71d45cb720bb2c7.gif"
          alt="Special GIF"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            opacity: 0.2, // ปรับความโปร่งใสของ GIF
            pointerEvents: 'none', // ป้องกันไม่ให้ GIF ขัดขวางการโต้ตอบ
          }}
        />
      )}

      {/* พื้นหลัง (Background) */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-pink-100 via-white to-pink-100 ..."
        style={{
          zIndex: -2, // พื้นหลังอยู่ด้านล่างสุด
        }}
      />

      <div
        className={`absolute top-20 bg-gray-50 ${speedMeter === 80 ? 'animate-shake' : ''}`} // เพิ่ม animation เมื่อ speedMeter ถึง 100%
        style={{
          left: '10px', // ระยะห่างจากขอบซ้าย
          width: '6px', // ความกว้างของหลอด
          height: '500px', // ความยาวของหลอด
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'absolute', // ใช้ absolute positioning
          zIndex: 0, // ให้หลอดอยู่ด้านหน้าของ GIF แต่หลังเนื้อหา
        }}
      >
        <div
            className="bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 transition-all duration-200 ease-linear"
            style={{
            height: `${speedMeter}%`, // ความสูงของหลอดขึ้นอยู่กับค่าของ speedMeter
            width: '100%', // ความกว้างเต็มของ container
            position: 'absolute',
            bottom: 0, // ให้หลอดเริ่มวัดจากด้านล่าง
            }}
        />

      </div>
      <link
      href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap"
      rel="stylesheet"
    />
      <h1 id="h1" style={{textShadow: '2px 2px 4px pink, -2px -2px 4px pink',}} className={`text-6xl text-purple-700  font-bold mb-2 sm:text-4xl md:text-5xl lg:text-6xl luckiest-font ${speedMeter === 80 ? 'animate-shake' : ''}`}>
  POP PAT
  
</h1>
<p id="score"  style={{textShadow: '2px 2px 4px pink, -2px -2px 4px pink',}} className={`text-4xl text-pink-500  font-mono mb-2 sm:text-5xl md:text-6xl lg:text-7xl luckiest-font ${speedMeter === 80 ? 'animate-shake' : ''}`}>
  {score}
</p>
      <img
        draggable="false"
        src={imageSrc}
        alt="pop"
        id="pop"
        className={`w-120 h-120 sm:w-96 sm:h-96 md:w-120 md:h-120 lg:w-144 lg:h-144 mb-6 ${speedMeter === 80 ? 'animate-shake' : ''}`}
      />
    </div>
  );
}
