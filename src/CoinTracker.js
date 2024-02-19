// import {useState, useEffect} from "react";
// // import styles from "./css/App.module.css";

// function coinTracker() {
//   const [loading, setLoading] = useState(true);
//   const [coins, setCoins] = useState([]); // undefined -> array null
//   const [selected, setSelected] = useState("default");
//   // const [selectedIdx, setSelectedIdx] = useState()
//   // const [calc, setCalc] = useState(0);
//   // const [usd, setUsd] = useState(0);

//   // // const [selectIndex, setSelectedIndex] = useState("default");
//   useEffect(() => {
//     fetch("https://api.coinpaprika.com/v1/tickers")
//     .then((response) => response.json())
//     .then((json) => {
//       // console.log(json)
//       setCoins(json);
//       setLoading(false)}
//     )
//   },[]);

//   return (
//     <div>
//       <h1>The coins! {loading? "" :`(${coins.length})`}</h1>
//       {loading ? <strong>Loading....</strong> :
//       <div>
//         <p>please select coin what you wanna convert</p>
//         <select value={selected}>
//           {/* onChange={onSelect}  */}
//           <option value="default">please select coin</option>
//           {coins.map((item,idx) => <option key={item.id} value={idx} style={{fontSize:20,fontWeight: "bold"}}>
//             {item.name}
//           </option> )}
//         </select>
//         {/* <p>{selected === "default" ? "" : selected }</p> */}
//       </div>
//       }

//     </div>
//   );
// }

// export default coinTracker;
