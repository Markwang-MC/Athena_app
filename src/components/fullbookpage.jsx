import {IonContent} from '@ionic/react';
import {useState,useEffect,useRef} from "react"
import timeChanger from './timeChanger';
import Sentence from './fullbooksentence';
import Content from './fullbookcontent';
import ConvertTime from './convertTime';
import Progress from './progress';
import Holding from "./holding"
import openDB from "../lib/indexdb"
import query from './query';
import { log } from "../lib/indexdb/libs/uitils/log";
import {useLoader} from "../lib/hooks";
export default function FullBookPage({setPage,page}) {
  var {title,src}=page
  const [time,setTime] = useState(null)
  const [search,setSearch] = useState(null)
  const [update,setUpdate] = useState(false)
  const [sentence,setSentence] = useState(true)
  const [content,setContent] = useState(false)
  const [frame,setFrame] = useState(null)

  const player = useRef(null)
  const size = ['text-xl','text-2xl','text-3xl','text-4xl']
  const {bing,setBing,texts,setTexts,currentChapter,setCurrentChapter,index,fontSize,setFontSize} = useLoader('blobs',page,player)
  if (index.current==null) index.current = 0
  useEffect(()=>{
    if (!player.current||!texts)return ;
    let _player=player.current
    let fn = function () {
      let _cTime = _player.currentTime
      let _nTime
      if (index.current==texts[currentChapter].texts.length-1) _nTime = texts[currentChapter+1].texts[0].time
      else _nTime = texts[currentChapter].texts[index.current+1].time
      localStorage.setItem(page.id,JSON.stringify({bing:bing,index:index.current,chapter:currentChapter,fontSize:fontSize}))
      if (_cTime<_nTime)return
      if(index.current==texts[currentChapter].texts.length-1){
        index.current = 0
        setCurrentChapter(currentChapter+1)
        return
      }
      index.current=index.current+1
      setUpdate((pre)=>!pre)
    }

    _player.addEventListener('timeupdate',fn)
    if (!content) {

      let ele=document.getElementById('_'+index.current)
      if(ele){
        ele.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }
    return ()=>{
      _player.removeEventListener('timeupdate',fn)
    }
  },[update,currentChapter,texts,player,sentence])

  useEffect(()=>{
    if (!texts) return ;
    if (content) return;
    if (!sentence) return;
    let ele = document.getElementById('_'+index.current)
    ele.scrollIntoView({
      behavior: 'instant',
      block: 'center',
      inline: 'start'
    });
  },[sentence,content])


  if (!texts||!player.current)return (<Holding/>)
  return (
    <div className="select-text">
      {
        frame?(
          <div className="fixed inset-0 z-[10000]">
            <iframe sandbox="allow-same-origin allow-scripts"  className={`w-full h-full`} src={frame} frameBorder="0"></iframe>
            <button onClick={()=>setFrame(null)} className="flex place-items-center place-content-center select-none text-sky-600 text-sm font-serif italic inset-x-0 backdrop-blur h-[100px] bg-purple-100/75 left-0 bottom-0 absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className='animate-ping' width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
              Back
            </button>

            
          </div>
        ):""
      }


      <div className={`${content?'bg-black text-white border-white border':sentence?'backdrop-blur bg-purple-100/75':'bg-purple-100'} px-2 py-[2px] fixed bottom-0 inset-x-0`} onTouchStart={(e)=>{
        e.target.start=e.targetTouches[0].clientX
      }} onTouchEnd={(e)=>{
        var start = e.target.start
        var end = e.changedTouches[0].clientX
        if (end-start>20) {
          if (fontSize>size.length-1) setFontSize(0)
          else setFontSize(fontSize+1)
        }
        else if (end-start<-20) {
          if (fontSize==0) return
          else setFontSize(fontSize-1)
        }
      }}>


          <div className='p-2 space-x-4 w-[100%] text-center flex place-items-center place-content-center'>
            <a className="select-none text-sky-600 text-sm font-serif italic" target="_blank" onClick={()=>{
            if (search)
            bing=='frame'?setFrame(`https://www.bing.com/dict/search?q=${search}`):window.open(`https://www.bing.com/dict/search?q=${search}`)
            }} onContextMenu={()=>{
              let _bing = bing=='frame'?'website':'frame'
              localStorage.setItem(page.id,JSON.stringify({bing:_bing,index:index.current,chapter:currentChapter,fontSize:fontSize}))
              setBing(_bing)
              alert(`搜索方式以被设定为：${_bing}`)
            }}>{(search&&player.current.paused)?(
              <div className="space-x-2 flex place-items-center">
              <span className="">{search}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="animate-ping" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
              </div>
              ):texts[currentChapter].texts[index.current].start.trim().split(',')[0]}</a>
            
          </div>
      </div>

      <div id='top' className={`${content?'bg-black text-white z-[1000]':sentence?'backdrop-blur bg-purple-100/75':'bg-purple-100'} flex sm:h-[80px] top-0 h-[60px] fixed items-center w-full overflow-y`} onTouchStart={(e)=>{
      if (content) return ;
      e.target.start=e.targetTouches[0].clientX
      }} onTouchEnd={(e)=>{
        var start = e.target.start
        var end = e.changedTouches[0].clientX
        if (end-start>20) setSentence(!sentence)
      }}>
      <div style={{'backgroundImage':`url(${URL.createObjectURL(page.thumb)})`}} className={`${content?'border-2 border-white':''} ${player.current.paused?'':'animate-spin'} rounded-[50%] ml-5 bg-cover sm:h-[70px] sm:w-[70px] h-[40px] w-[40px]`} onClick={()=>{
        if (!sentence) {
          setSentence(!sentence)
          return ;
        }
        player.current.pause()
        player.current=null
        setPage(null)
      }}></div>

        <div className='relative flex place-items-center place-content-center h-[100%] grow basis-14 px-3 sm:text-xl text-xs text-center overflow-y-hidden'>
          <Progress {...{audio:player.current,index:index,setUpdate:setUpdate,txt:texts[currentChapter].texts,content:content}}/>
          <div className="w-full text-center uppercase text-pretty">{title}</div>
        </div>

        <div className='relative mr-5' onClick={()=>setContent(!content)}>
          <div className="rounded-full bg-purple-600 text-white font-semibold flex place-items-center place-content-center w-[20px] h-[20px] text-[10px] absolute -right-2 top-1">{currentChapter+1}</div>
          {
            content?(
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="sm:h-[60px] sm:w-[60px] h-[35px] w-[35px] bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            ):(
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="sm:h-[60px] sm:w-[60px] h-[35px] w-[35px] bi bi-list" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
            )
          }

        </div>

      </div>

      {
        content?
        (<Content text={texts} setContent={setContent} content={content} index={index} setCurrentChapter={setCurrentChapter} currentChapter={currentChapter} player={player}/>)
        :!sentence?
        (<Sentence text={texts} update={update} setUpdate={setUpdate} index={index} fontSize={fontSize} player={player} setSearch={setSearch} setCurrentChapter={setCurrentChapter} currentChapter={currentChapter} src={src}/>)
        :(
          <div className={`${!content?'mt-[80px]':''} my-10 w-[90%] mx-auto `} onClick={()=>setSearch(null)}>
            <div className="flex place-content-center">
              <button className={`rounded-full min-w-[40%] border-2 border-solid border-sky-400 text-sky-400 text-sl my-5 px-5 py-2 ${currentChapter>0?'block':'hidden'} `} onClick={()=>{
                player.current.currentTime=texts[currentChapter-1].texts[0].time
                index.current = 0
                setCurrentChapter(currentChapter-1)
              }}>Previous</button>
            </div>

            {
              texts[currentChapter].texts.map((item,i)=>{
                return (
                  <div key={i} id={'_'+i} onClick={(e)=>{
                    if(!player.current.paused){
                      player.current.pause()
                      setUpdate(!update)
                      return
                    }
                    player.current.currentTime = item.time
                    player.current.play()
                    if (index.current!=i){
                      index.current = i
                      setUpdate(!update)
                    }
                    else setUpdate(!update)

                  }} className={`${index.current==i?'text-sky-600	font-semibold':''} rounded my-2 px-5 py-2 ${size[fontSize]}`} onContextMenu={()=>setSearch(window.getSelection().toString())}>{item.text}</div>
                )
              })
            }

            <div className="flex place-content-center">
              <button className={`rounded-full min-w-[40%] border-2 border-solid border-sky-400 text-sky-400 text-sl my-5 px-5 py-2 ${currentChapter==texts.length-1?'hidden':'block'} `} onClick={()=>{
                player.current.currentTime=texts[currentChapter+1].texts[0].time
                index.current = 0
                setCurrentChapter(currentChapter+1)
              }}>Next</button>
            </div>
          </div>
        )

      }

    </div>
  )
}