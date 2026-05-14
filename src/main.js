import "./styles.css";
// import { Task, CheckList} from "./todos.js";
import { Task, Note, CheckList} from "./todos.js";
import Project from "./project.js";

const task = Task({
    "title":       "Task1",
    "description": "Tasking set 1",
});

// console.log(task.values)

const task2 = Task({
    "title":       "Task2",
    "description": "Tasking set 2",
})

// console.log(task2.values)

// task.values = {
//     "title": "Hello",
//     "description": "World"
// }

// console.log(task.values)

// task.tickout()

// console.log(task.values)

// task.tickout()

// console.log(task.values)

// task.setDueDate("2026-05-05")

// console.log(task.values.dueDate.toDateString())


// const test2 = {
//     "id":           "1234",
//     "title":        "Task2",
//     "description":  "Tasking with false attempt to change id",
// }

// task.values = test2;
// console.log(task.values["id"]);

const test3 = {
    "title":            "Task3",
    "description":      "Tasking with attempt to add attribute that don't belong",
    "false attribute":  "I should not exist"
}

const task3 = Task(test3)

// task.values = test3;
// console.log(task.values);

const listObject = CheckList({
    title:"check1", 
    description:"I am a checklist", 
    type:"none",
    isComplete: false,
    dueDate: new Date(),
    priority: "none"
})

listObject.addListItem("Item 1")
listObject.addListItem("Item 2")
listObject.addListItem("Item 3")
// console.log(listObject.values)
// console.log(listObject.size())

// console.log(listObject.getListItem(0).item_name)
// listObject.renameListItem(0,"Renamed Item 1")
// console.log(listObject.getListItem(0).item_name)

// console.log(listObject.getListItem(1).checked)
// listObject.checkListItem(1)
// console.log(listObject.getListItem(1).checked)

// listObject.removeListItem(2)
// console.log(listObject.size())

const note1 = Note({
    "title": "Note 1",
    "description":  "I am a note"
})

// console.log(note1.values)

// note1.values = {"type": "something else", "title":"a great note", "description": "what a great note!"}
// console.log(note1.values)

const project = new Project({
    title: "new project",
    type:  "Task",
    description: "a new project entity for testing"
});

console.log(project.values);

project.values = {
    id: "adwadawdas",
    something: "something something",
    title: "New Project",
    description: "A New Project Entity for Tasking"
};

console.log(project.values);

project.addTodo(task);
console.log(project.todos[0] == task.values.id)

project.addTodo(task2)
project.addTodo(task3)
project.addTodo(note1)
console.log(project.todos);

console.log(project.containsTodo(note1))
project.removeTodo(task3)
console.log(project.todos);
