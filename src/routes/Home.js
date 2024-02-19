import {useState, useEffect} from "react";
// import styles from "../css/Movie.module.css"
import Movie from "../components/Movie.js"

function Load() {
  return (
    <div>
      <h1>Now Loading.....</h1>
    </div>
  )
}

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  const getMovies = async() =>{
    const res = await fetch(`https://yts.mx/api/v2/list_movies.json?minimum_rating=9&sort_by=year`)
    const json = await res.json();
    setMovies(json.data.movies)
    setLoading(false);
  }

  useEffect(() =>{
    getMovies();
  },[])

  return (
    <div>
      {/*  style={styles.movieWrap} */}
      {loading ? <Load /> :
        <div>
          {movies.map(item => (
            <Movie
              key={item.id}
              id={item.id}
              coverImg={item.medium_cover_image}
              title={item.title}
              summary={item.title}
              genres={item.genres}
            />
          ))}
        </div>
      }
    </div>
  )
}

export default Home;