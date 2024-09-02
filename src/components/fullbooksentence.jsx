import {useState,useEffect} from "react"
import Holding from "./holding"
export default function Sentence({text,update,setUpdate,index,player,setSearch,fontSize,currentChapter,setCurrentChapter,src}) {
  const size = ['text-2xl','text-3xl','text-4xl','text-5xl']
  const [pic,setPic] = useState(null)
  useEffect(()=>{
    if (!pic) {
      setPic(URL.createObjectURL(src))
      return ;
    }
    let ele = document.getElementById('ele')
    const touchMoveHandler = function(e) {
    e.preventDefault();
    };
    ele.addEventListener('touchmove', touchMoveHandler, { passive: false });
  },[pic])
  if (!pic) return (<Holding />)
  return (<div id='ele' style={{backgroundImage:`url('${pic}')`}} className="bg-center bg-cover bg-no-repeat z-[-60] fixed inset-0">
      <div className='bg-black/80 backdrop-blur-sm h-full flex items-center' onClick={()=>{
          player.current.currentTime = text[currentChapter].texts[index.current].time
          player.current.paused?player.current.play():player.current.pause();
          setUpdate(!update)
      }} onTouchStart={(e)=>{
        e.target.start=e.targetTouches[0].screenY
        e.target.startTime=Date.now()
      }}  onTouchEnd={(e)=>{
        var start = e.target.start
        var startTime = e.target.startTime
        var end = e.changedTouches[0].screenY
        var endTime=Date.now()
        if (end-start>20) {
          if (index.current==0&&currentChapter==0) return;
          else if(index.current==0) {
            player.current.currentTime = text[currentChapter-1].texts[index.current].time
            setCurrentChapter(currentChapter-1)
            return
          }
          let _time = text[currentChapter].texts[index.current-1].time
          player.current.currentTime = text[currentChapter].texts[index.current-1].time
          if(player.current.paused)
          player.current.play()
          index.current=index.current-1
          setUpdate((pre)=>!update)
        }
        else if (end-start<-20) {
          if (index.current==text[currentChapter].texts.length-1) {
            index.current = 0
            setCurrentChapter(currentChapter+1)
            return ;
          }
          let _time = text[currentChapter].texts[index.current+1].time
          player.current.currentTime = _time
          if(player.current.paused)
          player.current.play()
          index.current = index.current+1
          setUpdate((pre)=>!update)

        }
      }}>
        <div className={`py-[15%] text-white px-5 rounded drop-shadow-2xl w-[90%] mx-auto ${size[fontSize]}`}  onContextMenu={()=>setSearch(window.getSelection().toString())}>{text[currentChapter].texts[index.current].text}</div>
      </div>
      </div>
  )
}
