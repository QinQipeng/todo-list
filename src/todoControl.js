import {
  MissingTypeError,
  TypeMismatchError,
  InvalidTypeError,
} from "./errors.js";
import Todo from "./todo.js";
import Project from "./project.js";

class todoControl {
  constructor() {
    this._projectCache = {};
    this._todoCache = {};
    this._validTodos = Object.keys(Todo);
    this._readOnlyKeys = ["id", "createDate", "type"]; // Default set of read-only keys
  }

  _filterData(dataObj, validKeys) {
    return Object.fromEntries(
      Object.entries(dataObj).filter((keyValue) =>
        validKeys.includes(keyValue[0]),
      ),
    );
  }

  // todo methods
  createTodo(dataObj, proj_id = "") {
    if (!dataObj?.type)
      throw new MissingTypeError("Specifying type for todo is a must");
    if (!this._validTodos.includes(dataObj.type))
      throw new InvalidTypeError(
        "Invalid todo type (must be either task, note, or checklist)",
      );

    const newTodo = Todo[dataObj.type](dataObj);
    this._todoCache[newTodo.values.id] = newTodo;

    if (proj_id && this._projectCache[proj_id]) {
      if (this._projectCache[proj_id] && dataObj.type != proj?.type)
        throw new TypeMismatchError("todo must match with project in type");
      else this._projectCache[proj_id].addTodo(newTodo);
    }
  }

  deleteTodo(id) {
    if (this.getTodo(id) == undefined) return;

    const targeted_proj = Object.values(this._projectCache)
      .filter((proj) => proj.containsTodo(id))
      .map((proj) => proj.removeTodo(id));

    delete this._todoCache[id];
  }

  updateTodo(id, new_data) {
    if (this.getTodo(id) == undefined) return;

    const validKeys = Object.keys(this.getTodo(id).values).filter((key) =>
      !this._readOnlyKeys.includes(key),
    );
    this._todoCache[id].values = this._filterData(new_data, validKeys);
  }

  getTodo(id) {
    return this._todoCache[id];
  }

  tickTodo(id) {
    if (!this.getTodo(id).values?.isComplete) return

    this._todoCache[id].tickout();
  }

  setTodoDueDate(id, dateStr) {
    if (!this.getTodo(id).values?.dueDate) return

    const newDate = new Date(dateStr);
    if(!isNaN(newDate)){
      this._todoCache[id].setDueDate(newDate);
    }
  }

  setPriority(id, priorStr) {
    if (!this.getTodo(id).values?.priority) return

    const priorTypes = ["none", "low", "middle", "high"];
    if(priorTypes.includes(priorStr)) {
      this._todoCache[id].setPriority(priorStr);
    }
  }

  getTodoList(id, type = "all") {
    const todoList = Object.values(this._todoCache);

    if (type == "all") return todoList;
    else return todoList.filter((todo) => todo.type == type);
  }

  // project methods
  createProject(data) {
    if (!(data && data?.type))
      throw new MissingTypeError("Specifying type for project is a must");

    if (!this._validTodos.includes(dataObj))
      throw new InvalidTypeError(
        "Invalid project type (must be either task, note, or checklist)",
      );

    const newProj = new Project(data);
    this._projectCache[newProj.values.id] = newProj;
  }

  getProject(id) {
    return this._projectCache[id];
  }

  deleteProject(id) {
    if (this.getProject(id) == undefined) return;

    delete this._projectCache[id];
  }

  updateProjectInfo(id, new_data) {
    if (this.getProject(id) == undefined) return;

    const validKeys = Object.keys(this.getProject(id).values).filter((key) =>
      !this._readOnlyKeys.includes(key),
    );
    this._projectCache[id].values = this._filterData(new_data, validKeys);
  }

  addTodo2Project(todoID, projID) {
    if (
      this.getProject(projID) == undefined ||
      this.getTodo(todoID) == undefined
    )
      return;

    if (this.getProject(projID).type != this.getTodo(todoID).type)
      throw new TypeMismatchError("todo must match with project in type");

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

  getProjectList(type = all) {
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
      this._projectCache = JSON.parse(localStorage.getItem("projectCache"));

    if (localStorage.getItem("todoCache"))
      this._todoCache = JSON.parse(localStorage.getItem("todoCache"));
  }
}

export default todoControl;
