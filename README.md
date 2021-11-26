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

## Notes
- Uses [RequireJS](https://github.com/requirejs/requirejs) for module requiring, and requires a basic understanding of the RequireJS syntax to be used properly.