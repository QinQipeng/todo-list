import {
  MissingTypeError,
  TypeMismatchError,
  InvalidTypeError,
} from "./errors";
import { Task, Note, CheckList } from "./todo";
import Project from "./project";

class todoControl {
  constructor() {
    this._projectCache = {};
    this._todoCache = {};
  }

  // todo methods
  createTodo(data, proj_id = "") {
    if (!data?.type)
      throw MissingTypeError("Specifying type for todo is a must");

    let newTodo = {};

    switch (data.type) {
      case "task": {
        newTodo = Task(data);
        break;
      }
      case "note": {
        newTodo = Note(data);
        break;
      }
      case "checklist": {
        newTodo = CheckList(data);
        break;
      }
      default:
        throw InvalidTypeError(
          "invalid todo type (must be either task, note, or checklist)",
        );
    }

    this._todoCache[newTodo.values.id] = newTodo;

    if (proj_id && this._projectCache[proj_id]) {
      if (this._projectCache[proj_id] && data.type != proj?.type)
        throw TypeMismatchError("todo must match with project in type");
      else this._projectCache[proj_id].addTodo(newTodo);
    }
  }

  deleteTodo(id) {
    if (this.getTodo[id] == undefined) return;

    const targeted_proj = Object.values(this._projectCache)
      .filter((proj) => proj.containsTodo(id))
      .map((proj) => proj.removeTodo(id));

    delete this._todoCache[id];
  }

  updateTodo(id, new_data) {
    if (this.getTodo[id] == undefined) return;

    this._todoCache[id].values = new_data;
  }

  getTodo(id) {
    return this._todoCache[id];
  }

  getTodoList(id, type = "all") {
    const todoList = Object.values(this._todoCache);

    if (type == "all") return todoList;
    else return todoList.filter((todo) => todo.type == type);
  }

  // project methods
  createProject(data) {
    if (!(data && data?.type))
      throw MissingTypeError("Specifying type for project is a must");

    if (
      !(
        data?.type == "task" ||
        data?.type == "note" ||
        data?.type == "checklist"
      )
    ) {
      throw InvalidTypeError(
        "invalid todo type (must be either task, note, or checklist)",
      );
    }

    const newProj = new Project(data);
    this._projectCache[newProj.values.id] = newProj;
  }

  getProject(id) {
    return this._projectCache[id];
  }

  deleteProject(id) {
    if (this.getProject[id] == undefined) return;

    delete this._projectCache[id];
  }

  updateProjectInfo(id, new_data) {
    if (this.getProject(id) == undefined) return;

    this._projectCache[id].values = new_data;
  }

  addTodo2Project(todoID, projID) {
    if (
      this.getProject(projID) == undefined ||
      this.getTodo(todoID) == undefined
    )
      return;

    if (this.getProject(projID).type != this.getTodo(todoID).type)
      throw TypeMismatchError("todo must match with project in type");

    this._projectCache[proj_id].addTodo(this._todoCache[todoID]);
  }

  removeTodoFromProject(todoID, projeID) {
    if (
      this.getProject(projID) == undefined ||
      this.getTodo(todoID) == undefined
    )
      return;

    this._projectCache[projeID].removeTodo(todoID);
  }

  getAllProjects() {
    const projectList = Object.values(this._projectCache);

    if (type == "all") return projectList;
    else return projectList.filter((proj) => proj.type == type);
  }

  // Local Cache methods
  saveToLocalStorage() {
    localStorage.setItem("projectCache", JSON.stringify(this._projectCache));
    localStorage.setItem("todoCache", JSON.stringify(this._todoCache));
  }

  loadFromLocalStorage() {
    const reviver = (key, value) =>
      key.includes("Date") ? new Date(value) : value;

    if (localStorage.getItem("projectCache"))
      this._projectCache = JSON.parse(localStorage.getItem("projectCache"), reviver);

    if (localStorage.getItem("todoCache"))
      this._todoCache = JSON.parse(localStorage.getItem("todoCache"), reviver);
  }
}
