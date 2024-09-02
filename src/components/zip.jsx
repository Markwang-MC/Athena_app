import {useRef} from "react"
import JSZip from 'jszip';

export default function Zip() {
  const input = useRef(null)
  return(
    <div onClick={()=>{
      input.current.click()
    }}>
      Click!
      <input className="hidden" ref={input} type="file" onChange={(e)=>{

        // 创建一个<input type="file">元素

          const zipfile = event.target.files[0];
          console.log(zipfile);
          if (zipfile) {
            const reader = new FileReader();

            // 定义读取完成时的回调函数
            reader.onload = function (e) {
              const data = e.target.result;

              // 使用JSZip解压缩zip文件
              JSZip.loadAsync(data).then(function (zip) {
                // 遍历文件对象并进行处理
                zip.forEach(function (relativePath, file) {
                  // relativePath是文件的相对路径
                  // file是文件对象

                  // 处理文件
                  console.log({relativePath, file});
                });
              });
            };

            // 以ArrayBuffer格式读取文件内容
            reader.readAsArrayBuffer(zipfile);
          }
    

        // 将<input>元素添加到页面中


      }}/>
    </div>
  )
}
