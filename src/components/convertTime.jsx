import {useState,useEffect} from 'react'
import { log } from '../lib/indexdb/libs/uitils/log';
export default function ConvertTime({currentChapter,audio,setSearch}) {

  let _player=audio.current
  const [time,setTime] = useState('00:00:00')
  useEffect(()=>{
    if (!_player) return ;
    let fn = function () {
      let seconds = _player.currentTime
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      setSearch(null)
      setTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
    }
    _player.addEventListener('timeupdate',fn)
    return ()=>{
      _player.removeEventListener('timeupdate',fn)
    }
  },[currentChapter])
  return time
}
