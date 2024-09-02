import {useRef,useEffect,useState} from "react"
import openDB from "./indexdb"
import query from '../components/query';
function useAuth(_published,expire=48*3600*1000) {
  const [password,setPassword] = useState(false)
  useEffect(()=>{
    let now = new Date().getTime()
    let pass = localStorage.getItem('user')
    let deadline = _published+expire
    if (!pass&&now>deadline) return;
    if (!pass&&now<deadline)
      localStorage.setItem('user','book')

    setPassword(true)
  },[])
  return password
}


function useLoader(table_name,page,player){
  function _blobs(){
    const [texts,setTexts] = useState(null)
    const [currentChapter,setCurrentChapter] = useState(0)
    const index = useRef(0)
    const [fontSize,setFontSize] = useState(0)
    const [bing,setBing] = useState('frame')

    useEffect(()=>{
      var db
      openDB()
      .then((_db)=>{
        db=_db;
        return query(db,'blobs',(r)=>r.id==page.id)
      })
      .then((_data)=>{
        _data = _data[0]
        console.log({_data})
        let txt = _data.blobs[0].text
        let audio = _data.blobs[0].audio
        var _player=document.createElement('audio')
        _player.src=URL.createObjectURL(audio)
        player.current=_player
        page.thumb = page.src
        setTexts(txt)
        let _obj = JSON.parse(localStorage.getItem(page.id))
        if (_obj) {
          index.current = _obj.index
          setCurrentChapter(_obj.chapter)
          setFontSize(_obj.fontSize)
          setBing(_obj.bing)
        }
        db.close_db()
      })
    },[])
    return {bing,setBing,texts,setTexts,currentChapter,setCurrentChapter,index,fontSize,setFontSize}
  }

  function _infos(){
    const [data,setData] = useState(null)
    const [reset,setReset] = useState(false)

    useEffect(()=>{
      var db
      openDB()
      .then((_db)=>{
        db=_db;
        return query(db,table_name,()=>true)
      })
      .then((_data)=>{
        _data = _data.map((item)=>{
          if (item.src.constructor.name === "Blob") item.avatar=URL.createObjectURL(item.src)
          return item;
        })
        setData(_data)
        db.close_db()
      })
    },[reset])
    return {data,setData,reset,setReset}
  }
  
  if (table_name=='blobs') return _blobs()
  return _infos()
}


export {useAuth,useLoader}