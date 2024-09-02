import {useState} from "react"
export default function useRef(initial) {
  if (!initial) initial=null;
  const [ref] = useState({current:initial})
  return ref
}
