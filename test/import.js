// ReleaseEngine uses RequireJS by default to require javascript files
require(["../package/compiled/ReleaseEngine.js"], function(engine) {
    engine.newFile("./file.js", "javascript")
    engine.newFile("./file.html", "html", { placement: "start" })
    engine.newFile("./file.html", "html", { placement: "beforeend" })
})