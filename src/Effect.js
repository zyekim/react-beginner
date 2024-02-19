import {useState, useEffect} from "react";
import styles from "./css/App.module.css";

function Hello() {
  useEffect(()=>{
    console.log("Created~!!");
    return () => console.log("destroyed!"); // clean up function
  },[])
  return <h1>Hello</h1>
}

function Effect() {
  const [counter, setCounter] = useState(0);
  const [keyword, setKeyword] = useState('');
  const onClick = () => setCounter((prev) => prev+ 1);
  const onChange = (event) => setKeyword(event.target.value);
  console.log("i run all the time");

  // state 변할때마다  render 되지 않게하기 (API 송신 할 때) -> useEffect
  useEffect(()=>{
    // console.log("call the API");
    console.log("I run only once");
  },[]);
  // useEffect(()=>{
  //   if(keyword !== '' && keyword.length > 5) {
  //     console.log("Search for Marvel",keyword);
  //   }
  // },[keyword]); // keyword state가 변할때마다 시행
  useEffect(()=>{
      console.log("I run when 'keyword' changes");
  },[keyword]); // keyword state가 변할때마다 시행
  useEffect(()=>{
      console.log("I run when 'counter' changes");
  },[counter]); // counter state가 변할때마다 시행


  // Clean up function (hello component 참고)
  const [showing,setShowing] = useState(false);
  const makeShowing = () => setShowing((prev) => !prev)
  return (
    <div>
      <input value={keyword} onChange={onChange} type="text" placeholder="Search Here!"/>
      <h1 className={styles.title}>Welcome back!</h1>
      <p>{counter}</p>
      <button onClick={onClick}>add Count</button>
      <hr/>
      {showing ? <Hello/> : null}
      <button onClick={makeShowing}>{showing ? "Hide" : "Show"}</button>
    </div>
  );
}

export default Effect;
