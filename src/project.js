class Project {
  constructor({ id, title, type, description }) {
    this._id = id ?? crypto.randomUUID();
    this._description = description;
    this._title = title ?? "";
    this._type = type ?? "";
    this._todoIDs = [];
    this._createDate = new Date();
  }

  get values() {
    Object.fromEntries(
      Object.entries(this).map((keyValue) => [
        keyValue[0].slice(1),
        keyValue[1],
      ]),
    );
  }

  set values(data_obj) {
    Object.entries(data_obj).forEach(
      ([key, value]) => (todo_obj[`_${key}`] = value),
    );
  }

  get size() {
    return this._todoIDs.length;
  }

  get todos() {
    return [...this._todoIDs];
  }

  addTodo(id) {
    this._todoIDs.push(id);
  }

  getTodoIndex(id) {
    return this._todoIDs.indexOf(id);
  }

  removeTodo(id) {
    const toRemove = this.getTodoIndex(todo_obj);
    if (toRemove != -1) this._todoIDs.splice(toRemove, 1);
  }

  containsTodo(id) {
    if (!(todo_obj && todo_obj?.values)) return false;

    return this.getTodoIndex(todo_obj.id) != -1;
  }
}

export default Project;
