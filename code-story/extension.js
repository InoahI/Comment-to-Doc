// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { todo } = require('node:test');
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "code-story" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json



    let disposableGenerateComment = vscode.commands.registerCommand('code-story.generateCommentChapter', () => {
        generateCommentBlock("chapter");
    });
    context.subscriptions.push(disposableGenerateComment);

    let disposableGenerateHead = vscode.commands.registerCommand('code-story.generateCommentHead', () => {
        generateCommentBlock("head");
    });
    context.subscriptions.push(disposableGenerateHead);



    let disposable_read_comment_block = vscode.commands.registerCommand('code-story.readSpecificCommentBlock', () => {
        readSpecificCommentBlock();
    });

    context.subscriptions.push(disposable_read_comment_block);

    let exportToPDFDisposable = vscode.commands.registerCommand('code-story.exportToPDF', () => {
        //vscode.window.showInformationMessage('Hello World from code story!');
        exportToPDF(html);
    });
    context.subscriptions.push(exportToPDFDisposable);
		  // Register a command to save the WebViewPanel as a .txt file
    context.subscriptions.push(vscode.commands.registerCommand('code-story.saveWebViewAsTxt', () => {
	saveWebViewPanelAsTxt(html);
    }));

    

    


    
    

}
var html = 0; 
// var html = ""
function readSpecificCommentBlock() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found!');
        return;
    }

    const document = editor.document;
    const text = document.getText();

    // Use regex to find the book name and all specific comment blocks in the Python file
    const bookNameRegex = /'''=====Book:\s*(.*?)====='''/;
    const commentBlockRegex = /'''=====chapter\s*([\s\S]*?)=====(.*?)=====end====='''/gs;

    const bookNameMatch = text.match(bookNameRegex);
    const commentBlocks = text.matchAll(commentBlockRegex);

    if (!bookNameMatch || !commentBlocks) {
        vscode.window.showInformationMessage('No specific comment blocks or book name found in the document.');
        return;
    }

    const bookName = bookNameMatch[1].trim();
    const comments = [];

    for (const match of commentBlocks) {
        const chapterName = match[1].trim();
        const commentBlockContent = match[2].trim();

        comments.push({
            chapterName: chapterName,
            content: commentBlockContent,
        });
    }



    const panel = vscode.window.createWebviewPanel(
        'specificCommentBlockReader', // Unique ID
        `Specific Comment Blocks - ${bookName}`, // Title with book name
        vscode.ViewColumn.One, // Editor column to show the panel
        {}
    );

    // Set initial HTML content to the webview panel
    panel.webview.html = getWebviewContent(bookName, comments);

    // // Listen for changes in the active text document (Python file)
    // const docChangeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
    //     if (event.document === document) {
    //         // If the active text document changes, update the comments and book name
    //         const updatedText = event.document.getText();
    //         const updatedBookNameMatch = updatedText.match(bookNameRegex);
    //         const updatedCommentBlocks = updatedText.matchAll(commentBlockRegex);

    //         if (updatedBookNameMatch && updatedCommentBlocks) {
    //             const updatedBookName = updatedBookNameMatch[1].trim();
    //             const updatedComments = [];

    //             for (const match of updatedCommentBlocks) {
    //                 const chapterName = match[1].trim();
    //                 const commentBlockContent = match[2].trim();

    //                 updatedComments.push({
    //                     chapterName: chapterName,
    //                     content: commentBlockContent,
    //                 });
    //             }

    //             // Update the webview content with the new book name and comments
    //             panel.webview.html = getWebviewContent(updatedBookName, updatedComments);
    //         }
    //     }
    // });

    // // Store the disposable in the context to be disposed of when the webview is closed
    // context.subscriptions.push(docChangeDisposable);




    
}


function getWebviewContent(bookName, comments) {
    return `
    <!DOCTYPE html>
    <html>
    <body>
        <h2>Book Name: ${bookName}</h2>
        ${comments.map((comment, index) => `
        <h3>${comment.chapterName}:</h3>
        <ul>
            ${comment.content.split('\n').map(line => `<li>${escapeHtml(line.trim())}</li>`).join('')}
        </ul>
        `).join('')}
    </body>
    </html>`;
}



function exportToPDF(htmlContent) {
    vscode.window.showSaveDialog({
        filters: {
            PDF: ['pdf']
        }
    }).then(uri => {
        if (!uri) {
            return;
        }

        const htmlFilePath = path.join(vscode.workspace.rootPath, 'temp.html');

        // Save the HTML content to a temporary file
        fs.writeFile(htmlFilePath, htmlContent, (err) => {
            if (err) {
                vscode.window.showErrorMessage('Failed to save the HTML file.');
                return;
            }

            // Execute the built-in "export to PDF" command
            vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Active, 'Exported Specific Comment Blocks').then(() => {
                fs.unlinkSync(htmlFilePath); // Delete the temporary HTML file after exporting to PDF
            });
        });
    });
}

// have bug, save as txt file but only return empty txt
function saveWebViewPanelAsTxt(plainText) {  
	  // Show a save dialog to let the user choose the file path
	  vscode.window.showSaveDialog({
		filters: {
		  Text: ['txt']
		}
	  }).then(uri => {
		if (uri) {
		  // Write the plain text content to the chosen file path
		  vscode.workspace.fs.writeFile(uri, plainText).then(() => {
			vscode.window.showInformationMessage('Text file saved successfully!');
		  }, error => {
			vscode.window.showErrorMessage('Failed to save text file: ' + error.message);
		  });
		}
	  });
	}


	


//TODO: change to activate when press command+c+s /ctrl+c+s 
function generateCommentBlock(block_name) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found!');
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const cursorPosition = selection.active;

    const lineText = document.lineAt(cursorPosition.line).text;
    const indentation = lineText.match(/^\s*/)[0]; // Get the indentation of the current line
    // Generate a comment block with a placeholder
    if (block_name == "chapter"){
        var commentBlock = `'''=====chapter:=====\n \n${indentation}   =====end====='''\n`;}
    else{
        var commentBlock = `'''=====Book:====='''\n`;

    }


    // Insert the comment block at the current cursor position
    editor.edit(editBuilder => {
        editBuilder.insert(cursorPosition, commentBlock);
    });
}





// Function to escape HTML characters
function escapeHtml(html) {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
