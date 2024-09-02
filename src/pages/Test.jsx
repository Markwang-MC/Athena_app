import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { log } from '../lib/indexdb/libs/uitils/log';
export default function Test(){
    let arr  = ['item1','item2','item3','item4']
    return (
      <IonPage>
        <IonContent fullscreen>
          <div className='px-5 py-2 grid grid-cols-2 gap-4 w-[100vw] place-content-center'>
            {
              arr.map((item,i)=>{
                return (
                  <div className={`relative bg-amber-100 ${i%4!=2?'pt-[100%]':'pt-[50%]'} ${i%4>1?'col-span-2':''}`}><div className='absolute inset-0 flex place-items-center place-content-center'>{item}</div></div>
                )
              })
            }
            <div className={`relative bg-amber-100 ${arr.length%4!=2?'pt-[100%]':'pt-[50%]'} ${arr.length%4>1?'col-span-2':''}`}><div className='absolute inset-0 flex place-items-center place-content-center'>+</div></div>

          </div>
        </IonContent>
      </IonPage>
    );
  }