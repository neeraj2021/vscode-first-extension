// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";

async function getAllTodos(num: string) {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/todos/${num}`
  );
  return data;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "my-first-extension" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "my-first-extension.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from My First Extension!"
      );
    }
  );

  context.subscriptions.push(disposable);

  const getTodo = vscode.commands.registerCommand(
    "my-first-extension.getTodo",
    async () => {
      const editor = vscode.window.activeTextEditor;

      const inputNum = await vscode.window.showInputBox({
        title: "Enter Number",
        placeHolder: "Enter Number between 1 to 200",
        validateInput: (value) => {
          const num = Number(value);

          if (isNaN(num)) {
            return "Error: Invalid Input.";
          }

          if (num < 1 || num > 200) {
            return "Error: Number range should be in 1 to 200";
          }
          return null;
        },
      });

      if (!inputNum) {
        return;
      }

      const todo = await getAllTodos(inputNum);

      if (editor) {
        const selection = editor.selection.start;
        editor.edit((editBuilder) => {
          editBuilder.insert(selection, `// ${JSON.stringify(todo)}`);
          const position = editor.selection.active;

          const newPos = position.with(position.line + 1, 0);
          editor.selection = new vscode.Selection(newPos, newPos);
        });
      } else {
        vscode.window.showErrorMessage("No editor is selected");
      }
      console.log("Print complete");
    }
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
