function Hero(){
    return(
        <div className="flex flex-col pt-20 font-mono">
            <div className='flex text-purple-400 justify-center items-center'>
                <div className='border rounded-lg text-sm px-2 '>
                    MULTIPLAYER WORD GAME
                </div>
            </div>
            <div className='flex flex-col justify-center items-center mt-4'>
                <span className='text-white font-bold text-4xl sm:text-6xl '> 
                    FIND THE 
                </span>
                <span className='text-red-500 font-bold text-6xl sm:text-8xl'> 
                    IMPOSTER 
                </span>
                </div>
                <div className='flex justify-center items-center'>
                    <span className='text-gray-400 text-lg'>One word, One lie, one imposter</span>
                </div>
        </div>
    )
}

export default Hero