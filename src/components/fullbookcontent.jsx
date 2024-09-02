import {useState,useEffect,useRef} from "react"
import Holding from "./holding"

export default function Content({text,setContent,content,index,setCurrentChapter,currentChapter,player}) {
  const [chapters,setChapters] = useState(null)
  useEffect(()=>{
    let _chapters = text.map((item,i)=>{
      return {i:i,chapter:item.texts[0],text:item.texts[1]};
    })
    setChapters(_chapters)
  },[])

  if (!chapters) return (<Holding/>)
  return (
    <div className={`px-2 fixed inset-0 bg-slate-950 overflow-scroll space-y-2 pt-[80px] sm:pb-[60px] pb-[30px]`} onContextMenu={()=>setContent(false)}>
      <div className='h-[1px] bg-white w-full'></div>
      <div className='w-full bg-slate-950'>
        {
          chapters.map((item,i)=>{
            return (
              <div key={i} className={`text-sm text-pretty ${item.i<currentChapter?'text-slate-400':'text-white'} p-4`} onClick={()=>{
                index.current = 0
                player.current.pause()
                setCurrentChapter(item.i)
                setContent(false)
              }}>
                <div className={`w-full`}>{item.i+1}: {item.text.text}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
// text-red-600
