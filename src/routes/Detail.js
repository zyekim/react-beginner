import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Detail() {
  const {id} = useParams();
  const [movie, setMovie] = useState([]);
  const getMovieDetail = async() =>{
    const res = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`);
    const json = await res.json();
    console.log(json.data.movie);
    setMovie(json.data.movie)
  }
  useEffect(()=>{
    getMovieDetail();
  },[])
  return (
    <div style={{
      display: "flex",
      columnGap: 30,
    }}>
      <img src={movie.medium_cover_image} alt={movie.title}/>
      <div>
        <h2 style={{
          marginBottom: 0,
        }}>{movie.title}</h2>
        <ul style={{
          margin: 0,
          marginLeft: -6,
          padding: 0,
        }}>
          {movie.genres && movie.genres.map((g) =>(
            <li style={{
              display: "inline-block",
              margin: 6,
              padding: 4,
              backgroundColor: "rgb(255 218 218)",
              borderRadius: 10,
              listStyle: "none",
            }} key={g}>{g}</li>
          ))}
        </ul>
        <h3 style={{marginTop:10}}>Description</h3>
        <p>{movie.description_full}</p>
      </div>
    </div>
  )
}

export default Detail;