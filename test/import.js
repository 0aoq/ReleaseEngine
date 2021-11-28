// ReleaseEngine uses RequireJS by default to require javascript files
require(["https://re-compiled.vercel.app/ReleaseEngine.js"], function(engine) {
    engine.setUrl("./")
    engine.newFile("file.js", "javascript", { doCallstack: false })
    engine.newFile("file.html", "html", { placement: "start", doCallstack: false })
    engine.newFile("file.html", "html", { placement: "beforeend", doCallstack: false })
})