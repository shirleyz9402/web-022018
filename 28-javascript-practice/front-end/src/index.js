document.addEventListener('DOMContentLoaded', () => {
  const appContent = document.getElementById('app-content')
  const url = 'http://localhost:3000/tasks'
  const taskContainer = document.getElementById('task-container')
  const taskList = document.getElementById('list')
  let activeTask = null

  function renderTaskList(){
    fetch(url).then(r => r.json()).then( r => {
      taskList.innerHTML = r.map(task => renderAllTasks(task)).join('')
    })
  }
  renderTaskList()

  appContent.addEventListener('click', e => {
    // e.preventDefault()
    if (e.target.id === 'create-task'){
      let description = document.getElementById('new-task-description').value
      let priority = document.getElementById('new-task-priority').value
      fetch(url, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({description: description, priority: priority})
      }).then(r => r.json()).then(task => {
        activeTask = task.id
        taskContainer.innerHTML = renderTask(task)
        renderTaskList()
      })
      document.getElementById('new-task-description').value = ""
      document.getElementById('new-task-priority').value = ""
    }
    else if (e.target.className === 'task-list'){
      activeTask = e.target.id
      fetch(url+`/${activeTask}`).then(r => r.json()).then(task => {
        taskContainer.innerHTML = renderTask(task)
        renderTaskList()
      })
    }
    else if (e.target.id === 'edit-task'){
      fetch(url+`/${activeTask}`).then(r => r.json()).then( task => {
        taskContainer.innerHTML = renderEditForm(task)
        renderTaskList()
      })
    }
    else if (e.target.id === 'update-task'){
      let editDescription = document.getElementById('edit-task-description').value
      let editPriority = document.getElementById('edit-task-priority').value
      fetch(url+`/${activeTask}`, {
        method: "PATCH",
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({description: editDescription, priority: editPriority})
      }).then(r => r.json()).then(task => {
        taskContainer.innerHTML = renderTask(task)
        renderTaskList()
      })
    }
    else if (e.target.id === 'delete-task'){
      fetch(url+`/${activeTask}`,{
        method: "DELETE"
      }).then(r => {
        renderTaskList();
        taskContainer.innerHTML = ""
        })
    }
    else if (e.target.id === 'completed'){
      fetch(url+`/${activeTask}`, {
        method: "PATCH",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({completed: true})
      }).then(r => r.json()).then(task => {
        taskContainer.innerHTML = renderTask(task)
        renderTaskList()
      })
    }
  })

  function renderAllTasks(task){
    if (!(task.completed)){
      return `
        <li><p class="task-list" id="${task.id}">${task.description}</p></li>
      `
      }
    else {
      return `
        <li><strike><p class="task-list" id="${task.id}">${task.description} </p></strike></li>
      `
      }
    }
  function renderTask(task){
    if (!(task.completed)){
      return `
      <div class="task-div" id="${task.id}-task-div" data-taskid="${task.id}">
        <h1>Task: ${task.description}</h1>
        <p>Priority: ${task.priority}</p>
        <button id="completed">Completed</button>
        <button type="button" id="edit-task">Edit</button> <button type="button" id="delete-task">Delete</button>
      </div>
      `
    }
    else {
      return `
      <div class="task-div"id=" ${task.id}-task-div" data-taskid="${task.id}">
      <h1>Task: ${task.description}</h1>
      <p>Priority: ${task.priority}</p>
        <button type="button" id="edit-task">Edit</button> <button type="button" id="delete-task">Delete</button>
      </div>
      `
    }
  }
  function renderEditForm(task){
    return `
      <label for="edit-task-description">Description:</label>
      <input required type="text" id="edit-task-description" name="edit-task-description" value="${task.description}"><br>
      <label for="edit-task-priority">Priority:</label><br>
      <input id="edit-task-priority" value="${task.priority}"></input><br>
      <button type="button" id="update-task">Update Task</button>
    `
  }
})
