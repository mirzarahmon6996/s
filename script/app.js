const todolistForm = document.querySelector("#todolist-form");
const todolistInput = document.querySelector("#todolist-input");
const todolistTaskContainer = document.querySelector("#todolist-taskcontainer");
const clearInputBtn = document.querySelector("#clear-input");
const deleteAllBtn = document.querySelector("#delete-all");

todolistForm.addEventListener("submit", createTask);

const TASKLIST = [];

function createTask(e){
  e.preventDefault();
  if(todolistInput.value.trim().length > 0){
    const date = new Date()
    const taskData = {
      taskName: todolistInput.value,
      taskDate: addZeroToTime(date.getDate()),
      taskHour: addZeroToTime(date.getHours()),
      taskMinute: addZeroToTime(date.getMinutes()),
      taskMonth: addZeroToTime(date.getMonth() + 1),
      taskYear: date.getFullYear(),
      taskCompleted: false,
      taskEdited: false
    };
    TASKLIST.unshift(taskData);
    clearInput(todolistInput);
    renderTasks("create");
  }
}

function renderTasks(type){
  // 1 way
  // todolistTaskContainer.innerHTML = "";
  // 2 way
  while(todolistTaskContainer.firstChild){
    todolistTaskContainer.removeChild(todolistTaskContainer.firstChild);
  }
  TASKLIST.map((todo, index) => {
    const div = document.createElement("div");
    div.className = `${type == "create" ? "bounce__item todolist__item": "todolist__item"}`;
    div.setAttribute("data-order-number", index);
    div.innerHTML = `
    ${todo.taskEdited ? "<small>Edited</small>" : ""}
      <strong class="${todo.taskCompleted ? 'todolist__title todolist__title--active' : 'todolist__title'}">${todo.taskName}  </strong> 
      <div class="todolist__actions">
        <button class="todolist-btn complete"> <i class="fas fa-check-circle"></i> Complete</button>
        <button class="todolist-btn edit"> <i class="fas fa-edit"></i>  Edit</button>
        <button class="todolist-btn time"> <div class="additonal__time">${todo.taskDate}/${todo.taskMonth}/${todo.taskYear}</div> <i class="fas fa-clock"></i> ${todo.taskHour} : ${todo.taskMinute}</button>
        <button class="todolist-btn delete"> <i class="fas fa-trash"></i> Delete</button>
      </div>
    `
    todolistTaskContainer.appendChild(div);
  });
}

todolistTaskContainer.addEventListener("click", (e) => {
  let t = e.target;
  let taskIndex = +t.parentElement.parentElement.dataset.orderNumber;
  let sibling = t.parentElement.previousElementSibling;
  if(t.classList.contains("complete")){
    TASKLIST[taskIndex].taskCompleted = !TASKLIST[taskIndex].taskCompleted;
    renderTasks("modify");
  }
  else if(t.classList.contains("delete")){
    t.parentElement.parentElement.classList.add("deleted");
    setTimeout(() => {
      TASKLIST.splice(taskIndex, 1);
      renderTasks("modify");
    }, 500)
  }
  else if(t.classList.contains("edit")){
    sibling.setAttribute("contenteditable", true);
    sibling.style = "border: 1px solid gray; padding-left: 5px;"
    t.innerHTML = '<i class="fas fa-check-double"> </i> Done';
    t.classList.add("done");
    t.classList.remove("edit");
  }
  else if(t.classList.contains("done")){
    sibling.removeAttribute("contenteditable");
    t.innerHTML = '<i class="fas fa-edit"> </i> Edit';
    t.classList.remove("done");
    t.classList.add("edit");
    // NEEDS ATTENTION
    if(sibling.textContent != TASKLIST[taskIndex].taskName){
      TASKLIST[taskIndex].taskName = sibling.textContent
      TASKLIST[taskIndex].taskEdited = true;
    }
    renderTasks("modify")
  }
  else{
    console.log("btn bosilmadi ")
  }
})

clearInputBtn.addEventListener("click", () => {
  clearInput(todolistInput);
})

deleteAllBtn.addEventListener("click", () => {
  while(TASKLIST[0]){
    TASKLIST.splice(0, 1);
  }
  // OPTIONAL SLOWING
  renderTasks();
})


function clearInput(inp){
  inp.value = ""
}

function addZeroToTime(time){
  return String(time).padStart(2, "0");
}