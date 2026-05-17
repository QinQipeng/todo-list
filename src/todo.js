import { format } from "date-fns";

function baseAttribute({ id, title, description }) {
  return {
    _id: id ?? crypto.randomUUID(),
    _title: title ?? "",
    _description: description ?? "",
    _createDate: format(new Date(), "yyyy-MM-dd"),
  };
}

function getter(todo_obj) {
  return function () {
    return JSON.parse(JSON.stringify(todo_obj).replaceAll("_", "")); // Trim the prefix and filter out functions
  };
}

function setter(todo_obj) {
  return function (data_obj) {
    Object.entries(data_obj).forEach(
      ([key, value]) => (todo_obj[`_${key}`] = value),
    );
  };
}

function Task({ id, title, description, isComplete, dueDate, priority }) {
  const task_obj = {
    _isComplete: isComplete ?? false,
    _dueDate: dueDate ?? "",
    _priority: priority ?? "none",
    _type: "task",

    setPriority: (priority) => {
      task_obj._priority = priority;
    },
    tickout: () => {
      task_obj._isComplete = !task_obj._isComplete;
    },
    setDueDate: (dateObj) => {
      task_obj._dueDate = format(dateObj, "yyyy-MM-dd");
    },
  };

  Object.assign(
    task_obj,
    baseAttribute({ id: id, title: title, description: description }),
  );

  Object.defineProperty(task_obj, "values", {
    get: getter(task_obj),
    set: setter(task_obj),
  });

  return task_obj;
}

function Note({ id, title, description }) {
  const note_obj = {
    _type: "note",
  };

  Object.assign(
    note_obj,
    baseAttribute({ id: id, title: title, description: description }),
  );

  Object.defineProperty(note_obj, "values", {
    get: getter(note_obj),
    set: setter(note_obj),
  });

  return note_obj;
}

function CheckList({ id, title, description, isComplete, dueDate, priority, length, checkList }) {
  const checklist_obj = {
    _length: length ?? 0,
    _checkList: checkList ?? [],
  };

  const checkListFunc = function (checklist) {
    return {
      addListItem: (name) => {
        const listItem = {
          item_ID: checklist._length++,
          item_name: name,
          checkStatus: false,
        };

        checklist._checkList.push(listItem);
      },
      getListItem: (id) => {
        return checklist._checkList[id];
      },
      removeListItem: (id) => {
        checklist._checkList.splice(id, 1);
        checklist._length--;
      },
      renameListItem: (id, newName) => {
        checklist._checkList[id].item_name = newName;
      },
      checkListItem: (id) => {
        let current = checklist._checkList[id].checkStatus;
        checklist._checkList[id].checkStatus = !current;
      },
      size: () => checklist._length,
    };
  };

  Object.assign(
    checklist_obj,
    Task({
      id: id,
      title: title,
      description: description,
      isComplete: isComplete,
      dueDate: dueDate,
      priority: priority,
    }),
    checkListFunc(checklist_obj),
    {
      _type: "checklist",
    },
  );

  Object.defineProperty(checklist_obj, "values", {
    get: getter(checklist_obj),
    set: setter(checklist_obj),
  });

  return checklist_obj;
}

export default { task: Task, note: Note, checklist: CheckList };

// Deprecated structure of todos
// class baseAttribute {
//     constructor(data_obj) {
//         this._id = data_obj.id ?? crypto.randomUUID();
//         this._title = data_obj.title ?? undefined;
//         this._description = data_obj.description ?? undefined;
//         this._type = data_obj.type ?? undefined;
//     }

// get values() {
//     const returnObject = {}
//     Object.keys(this).forEach(key => {
//         returnObject[key.slice(1)] = this[key];
//     })
//     return returnObject;
// }

// set values(data_obj) {
//     const validKeys = Object.keys(this.values);
//     Object.entries(data_obj).forEach(([key, value]) => {
//         if(validKeys.includes(key) && key != "id"){
//             this[`_${key}`] = value;
//         }
//     })
// }
// }

// class Task extends baseAttribute{
//     constructor(data_obj) {
//         super(data_obj);
//         this._isComplete = data_obj.isComplete,
//         this._dueDate    = data_obj.dueDate,
//         this._priority   = data_obj.priority,
//         super._type      = "task"
//     }
// }

// class Note extends baseAttribute{
//     constructor(data_obj) {
//         super(data_obj);
//         super._type = "note"
//     }
// }

// class CheckList extends Task {
//     constructor(data_obj) {
//         super(data_obj);
//         super._type = "checklist";
//         this._length = 0;
//         this._checkList = [];
//     }

//     addListItem(name) {
//         const listItem = {
//             _item_ID:    this._length++,
//             item_name:  name,
//             checkStatus:    false,
//         }

//         Object.defineProperty(listItem,"values",{
//             get() {
//                 return {
//                     "item_name": this.item_name,
//                     "isChecked": this.checkStatus
//                 }
//             },

//             set(newData) {
//                 const [[key, value]] = Object.entries(newData)
//                 this[key] = value
//             }
//         })

//         this._checkList.push(listItem)
//     }

//     getListItem(id) {
//         return this._checkList.find((item) => item._item_ID == id);
//     }

//     removeListItem(id) {
//         this._checkList.splice(id, 1);
//         this._length--;
//     }

//     renameListItem(id, newName) {
//         this._checkList.at(id).values = {"item_name":newName}
//     }

//     checkListItem(id) {
//         this._checkList.at(id).values = {"checkStatus":true}
//     }

// }

// export {Task, Note, CheckList}
