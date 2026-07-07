import { useEffect, useRef } from "react";

function StarsCanvas(){
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationId;
        let stars = []; 

        const createStars = () => {
            stars = [];

            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1 + 0.5,
                    speed: Math.random() * 0.1 + 0.2,
                });
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            createStars();
        };

        resizeCanvas();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                star.y += star.speed;

                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();
         window.addEventListener("resize", resizeCanvas);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resizeCanvas);
        };

    },[])

    return (
        <canvas
            ref={canvasRef}
            className="fixed w-screen h-screen bg-black inset-0 -z-10"
        />
    );
}
export default StarsCanvas;
