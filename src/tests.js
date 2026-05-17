function testCases() {
  const test1 = {
    title: "Task1",
    description: "Tasking set 1",
    type: "task",
  };

  const test2 = {
    title: "Task2",
    description: "Tasking set 2",
    type: "task",
  };

  const todoCtrl = new TodoControl();
  todoCtrl.createTodo(test1);
  todoCtrl.createTodo(test2);
  console.log(todoCtrl.getTodoList());
  console.log(todoCtrl._todoCache);

  const test1ID = todoCtrl.getTodoList()[0].values.id;
  console.log(test1ID);

  todoCtrl.updateTodo(test1ID, {
    id: "1234",
    title: "Task111",
    description: "Tasking with false attempt to change id",
    type: "something else",
    some: "bullshit",
  });
  console.log(todoCtrl.getTodo(test1ID).values);

  todoCtrl.tickTodo(test1ID);
  todoCtrl.setTodoPriority(test1ID, "high");
  todoCtrl.setTodoDueDate(test1ID, "2025/5/20");
  console.log(todoCtrl.getTodo(test1ID).values);

  todoCtrl.createProject({
    title: "new project",
    type: "task",
    description: "a new project entity for testing",
  });

  const proj1ID = todoCtrl.getProjectList()[0].values.id;
  const test2ID = todoCtrl.getTodoList()[1].values.id;

  todoCtrl.createTodo(
    {
      title: "Hello",
      description: "World",
      type: "task",
      "false attribute": "I should not exist",
    },
    proj1ID,
  );

  todoCtrl.addTodo2Project(test1ID, proj1ID);
  todoCtrl.addTodo2Project(test2ID, proj1ID);
  console.log(
    `${todoCtrl.getProject(proj1ID).values.todoIDs}, size ${todoCtrl.getProject(proj1ID).size}`,
  );

  todoCtrl.updateProjectInfo(proj1ID, {
    title: "New project",
    type: "task",
    description: "A New Task Project Entity For Testing",
  });
  console.log(todoCtrl.getProject(proj1ID).values);

  // const toDelete = todoCtrl.getTodoList().at(-1).values.id;
  todoCtrl.deleteTodo(test1ID);
  console.log(
    `${todoCtrl.getProject(proj1ID).values.todoIDs}, size ${todoCtrl.getProject(proj1ID).size}`,
  );
  console.log(todoCtrl._todoCache);

  todoCtrl.createTodo({
    title: "checklist 1",
    description: "I am a checklist",
    type: "checklist",
    isComplete: false,
    dueDate: "2026/5/21",
    priority: "middle",
  });

  const checklist1 = todoCtrl.getTodoList("checklist")[0];

  checklist1.addListItem("Item 1");
  checklist1.addListItem("Item 2");
  checklist1.addListItem("Item 3");

  console.log(todoCtrl.getTodoList("checklist")[0].values);
  console.log(todoCtrl.getTodoList("checklist")[0].size());

  console.log(checklist1.getListItem(0).item_name);
  checklist1.renameListItem(0, "Renamed Item 1");
  console.log(checklist1.getListItem(0).item_name);

  console.log(checklist1.getListItem(1).checkStatus);
  checklist1.checkListItem(1);
  console.log(checklist1.getListItem(1).checkStatus);

  checklist1.removeListItem(2);
  checklist1.values = { description: "I am THE checklist" };
  console.log(todoCtrl.getTodoList("checklist")[0].values);

  todoCtrl.createTodo({
    title: "Note 1",
    description: "I am a note",
    type: "note",
  });

  const note1 = todoCtrl.getTodoList("note")[0];
  todoCtrl.updateTodo(note1.values.id, {
    type: "something else",
    title: "A great note",
    description: "What a Great Note!",
  });
  console.log(note1.values);

  todoCtrl.createProject({
    title: "Note project",
    type: "note",
    description: "A new project entity for note",
  });

  todoCtrl.createProject({
    title: "Checklist project",
    type: "checklist",
    description: "A new project entity for checklist",
  });

  const noteProj = todoCtrl.getProjectList("note")[0];
  const checklistProj = todoCtrl.getProjectList("checklist")[0];

  todoCtrl.addTodo2Project(note1.values.id, noteProj.values.id);
  todoCtrl.addTodo2Project(checklist1.values.id, checklistProj.values.id);

  console.log(todoCtrl);

  todoCtrl.deleteProject(noteProj.values.id);

  todoCtrl.saveToLocalStorage();
  todoCtrl.loadFromLocalStorage();

  console.log(todoCtrl.getProjectList());
  console.log(todoCtrl.getTodoList());
}

export default testCases;
