import {IonRouterLink, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import {useState,useEffect,useRef} from "react"
import Addbook from '../components/addbook';
import FullBookPage from '../components/fullbookpage';
import Holding from "../components/holding"
import openDB from "../lib/indexdb"
import {useAuth,useLoader} from "../lib/hooks"

import query from '../components/query';
import { log } from '../lib/indexdb/libs/uitils/log';

function Home(){
  return (
    <IonPage>
      <IonContent fullscreen>
        <Index />
      </IonContent>
    </IonPage>
  );
}

const _published = 1722780446904

function Index(){
  const [page,setPage]=useState(null)
  const [index,setIndex] = useState(0)
  const [clearTable,setClearTable] = useState(false)
  const [spin,setSpin] = useState(false)
  const [_delete,setDelete] = useState(null)

  const isAuthed = useAuth(_published)

  const {data,setData,reset,setReset} = useLoader('infos')
  if (!isAuthed||!data) return (<Holding/>)
  if (page) return (<FullBookPage page={page} setPage={setPage}/>)

  
  return (
    <>
      {
      spin?(
        <div className='z-[10000] backdrop-blur-sm fixed p-0 m-0 inset-0'>
          <Holding/>
        </div>
      ):''
    }
      <div className='px-5 select-text min-h-[100vh] bg-purple-100 space-y-[50px]'>
      <div className='pt-10 font-serif italic text-2xl'>
        <div>Hi, </div>
        <div>have a good time!</div>
      </div>

      {
        _delete?(
          <div onClick={()=>setDelete(null)} className='z-[10000] backdrop-blur-sm flex place-items-center fixed inset-0' onContextMenu={()=>{
            let db;
            openDB()
             .then((_db)=>{
              db = _db
              db.delete({
                tableName: 'blobs',
                condition: item => {
                  return item.id == _delete.id
                },
                success: res => {
                  console.log('删除成功')
                }
              })
             })

             db.delete({
              tableName: 'infos',
              condition: item => {
                return item.id == _delete.id
              },
              success: res => {
                console.log('删除成功')
                setReset(!reset)
              }
            })


          }}>
            Click to undo the action, swape to delete
          </div>
        ):''
      }

      {
        <div className='text-left grid grid-cols-2 w-full place-content-center gap-4'>
        {
          data.map((item,i)=>{
              return (
                <div key={i} style={{'backgroundImage':i%4==2?'':`url(${item.avatar})`}} className={`rounded-[20px] border-2 border-white bg-cover relative bg-purple-200 ${i%4!=2?'pt-[100%] text-white':'pt-[50%]'} ${i%4>1?'col-span-2':''}`} onClick={()=>setPage(item)} onContextMenu={()=>setDelete(item)}>
                  <div className={`p-2 rounded-[20px] absolute inset-0 ${i%4==2?'grid grid-cols-2 gap-x-4':'bg-gradient-to-t from-black to-transparent flex place-items-end place-content-center'} ${i%4==3?'text-2xl':'text-sm'}`}>
                    {
                      i%4!=2?item.title:(
                        <>
                          <div className='h-full text-black text-left flex place-items-end'>{item.title}</div>
                          <div style={{'backgroundImage':`url(${item.avatar})`}} className='rounded-[20px] h-full bg-cover'></div>
                        </>
                      )
                    }
                  </div>
                </div>
              )
          })
        }
        <div className={`rounded-[20px] border-white border relative bg-purple-200 ${data.length%4!=2?'pt-[100%]':'pt-[50%]'} ${data.length%4>1?'col-span-2':''}`} onContextMenu={()=>{
             openDB()
             .then((_db)=>{
               _db.clear_table({
                 tableName: 'blobs'
               })
               console.log('clear');
             })
         
             openDB()
             .then((_db)=>{
               _db.clear_table({
                 tableName: 'infos'
               })
               console.log('clear');
               data.map((item)=>{
                 localStorage.removeItem(item.id)
               })
               setReset(!reset)
             }) 
        }}>
          <Addbook setReset={setReset} reset={reset} setInfos={setData} infos={data} setSpin={setSpin}/>
        </div>
      </div>
      }
      <div className='pb-5'></div>
    </div>
    </>
    
  )
}
{/* <div className='rounded-full h-[6px] bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-600 w-[30%]'></div> */}



export default Home;
