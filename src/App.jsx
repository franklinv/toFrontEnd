import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import './App.css';


function App() {
  const [todos, setTodos] = useState([]); // This state variable holds our list of todos.

  const [taskDesc, setTaskDesc] = useState(""); // This state variable is for the task description
  const [checked, setChecked] = useState(false);


  const [isEditing, setIsEditing] = useState(false); // This state variable indicates whether we're currently editing a todo.
  const [currentTodoId, setCurrentTodoId] = useState(null);

  const [refresh, setRefresh] = useState(false)

  const baseUrl="http://localhost:3000/todos/"

  useEffect(() => {
    axios.get(baseUrl)
      .then(result => setTodos(result.data))
  }, [todos, refresh]);


  const handleAdd = (description, completed) => {
    axios.post(baseUrl, { description: description, completed: completed })
      .then(result => console.log(result))
      .catch(err => console.log(err))
  }

  const handleEdit = (description, completed) => {
    axios.put(baseUrl + currentTodoId, { description: description, completed: completed })
      .then(result => console.log(result))
      .catch(err => console.log(err))
  }

  const handleDelete = () => {
    axios.delete(baseUrl + currentTodoId)
      .then(result => console.log(result))
      .catch(err => console.log(err))
  }



  // This function is used to handle changes in the input field of our form.
  const handleTaskDesc = (e) => {
    setTaskDesc(e.target.value); // Updating our input state variable with the new value of the input field.
  };


  // checkbox change
  const handleFormCheckBoxChange = (event) => {
    setChecked(event.target.checked);
  };


  // This function is used to handle form  submission of our form.
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from reloading when the form is submitted.

    if (isEditing) {
      // update todo if in edit mode
      handleEdit(taskDesc, checked)
      setIsEditing(false);

    } else if (taskDesc.trim()) {

      handleAdd(taskDesc, checked)
    }

    // Reset the input fields
    setTaskDesc(""); 
    setChecked(false)
    // refresh the todo list
    setRefresh(true);
  };

  // This function is used to set the todo that we want to edit.
  const setEdit = (todoId) => {
    setIsEditing(true); // We're about to start editing a todo, so we set our isEditing state variable to true.
    setCurrentTodoId(todoId); // We update our currentTodo state variable with the index of the todo we want to edit.
    let editedToDo = todos.filter((todoItem) => {
      return todoItem._id == todoId;
    });

    setTaskDesc(editedToDo[0].description);
    setChecked(editedToDo[0].completed)
  };

  // This function is used to delete a specific todo.
  const setDelete = (todoId) => {
    setCurrentTodoId(todoId);
    handleDelete(todoId)
  };

  // The return statement of our function component. This is what will be displayed when our component is used.
  return (
    <div className="TodoWrapper">
     <h1 className='header-style'>To Do Application</h1>
      <form onSubmit={handleSubmit} className="TodoForm">
        <input
          type="text"
          value={taskDesc}
          onChange={handleTaskDesc}
          placeholder="Enter task"
          className="todo-input"
        />
          <label className='todo-label'>Completed</label>
        <input type='checkbox' checked={checked} className="todo-checkbox" onChange={handleFormCheckBoxChange} />

        <button type="submit" className='todo-btn'>{isEditing ? "Update task" : "Add task"}</button>
      </form>
      <ul >
        {todos.map((todo, index) => (
          <li key={index} className='Todo'>
          
            <span>{todo.description}</span> 
            <span> <input type="checkbox" className="todo-checkbox" checked={todo.completed} /></span>
            <div className='div-style'>
            <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} onClick={() => setEdit(todo._id)} />
            <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={() => setDelete(todo._id)} />
              </div>
          </li>
        ))}
      </ul>
    </div>
  );

}

export default App
