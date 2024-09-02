import {useRef,useEffect} from 'react'
export default function Anitamtion() {
  const ref = useRef(null);
  useEffect(()=>{
    if (!ref.current) return ;
    if(ref.current.classList.contains("right-visibal")||ref.current.classList.contains("left-visibal")) return;
    if(!ref.current.classList.contains("wow-left")) ref.current.classList.add("wow-left");
    else if(!ref.current.classList.contains("wow-right")) ref.current.classList.add("wow-right");

    function scroll() {
      var offsetY=window.scrollY
      var top = ref.current.getBoundingClientRect().top
      if (top<200) {
        if (ref.current.classList.contains("wow-left")) ref.current.classList.add('left-visibal')
        else if (ref.current.classList.contains("wow-right")) ref.current.classList.add('right-visibal')
      }
    }
    window.addEventListener("scroll", scroll);
    return ()=>{
      window.removeEventListener("scroll", handleScroll);
    }
  },[])
  return ref;
}
