import { useState, useEffect } from "react";
import { motion, AnimatePresence} from 'framer-motion';

function HowTo(){
    const steps = [
        {
            id: 1,
            title: "CREATE OR JOIN A ROOM",
            description:
            "Create a new game room and invite your friends using the room code, or join an existing room. Once everyone has joined, the host can start the game."
        },
        {
            id: 2,
            title: "RECEIVE YOUR SECRET WORD",
            description:
            "Every player receives a secret word. Most players get the exact same word, while one player—the Imposter—receives a similar but different word. Keep your word private ."
        },
        {
            id: 3,
            title: "DISCUSS AND GIVE CLUES",
            description:
            "Take turns describing your word with short clues. Be specific enough that teammates recognize the shared word, but vague enough that the Imposter cannot easily figure it out."
        },
        {
            id: 4,
            title: "IDENTIFY THE IMPOSTER",
            description:
            "Pay attention to players who hesitate, give unrelated clues, or seem to copy others. The Imposter's goal is to blend in without knowing the correct word, so every clue matters."
        },
        {
            id: 5,
            title: "CAST YOUR VOTE",
            description:
            "When the discussion ends, every player votes for the person they believe is the Imposter. Choose wisely—one wrong vote could allow the Imposter to escape."
        },
        {
            id: 6,
            title: "REVEAL THE WINNER",
            description:
            "If the majority correctly identifies the Imposter, the other players win. If the Imposter survives -or successfully guesses the common word after being caught—they steal the victory."
        }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [isPause, setIsPause] = useState(false);
    const [direction, setDirection] = useState(1);

    const nextStep = () =>{
        setDirection(1);
        setCurrentStep((prev) => (prev+1) % steps.length);
    };

    const prevStep = () =>{
        setDirection(-1);
        setCurrentStep((prev)=> prev ===0 ? steps.length-1 : prev-1);
    };


    useEffect(() =>{
        if(isPause) return;
        const interval = setInterval(() => {
            nextStep();
        }, 4000);

        return () => clearInterval(interval);
    }, [isPause])

    const step = steps[currentStep];
    return(
        <div className='font-mono flex flex-col justify-center items-center'>
            <span className='flex flex-col justify-center items-center mt-5 text-gray-300 font-bold'>
              -- HOW TO PLAY --
            </span>
            <div className='flex overflow-hidden justify-center items-center text-gray-400 p-2 min-w-80 max-w-140'>
                <AnimatePresence mode="wait">

            
                    <motion.div 
                        key ={currentStep}
                        initial={{opacity:0, x: direction > 0 ? 80 : -80,}}
                        animate = {{opacity:1, x:0}}
                        onMouseEnter={() => setIsPause(true)} 
                        onMouseLeave={() => setIsPause(false)}
                        exit={{opacity:0, x: direction > 0 ? -80 : 80}}
                        transition={{
                            duration:0.45,
                            ease: "easeInOut",
                        }}
                        drag='x'
                        dragConstraints={{left: -20, right: 20}}
                        dragElastic={0.2}
                        dragMomentum={false}
                        onDrag={() => setIsPause(true)}
                        onDragEnd={(event, info) =>{
                            setIsPause(false);
                            const swipeThreshold = 10;
                            if(info.offset.x < -swipeThreshold){
                                nextStep();
                            }
                            if(info.offset.x > swipeThreshold){
                                prevStep();
                            }
                        }}
                        className='flex cursor-grab active:cursor-grabbing border rounded-xl min-w-80 max-w-140 p-2 bg-gray-700/40'
                    >
                        <div className='p-4' >
                            <span className='text-red-700 text-4xl font-bold '> 
                                0{step.id} 
                            </span>
                        </div>
                        <div className='flex flex-col p-2 gap-2'>
                            <h2 className=' font-bold text-gray-500 text-lg'> 
                                {step.title}
                            </h2>
                            <p className=' font-mono'>
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
                {steps.map((_, index) => (
                    <button
                    key={index}
                    onClick={() => {
                        setDirection(index > currentStep ? 1:-1);
                        setCurrentStep(index);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                        currentStep === index
                        ? "w-8 h-3 bg-gray-400"
                        : "w-3 h-3 bg-gray-600 hover:bg-gray-400"
                    }`}
                    />
                ))}
            </div>
        </div>
    )
}
export default HowTo;