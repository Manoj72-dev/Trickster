import WordCard from "../WordCard";
import InputHint from "./InputHint";
import HintCards from "../HintCards";

function LeftSection(){
    return(
        <>
            <div className=" flex flex-col gap-4 font-mono ">
                <WordCard/>

                <InputHint/> 
                    
                <HintCards/>
            </div>
        </>
    )

}

export default LeftSection