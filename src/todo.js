function baseAttribute({ id, title, description }) {
  return {
    _id_: id ?? crypto.randomUUID(),
    _title: title ?? "",
    _description: description ?? "",
    _creationDate_: new Date(),
  };
}

function getter(attributes) {
  return function () {
    const returnObject = {};
    Object.keys(attributes).forEach((key) => {
      if (typeof attributes[key] != "function")
        returnObject[key.split("_").join("")] = attributes[key];
    });
    return returnObject;
  };
}

function setter(attributes) {
  const validKeys = Object.keys(attributes).filter(
    (key) => key.slice(-1) != "_" && typeof attributes[key] != "function",
  );

  return function (data_obj) {
    Object.entries(data_obj).forEach(([key, value]) => {
      key = `_${key}`;
      if (validKeys.includes(key)) {
        attributes[key] = value;
      }
    });
  };
}

function Task({ id, title, description, isComplete, dueDate, priority }) {
  const task_obj = {
    _isComplete: isComplete ?? false,
    _dueDate: dueDate,
    _priority: priority ?? "none",
    _type_: "task",

    setPriority: (priority) => {
      switch (priority) {
        case 3:
          task_obj._priority = "high";
        case 2:
          task_obj._priority = "medium";
        case 1:
          task_obj._priority = "low";
        default:
          task_obj._priority = "none";
      }
    },
    tickout: () => {
      task_obj._isComplete =
        task_obj._isComplete == undefined ? true : !task_obj._isComplete;
    },
    setDueDate: (dateString) => {
      task_obj._dueDate = new Date(dateString);
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
    _type_: "note",
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

function CheckList({ id, title, description, isComplete, dueDate, priority }) {
  const checklist_obj = {
    _length: 0,
    _checkList: [],
  };

  const checkListFunc = function (checklist) {
    return {
      addListItem: (name) => {
        const listItem = {
          item_ID: checklist._length++,
          item_name: name,
          checked: false,
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
        let current = checklist._checkList[id].checked;
        checklist._checkList[id].checked = !current;
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
      _type_: "checklist",
    },
  );

  Object.defineProperty(checklist_obj, "values", {
    get: getter(checklist_obj),
    set: setter(checklist_obj),
  });

  return checklist_obj;
}

export { Task, Note, CheckList };

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
//             checked:    false,
//         }

//         Object.defineProperty(listItem,"values",{
//             get() {
//                 return {
//                     "item_name": this.item_name,
//                     "isChecked": this.checked
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
//         this._checkList.at(id).values = {"checked":true}
//     }

// }

// export {Task, Note, CheckList}
