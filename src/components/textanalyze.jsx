import timeChanger from './timeChanger';
export default function Textanalyze(data,type) {
  let _data = data
  .replace(/\r\n/mg,'\n')
  .split('\n\n')
  .map((item,i)=>{
    let _result = item.split('\n')
    let _str = ''
    for (let n = 2; n < _result.length; n++) {
      _str+=(_result[n]+' ')
    }
    let obj = {id:parseInt(_result[0]),time:`${_result[1]}`,text:_str}
    if (obj.time!='undefined') return obj
  })
  .filter((item)=>item)
  .map((item)=>{
    let [sec,_start] = timeChanger(item.time)
    item.start = _start
    item.time= sec
    return item;
  })
  .reduce((arr,item)=>{
    if (item.text.toLowerCase().indexOf('chapter ')==0) {
        let chapter = {}
        chapter.index = item.text
        chapter.texts = [item]
        arr.push(chapter)
        return arr;
      }
      arr[arr.length-1].texts.push(item)
      return arr;
    },[])
    return _data;
}
