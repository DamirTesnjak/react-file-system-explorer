const initialValues = {
  currentPath: '',        // holds the current path of a visited folder
  itemId: '',
  visitedPaths: [],       // holds zhe array of visited paths during the session
  currentPosition: 0,     // used as index in "visitedPaths" to get prevous visited path when navigating back in "history"
  expandedItems: [],      // holds value of all expanded items in "TreeView"
  selectedItem: null,     // holds the data of a selected item after one click
  selectedFolder: null,   // holds the data of a selected folder after one click
  itemType: null,         // type of selected item, "folder" or "file" as string
  doubleClick: 0,         // used to detect when double click happens
  folderData: [],         // contains array of item to be displayed in window
  action: '',             // action "copy", "paste", "delete", "create"
  error: null,            // hold any kind off error to be displayed on screen, when something goes wrong
};

const resetedValues = {
  selectedItemFile: null,
  selectedItem: null,
  action: "",
  itemType: null,
  folderData: [],
  moveToPath: null,
};

const ACTIONS = {
  copy: "copy",
  paste: "paste",
  delete: "delete",
  moveTo: "moveTo",
  createFolder: "createFolder",
};

const COMPUTER = 'Computer'

export {
  ACTIONS,
  COMPUTER,
  initialValues,
  resetedValues,
};