import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const visorRef = useRef(null);
  const cordRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Draw the visor
    const drawVisor = () => {
      const canvas = visorRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      ctx.beginPath();
      ctx.moveTo(5, 45);
      ctx.bezierCurveTo(15, 64, 45, 64, 55, 45);

      ctx.lineTo(55, 20);
      ctx.bezierCurveTo(55, 15, 50, 10, 45, 10);

      ctx.lineTo(15, 10);

      ctx.bezierCurveTo(15, 10, 5, 10, 5, 20);
      ctx.lineTo(5, 45);

      ctx.fillStyle = "#2f3640";
      ctx.strokeStyle = "#f5f6fa";
      ctx.fill();
      ctx.stroke();
    };

    // Animate the cord
    let y1 = 160;
    let y2 = 100;
    let y3 = 100;

    let y1Forward = true;
    let y2Forward = false;
    let y3Forward = true;

    const animate = () => {
      const canvas = cordRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(130, 170);
      ctx.bezierCurveTo(250, y1, 345, y2, 400, y3);

      ctx.strokeStyle = "white";
      ctx.lineWidth = 8;
      ctx.stroke();

      if (y1 === 100) y1Forward = true;
      if (y1 === 300) y1Forward = false;
      if (y2 === 100) y2Forward = true;
      if (y2 === 310) y2Forward = false;
      if (y3 === 100) y3Forward = true;
      if (y3 === 317) y3Forward = false;

      y1Forward ? (y1 += 1) : (y1 -= 1);
      y2Forward ? (y2 += 1) : (y2 -= 1);
      y3Forward ? (y3 += 1) : (y3 -= 1);

      animationFrameId = requestAnimationFrame(animate);
    };

    drawVisor();
    let animationFrameId = requestAnimationFrame(animate);

    // Cleanup function to cancel animation frame
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-r from-[#2f3640] to-[#181b20]">
      {/* Moon */}
      <div className="absolute -top-24 -left-72 h-[900px] w-[900px] rounded-full bg-gradient-to-r from-[#d0d0d0] to-[#919191] shadow-lg"></div>
      <div className="absolute left-[500px] top-[250px] h-[180px] w-[60px] rounded-full bg-gradient-to-r from-[#7a7a7a] to-[#c3c3c3] opacity-60"></div>
      <div className="absolute left-[340px] top-[650px] h-[80px] w-[40px] rotate-55 rounded-full bg-gradient-to-r from-[#7a7a7a] to-[#c3c3c3] opacity-60"></div>
      <div className="absolute -top-5 left-10 h-[120px] w-[65px] rotate-250 rounded-full bg-gradient-to-r from-[#7a7a7a] to-[#c3c3c3] opacity-60"></div>

      {/* Stars */}
      <div className="absolute left-1/2 top-2/5 h-[5px] w-[5px] animate-[shimmer_1.5s_alternate_infinite_1s] rounded-full bg-gray-500 opacity-40 rotate-250"></div>
      <div className="absolute left-[90%] top-[60%] h-[5px] w-[5px] animate-[shimmer_1.5s_alternate_infinite_3s] rounded-full bg-gray-500 opacity-40 rotate-250"></div>
      <div className="absolute left-[70%] top-[10%] h-[5px] w-[5px] animate-[shimmer_1.5s_alternate_infinite_2s] rounded-full bg-gray-500 opacity-40 rotate-250"></div>
      <div className="absolute left-[40%] top-[90%] h-[5px] w-[5px] animate-[shimmer_1.5s_alternate_infinite] rounded-full bg-gray-500 opacity-40 rotate-250"></div>
      <div className="absolute left-[30%] top-[20%] h-[5px] w-[5px] animate-[shimmer_1.5s_alternate_infinite_0.5s] rounded-full bg-gray-500 opacity-40 rotate-250"></div>

      {/* Error Section */}
      <div className="absolute left-24 top-96 -translate-y-3/5 font-['Righteous',cursive] text-[#363e49]">
        <div className="text-10xl">404</div>
        <div className="text-2xl">Hmmm...</div>
        <div className="opacity-50">
          It looks like one of the developers fell asleep
        </div>
        <div className="mt-12">
          <button
            className="mr-2 min-w-[7em] cursor-pointer rounded-full border-2 border-[#e67e22] bg-[#e67e22] px-8 py-2 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg"
            onClick={() => navigate(-1)}
          >
            BACK
          </button>
          <button
            className="min-w-[7em] cursor-pointer rounded-full border-2 border-[#2f3640] bg-transparent px-8 py-2 text-sm font-bold text-[#576375] transition-all duration-200 hover:text-[#21252c]
          "
            onClick={() => navigate("/")}
          >
            HOME
          </button>
        </div>
      </div>

      {/* Astronaut */}
      <div className="absolute left-[70%] top-1/2 h-[300px] w-[185px] -translate-x-1/2 -translate-y-1/2 rotate-[20deg] scale-120">
        <div className="absolute left-[47px] top-[90px] h-[90px] w-[86px] rounded-lg bg-[#bfbfbf]"></div>
        <div className="absolute left-[55px] top-[115px] h-[80px] w-[70px] rounded-lg bg-[#e6e6e6]"></div>
        <div className="absolute left-[68px] top-[140px] h-[25px] w-[45px] rounded-md bg-[#d9d9d9]"></div>
        <div className="absolute left-[9px] top-[127px] h-[20px] w-[65px] -rotate-30 rounded-lg bg-[#e6e6e6]"></div>
        <div className="absolute left-[7px] top-[102px] h-[45px] w-[20px] -rotate-12 rounded-lg rounded-t-full bg-[#e6e6e6]"></div>
        <div className="absolute left-[100px] top-[113px] h-[20px] w-[65px] -rotate-10 rounded-lg bg-[#e6e6e6]"></div>
        <div className="absolute left-[141px] top-[78px] h-[45px] w-[20px] -rotate-10 rounded-lg rounded-t-full bg-[#e6e6e6]"></div>
        <div className="absolute left-[21px] top-[110px] h-[6px] w-[10px] -rotate-35 rounded-full bg-[#e6e6e6]"></div>
        <div className="absolute left-[133px] top-[90px] h-[6px] w-[10px] rotate-20 rounded-full bg-[#e6e6e6]"></div>
        <div className="absolute left-[6.5px] top-[122px] h-[4px] w-[21px] -rotate-15 rounded-full bg-[#e67e22]"></div>
        <div className="absolute left-[141px] top-[98px] h-[4px] w-[21px] -rotate-10 rounded-full bg-[#e67e22]"></div>
        <div className="absolute left-[50px] top-[188px] h-[75px] w-[23px] rotate-10 bg-[#e6e6e6]"></div>
        <div className="absolute left-[108px] top-[188px] h-[75px] w-[23px] -rotate-10 bg-[#e6e6e6]"></div>
        <div className="absolute left-[43px] top-[240px] h-[20px] w-[28px] rotate-10 rounded rounded-t-full border-b-4 border-[#e67e22] bg-white"></div>
        <div className="absolute left-[111px] top-[240px] h-[20px] w-[28px] -rotate-10 rounded rounded-t-full border-b-4 border-[#e67e22] bg-white"></div>

        {/* Cord */}
        <div className="astronaut__cord">
          <canvas ref={cordRef} height="500" width="500"></canvas>
        </div>

        {/* Head */}
        <div className="absolute left-[60px] top-[60px] h-[60px] w-[60px] rounded-[2em] bg-white">
          <canvas ref={visorRef} width="60" height="60"></canvas>
          <div className="absolute left-[40px] top-[28px] h-[10px] w-[10px] rounded-[2em] bg-[#7f8fa6] opacity-50"></div>
          <div className="absolute left-[38px] top-[40px] h-[5px] w-[5px] rounded-[2em] bg-[#718093] opacity-30"></div>
        </div>
      </div>

      {/* Add custom keyframes for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
