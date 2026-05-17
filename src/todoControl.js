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
      const isTypeMatch = this._projectCache[proj_id].values.type == newTodo.values.type
      if (!isTypeMatch)
        throw new TypeMismatchError("todo must match with project in type");

      this._projectCache[proj_id].addTodo(newTodo.values.id);
    }
  }

  deleteTodo(id) {
    if (this.getTodo(id) == undefined) return;

    const targeted_proj = Object.keys(this._projectCache).forEach(projID => {
      this.removeTodoFromProject(id, projID)
    })

    delete this._todoCache[id];
  }

  updateTodo(id, newData) {
    if (this.getTodo(id) == undefined) return;

    const validKeys = Object.keys(this.getTodo(id).values).filter(
      (key) => !this._readOnlyKeys.includes(key),
    );
    this._todoCache[id].values = this._filterData(newData, validKeys);
  }

  getTodo(id) {
    return this._todoCache[id];
  }

  tickTodo(id) {
    if (!this.getTodo(id)?.values?.isComplete === "undefined") return;

    this._todoCache[id].tickout();
  }

  setTodoDueDate(id, dateStr) {
    if (!this.getTodo(id)?.values?.dueDate === "undefined") return;

    const newDate = new Date(dateStr);
    if (!isNaN(newDate)) {
      this._todoCache[id].setDueDate(newDate);
    }
  }

  setTodoPriority(id, priorStr) {
    if (!this.getTodo(id)?.values?.priority) return;

    const priorTypes = ["none", "low", "middle", "high"];
    if (priorTypes.includes(priorStr)) {
      this._todoCache[id].setPriority(priorStr);
    }
  }

  getTodoList(type = "all") {
    const todoList = Object.values(this._todoCache);

    if (type == "all") return todoList;
    else return todoList.filter((todo) => todo.values.type == type);
  }

  // project methods
  createProject(dataObj) {
    if (!(dataObj && dataObj?.type))
      throw new MissingTypeError("Specifying type for project is a must");

    if (!this._validTodos.includes(dataObj.type))
      throw new InvalidTypeError(
        "Invalid project type (must be either task, note, or checklist)",
      );

    const newProj = new Project(dataObj);
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

    const validKeys = Object.keys(this.getProject(id).values).filter(
      (key) => !this._readOnlyKeys.includes(key),
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

    if(this.getProject(projID).containsTodo(todoID)) return;

    this._projectCache[projID].addTodo(this._todoCache[todoID].values.id);
  }

  removeTodoFromProject(todoID, projID) {
    if (
      this.getProject(projID) == undefined ||
      this.getTodo(todoID) == undefined
    )
      return;

    this._projectCache[projID].removeTodo(todoID);
  }

  getProjectList(type = "all") {
    const projectList = Object.values(this._projectCache);

    if (type == "all") return projectList;
    else return projectList.filter((proj) => proj.values.type == type);
  }

  // Local Cache methods
  saveToLocalStorage() {
    const storeCache = function (cache, cacheName) {
      const cacheList = Object.values(cache).map(
        (cacheItem) => (cacheItem = cacheItem.values),
      );
      localStorage.setItem(cacheName, JSON.stringify(cacheList));
    };

    storeCache(this._projectCache, "projCache");
    storeCache(this._todoCache, "todoCache");
  }

  loadFromLocalStorage() {
    const loadCache = function (cacheName) {
      let cache = JSON.parse(localStorage.getItem(cacheName));
      cache = cache.map((cacheItem) => [
          cacheItem.id,
          cacheName == "projCache"
            ? new Project(cacheItem)
            : Todo[cacheItem.type](cacheItem),
        ]);
      return Object.fromEntries(cache);
    };

    this._projectCache = loadCache("projCache");
    this._todoCache = loadCache("todoCache");
  }
}

export default todoControl;
