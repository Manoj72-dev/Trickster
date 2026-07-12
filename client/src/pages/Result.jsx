function Result(){
    return(
        <div className=" flex w-screen h-screen justify-center items-center font-mono text-3xl text-white/80">
            <div className="flex flex-col justify-center max-[500px]:w-full min-[500px]:w-[500px] items-center gap-2">
                <span className="text-5xl sm:text-7xl font-bold">
                    GAME OVER
                </span>
                <span className="text-3xl sm:text-5xl font-bold">
                    You Win
                </span>
                <span className="font-bold">
                    Winners : players
                </span>
                <span className="text-lg min-[500px]:text-xl ">
                    name was the imposter
                </span>

                <div className="flex justify-between w-full mt-10 px-5">
                    <button className="text-2xl bg-white text-black font-bold px-2 py-1 rounded-xl"> Play Again</button>
                    <button className="text-2xl bg-white text-black font-bold px-2 py-1 rounded-xl "> Exit </button>
                </div>
            </div>
        </div>

    )
}

export default Result;