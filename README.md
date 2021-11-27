<h1 align="center"><b>⚙️ Release Engine 🐇</b></h1>
<h2 align="center">A simple manager for importing files into HTML documents</h2><br>

## Core Features
- Fully global variables that can be used across file types
    - Define a replacement, and then use it in multiple files
- Low cost on performance
- Simple syntax
- Syntax familiar to developers, requiring .js file to include a `main` function (optional `update` function that runs every 0.1 seconds)
- Easy HTML includes

## Usage

Setup is easy and simple, just create a file and add your imports.
```js
// test/import.js
require(["../package/compiled/ReleaseEngine.js"], function(engine) {
    engine.newFile("./file.js", "javascript")
    engine.newFile("./file.html", "html", { placement: "start" })
    engine.newFile("./file.html", "html", { placement: "beforeend" })
})
```
Then import it into your html file normally.
```html
<!-- test/index.html -->
<script src="https://requirejs.org/docs/release/2.3.6/minified/require.js"></script>
<script src="import.js" type="module"></script>
```

Inside of files, certain replacements are done automatically, such as importing other files from within files. If `doCallstack` was enabled, requiring files from within other files will cause them to be logged to the output.
```js
"path: ./myFile.js"
myFileFunction()
```
```css
/* "path: ../colors.css" */
.example {
    color: var(--color-example)
}
```
The `path` keyword should always be used instead of default import functions from the languages themselves, as those will not be traced when requiring files.

## Notes
- Uses [RequireJS](https://github.com/requirejs/requirejs) for module requiring, and requires a basic understanding of the RequireJS syntax to be used properly.