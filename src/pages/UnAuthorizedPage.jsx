import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnAuthorizedPage() {
  const eyefRef = useRef(null);
  const rootRef = useRef(null);
  const navigate = useNavigate()
  useEffect(() => {
    const root = rootRef.current;
    const eyef = eyefRef.current;
    
    if (!root || !eyef) return;
    
    const handleMouseMove = (evt) => {
      const x = evt.clientX / window.innerWidth;
      const y = evt.clientY / window.innerHeight;
      
      root.style.setProperty("--mouse-x", x);
      root.style.setProperty("--mouse-y", y);
      
      const cx = 115 + 30 * x;
      const cy = 50 + 30 * y;
      eyef.setAttribute("cx", cx);
      eyef.setAttribute("cy", cy);
    };
    
    const handleTouchMove = (touchHandler) => {
      const x = touchHandler.touches[0].clientX / window.innerWidth;
      const y = touchHandler.touches[0].clientY / window.innerHeight;
      root.style.setProperty("--mouse-x", x);
      root.style.setProperty("--mouse-y", y);
      
      const cx = 115 + 30 * x;
      const cy = 50 + 30 * y;
      eyef.setAttribute("cx", cx);
      eyef.setAttribute("cy", cy);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  
  return (
    <div ref={rootRef} className="bg-[#1b1b1b] text-white font-['Bungee',cursive] flex flex-col items-center justify-center min-h-screen w-full">
      <svg xmlns="http://www.w3.org/2000/svg" id="robot-error" viewBox="0 0 260 118.9" role="img" className="w-1/2 md:w-1/3 lg:w-1/4 mx-auto">
        <title>403 Error</title>
        <defs>
          <clipPath id="white-clip">
            <circle id="white-eye" fill="#cacaca" cx="130" cy="65" r="20" />
          </clipPath>
          <text id="text-s" className="text-[120px]" y="106">403</text>
        </defs>
        <path className="animate-[alarmOn_0.5s_infinite]" fill="#e62326" d="M120.9 19.6V9.1c0-5 4.1-9.1 9.1-9.1h0c5 0 9.1 4.1 9.1 9.1v10.6" />
        <use xlinkHref="#text-s" x="-0.5px" y="-1px" fill="black"></use>
        <use xlinkHref="#text-s" fill="#2b2b2b"></use>
        <g id="robot">
          <g id="eye-wrap" className="overflow-hidden">
            <use xlinkHref="#white-eye"></use>
            <circle 
              ref={eyefRef}
              id="eyef" 
              className="eye" 
              clipPath="url(#white-clip)" 
              fill="#000" 
              stroke="#2aa7cc" 
              strokeWidth="2" 
              strokeMiterlimit="10" 
              cx="130" 
              cy="65" 
              r="11" 
            />
            <ellipse id="white-eye" fill="#2b2b2b" cx="130" cy="40" rx="18" ry="12" />
          </g>
          <circle className="fill-[#444]" cx="105" cy="32" r="2.5" id="tornillo" />
          <use xlinkHref="#tornillo" x="50"></use>
          <use xlinkHref="#tornillo" x="50" y="60"></use>
          <use xlinkHref="#tornillo" y="60"></use>
        </g>
      </svg>
      <h1 className="text-3xl mt-6">You are not allowed to enter here</h1>
      <h2 className="text-xl mt-4">Go <span  className="text-[#2aa7cc] hover:text-white transition-colors duration-300" onClick={() => navigate("/")}>Home!</span></h2>
      
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css?family=Bungee");
        
        @keyframes alarmOn {
          to {
            fill: darkred;
          }
        }
        
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
  