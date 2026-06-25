import { useEffect, useRef } from "react";

function StarsCanvas(){
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = []; 

        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1 +1,
                speed: Math.random() * 0.5 + 0.2,
            });
        }

        function animate(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach((star) => {
                star.y += star.speed;

                if(star.y > canvas.height){
                    star.y = 0;
                    star.x = Math.random() *canvas.width;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI *2);
                ctx.fillStyle= "white";
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();

    },[])

    return (
        <canvas
            ref={canvasRef}
            className="fixed w-screen h-screen bg-black inset-0 -z-10"
        />
    );
}
export default StarsCanvas;
