import {useState, useEffect} from "react";

function Todos() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const onChange = (e) => setTodo(e.target.value);
  const onSubmit = (e) =>{
    e.preventDefault();
    if(todo == ""){
      return;
    }
    setTodos((prevArr) => [todo, ...prevArr])
    setTodo("");
  }
  // const [checked, setChecked] = useState(false);
  // const makeChecked = () => setChecked((prev) => !prev)
  console.log(todos);
  return (
    <div>
      <h1>My Todos { todos.length }</h1>
      <form onSubmit={onSubmit}>
        <input
          value={todo}
          onChange={onChange}
          type="text"
          placeholder="write your to do"
        />
        <button style={{ marginLeft : 4 }}>Add To do</button>
        <hr/>
        <ul>
          {todos.map((item,index) => <li key={index}>
          {/* <input key={index} id={`id` + index} type="checkbox" onChange={makeChecked} checked={checked} style={{
            textDecoration: checked ? 'line-through' : '',
          }}></input> */}

          {item}
          </li>)}
        </ul>
      </form>
    </div>
  );
}

export default Todos;
