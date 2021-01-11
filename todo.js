const { log } = require("console");
const fs = require("fs");
const command = process.argv[2];
const argument = process.argv[3];
const date = new Date().toJSON().slice(0, 10);
const todosPath = "./todo.txt";
const donePath = "./done.txt";
const commands = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

//creates todo.txt & done.txt
const init = () => {
  if (!fs.existsSync(todosPath) || !fs.existsSync(donePath)) {
    fs.closeSync(fs.openSync(todosPath, "w"));
    fs.closeSync(fs.openSync(donePath, "w"));
  }
};

//appends the text files with tasks
const setList = (data, path) => {
  fs.appendFileSync(path, data + "\r\n");
};

//returns array of tasks from either todo.txt or done.txt
const getTasks = (path) => {
  const taskFile = fs.readFileSync(path, "utf-8");
  const tasks = taskFile.split("\r\n").filter((task) => task !== "");
  return tasks;
};

//checks for duplicate entries (something extra)
const checkDuplicateTask = (inputTask) => {
  const allActiveTasks = getTasks(todosPath);
  if (allActiveTasks.filter((value) => value == inputTask).length > 0) {
    return true;
  }
  return false;
};

//prints the menu
const displayMenu = () => {
  log(commands);
};

//Adds a new task to todo.txt
const addTask = (task) => {
  if (!task) {
    log("Error: Missing todo string. Nothing added!");
    return;
  }
  if (checkDuplicateTask(task)) {
    log(`Added todo: "${task}"`);
    return;
  }
  setList(task, todosPath);
  log(`Added todo: "${task}"`);
};

//reverse prints all tasks in the todo.txt file
const list = () => {
  const tasks = getTasks(todosPath);
  if (tasks.length == 0) {
    log("There are no pending todos!");
    return;
  }
  let i = tasks.length;
  tasks.reverse().map((task) => {
    log(`[${i}] ${task}`);
    i--;
  });
};

//removes task form todo.txt and adds task to done.txt
const markDone = (number) => {
  const activeTasks = getTasks(todosPath);
  const taskToMarkDone = activeTasks.find((task, index) => {
    if (index === number - 1) {
      return task;
    } else {
      return null;
    }
  });
  if (!taskToMarkDone) {
    log(`Error: todo #${number} does not exist.`);
    return;
  }
  const textToWrite = `x ${date} ${taskToMarkDone}`;
  setList(textToWrite, donePath);
  newActiveTasks = activeTasks.filter((todo) => todo !== taskToMarkDone);
  fs.unlinkSync(todosPath);
  fs.closeSync(fs.openSync(todosPath, "w"));
  newActiveTasks.map((task) => {
    setList(task, todosPath);
  });
  log(`Marked todo #${number} as done.`);
};

//deletes task from todo.txt
const deleteTask = (number) => {
  if (!number) {
    return;
  }
  const tasks = getTasks(todosPath);
  const taskToDelete = tasks.find((task, index) => {
    if (index === number - 1) {
      return task;
    } else {
      return null;
    }
  });
  if (!taskToDelete) {
    log(`Error: todo #${number} does not exist. Nothing deleted.`);
    return;
  }
  const newTasks = tasks.filter((todo) => todo !== taskToDelete);
  fs.unlinkSync(todosPath);
  fs.closeSync(fs.openSync(todosPath, "w"));
  newTasks.map((task) => {
    setList(task, todosPath);
  });
  log(`Deleted todo #${number}`);
};

//prints statistics
const printReport = () => {
  const pending = getTasks(todosPath).length;
  const completed = getTasks(donePath).length;
  log(`${date} Pending : ${pending} Completed : ${completed}`);
};

//create text files before calling other functions
init();

switch (command) {
  case "help":
    displayMenu();
    break;
  case "add":
    addTask(argument);
    break;
  case "ls":
    list();
    break;
  case "done":
    if (!argument) {
      log("Error: Missing NUMBER for marking todo as done.");
      break;
    }
    markDone(argument);
    break;
  case "del":
    if (!argument) {
      log("Error: Missing NUMBER for deleting todo.");
      break;
    }
    deleteTask(argument);
    break;
  case "report":
    printReport();
    break;
  default:
    displayMenu();
    break;
}
//thank you very much for reading this
// feedback is much appreciated
