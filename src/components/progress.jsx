import {useState,useEffect,useRef} from "react"

const Progress = ({audio,index,txt,content,setUpdate}) => {
  const [progress,setProgress] = useState(null)
  const bar = useRef(null)
  const father = useRef(null)
  let len,currentTime
  len=txt.length
  useEffect(()=>{
    if (!father.current) return ;
    audio.ontimeupdate = function () {
      let duration
      if (!father.current) return;
      currentTime=audio.currentTime-txt[0].time
      duration=txt[txt.length-1].time-txt[0].time

      setProgress((currentTime/duration))
    }
  },[txt])
  return (
    <div ref={father} className="absolute inset-0 z-[1000]" onClick={(e)=>{
      const rect = e.currentTarget.getBoundingClientRect();
      const newProgress = ((e.pageX - rect.left) / rect.width)
      let _d = txt[txt.length-1].time-txt[0].time
      audio.currentTime=(_d*newProgress)+txt[0].time
      for (var i = 0; i < txt.length-1; i++) {
        if (audio.currentTime>txt[i].time&&audio.currentTime<txt[i+1].time) {
          index.current = i
          setUpdate((pre)=>!pre)
          break
        }
      }
      setProgress(newProgress);
    }}>
      <div ref={bar} style={{left:`${progress*100}%`}} className={`absolute inset-y-0 flex place-items-center`}>
        <div className={`animate-ping border-l-[2px] border-solid ${content?'border-green-400':'border-red-600'} h-[40%]`}></div>
      </div>
    </div>
  );
};

export default Progress;
