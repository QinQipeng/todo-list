class Project {
  constructor({ id, title, type, description }) {
    this._id_ = id ?? crypto.randomUUID();
    this._description = description;
    this._title = title ?? "";
    this._type_ = type ?? "";
    this._todoIDs_ = [];
    this._creationDate_ = new Date();
  }

  get values() {
    const returnObject = {};
    Object.keys(this).forEach((key) => {
      returnObject[key.split("_").join("")] = this[key];
    });
    return returnthis;
  }

  set values(data_obj) {
    const validKeys = Object.keys(this).filter((key) => key.slice(-1) != "_");

  Object.entries(data_obj).forEach(([key, value]) => {
    key = `_${key}`;
    if (validKeys.includes(key)) {
      this[`_${key}`] = value;
    }
  });
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
    if (toRemove != -1) this._todoIDs.splice(this.getTodoIndex(toRemove), 1);
  }

  containsTodo(id) {
    if (!(todo_obj && todo_obj?.values)) return false;

    return this.getTodoIndex(todo_obj.id) != -1;
  }
}

export default Project;
