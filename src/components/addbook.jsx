import {useEffect,useState,useRef} from "react"
import JSZip from 'jszip';
import openDB from "../lib/indexdb"
import timeChanger from './timeChanger';
import textanalyze from './textanalyze';
import query from './query';

export default function AddBook({setReset,reset,setInfos,infos,setSpin}) {
  const [files,setFiles]=useState(null)
  const [arr,setArr]=useState([])
  const [refresh,setRefresh]=useState(true)
  const [cover,setCover]=useState(null)
  const [audio,setAudio]=useState(null)
  const [text,setText]=useState(null)
  const [blobs,setBlobs]=useState(null)
  const [jsondata,setJsondata]=useState(null)

  let input = useRef(null)

  useEffect(()=>{
    if (!blobs||!jsondata||!cover) return;
    let _blobs,_infos;
    openDB()
    .then((_db)=>{
      return query(_db,'blobs',()=>true)
    })
    .then((_data)=>{
      _blobs = _data
      _blobs.push({id:jsondata.id,blobs:blobs,currentChapter:0})
      console.log({_blobs});
      openDB()
      .then((db)=>{
        db.insert({
         tableName: 'blobs',
         data: _blobs,
         success: () => {
            console.log('添加成功');
         }
        })
      })
    })


    if (!infos) _infos = []
    else _infos = infos
    _infos.push({id:jsondata.id,src:cover,title:jsondata.title,type:jsondata.type})
    openDB()
    .then((db)=>{
      db.insert({
        tableName: 'infos',
        data: _infos,
        success: () => {
          console.log('添加成功')
          console.log('11111111111111111');
          setInfos(_infos)
          setSpin(false)
          setReset(!reset)
        }
      })
    })
  },[blobs,jsondata,cover])


  return (
    <div className='absolute inset-0 flex place-items-center place-content-center' onClick={()=>input.current.click()}>
      <div className="text-2xl">+</div>

      <input ref={input} className="hidden block border-2 border-solid" type='file' multiple placeholder='files' name="files" onChange={(e)=>{
        e.preventDefault()
        setSpin(true)
        let form = e.target
        let _files = form.files[0]
        const zip = new JSZip();
        // console.log({name:_files.name});
        let _name = _files.name.split('.')
        _name = _name[_name.length-1]
        if (['nbr','zip','athena'].indexOf(_name)<0) {
          alert('you uploaded a wrong file')
          return ;
        }
        if (_files) {
          const reader = new FileReader();
          reader.onload = function (e) {
          const data = e.target.result;
            zip.loadAsync(_files).then((zip)=>{
              zip=zip.files;
              let _arr=[]
              let name=Object.keys(zip)
              let _audio,_text,_data,_cover
              for (var i = 0; i < name.length; i++) {
                console.log(name[i])
                if (name[i].indexOf('data.json')>-1) _data = zip[name[i]]
                else if (name[i].indexOf('cover.')>-1) _cover = zip[name[i]]
              }
              // console.log(11111,{_data});
              _data = _data.async('text')
              console.log('cover:',_cover)
              _cover = _cover = _cover.async('blob')
              Promise.all([_cover,_data])
              .then((data)=>{
                _data = JSON.parse(data[1])
                _cover = data[0]
                let _text = []
                let _audio = []
                for (var i = 0; i < name.length; i++) {
                  if (name[i].indexOf(`audio.`)>-1||name[i].indexOf(`.mp3`)>-1) _audio.push(zip[name[i]])
                  else if (name[i].indexOf(`.srt`)>-1) _text.push(zip[name[i]])
                }

                Promise.all([..._text.map((item)=>item.async('text')),..._audio.map((item)=>item.async('blob'))])
                .then((result)=>{
                  let audioI = 0
                  let chapters = []
                  for (var i = 0; i < result.length; i++) {
                    if (result[i].constructor.name === "Blob") {
                      // let id = parseInt(_audio[audioI].name.split('/')[1].split('.')[0])
                      let id = _audio[audioI].name.split('/')[1].split('.')[0]
                      // console.log(111111111111,{id},_audio[audioI].name.split('/')[1].split('.')[0]);
                      _audio[audioI++]={id:id,audio:result[i]}
                    }
                    else if (typeof result[i] === "string") _text[i]=textanalyze(result[i])
                  }
                  for (var i = 0; i < _text.length; i++) {
                    chapters.push({id:_audio[i].id,text:_text[i],audio:_audio[i].audio})
                  }
                  chapters = chapters.sort((a,b)=>a.id-b.id)

                  setBlobs(chapters)
                  setJsondata(_data)
                  setCover(_cover)
                })
              })

          })
        }
        reader.readAsArrayBuffer(_files);
      }
      }}/>
    </div>
  )
}
