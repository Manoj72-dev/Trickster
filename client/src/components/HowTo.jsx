import { useState } from "react";

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
            "Every player receives a secret word. Most players get the exact same word, while one player—the Imposter—receives a similar but different word. Keep your word private and never reveal it directly."
        },
        {
            id: 3,
            title: "DISCUSS AND GIVE CLUES",
            description:
            "Take turns describing your word with short clues. Be specific enough that teammates recognize the shared word, but vague enough that the Imposter cannot easily figure it out. Listen carefully to everyone else's clues."
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
            "If the majority correctly identifies the Imposter, the other players win. If the Imposter survives the vote—or successfully guesses the common word after being caught—they steal the victory."
        }
    ];

    const [currentStep, setCurrentStep] = useState(0);

    return(
        <div className='font-mono'>
            <span className='flex flex-col justify-center items-center mt-5 text-gray-300 '>
              HOW TO PLAY 
            </span>
          <div className='flex justify-center items-center text-gray-400 p-2'>
            <div className='flex  border rounded-xl min-w-80 max-w-140 p-2 bg-gray-700/40'>
                <div className='p-4'>
                  <span className='text-red-700 text-2xl font-bold '> 01 </span>
                </div>
                <div className=''>
                  <h2 className=' font-bold text-gray-500 text-lg'> CREATE OR JOIN A ROOM</h2>
                  <p className=' font-mono'>Create a new game room and invite your friends using the room code, or join an existing room. Once everyone has joined, the host can start the game.</p>
                </div>
            </div>
          </div>
        </div>
    )
}
export default HowTo;