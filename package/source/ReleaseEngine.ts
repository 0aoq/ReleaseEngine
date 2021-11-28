let __url = ""
let replacements = [
    { start: '"test loaded"', end: 'console.log("Loaded document.")' },
    { start: '!;', end: '!important;' }
]

// files--
type BlobType = 'text/javascript' | 'text/css' | 'text/html' | 'text/plaintext'
const file = {
    RunReplacements: (fetchedDocument) => {
        for (let replacement of replacements) { // replace the data
            fetchedDocument = fetchedDocument.replaceAll(replacement.start, replacement.end)
        }; return fetchedDocument
    },
    DetermineFinalPath: (path: string) => {
        let finalUrl = path
        if (!finalUrl.startsWith("https://")) { finalUrl = `${__url}/${path}` }
        return finalUrl
    },
    Blobify: (data: string, type: BlobType) => {
        // create a blob url
        const blob = new Blob([data], { type })
        return URL.createObjectURL(blob)
    },
    GetFile: function (path: string, callback: any) {
        // fetch the file and return it to the caller
        fetch(path)
            .then(response => response.text())
            .then(data => callback(data))
    },
    LoadFile: function (path: string, type: BlobType, extraOptions: any = { placement: "beforeend", doCallstack: true }) {
        file.GetFile(path, (fetchedDocument) => {
            extraOptions.doCallstack = extraOptions.doCallstack ?? true
            fetchedDocument = file.RunReplacements(fetchedDocument)
            fetchedDocument.split(/\n?\r/).forEach(ln => {
                // base for including a "path: ../PATH/IMPORT" in files, and causing them to be indexed too
                let spl = ln.split('"path: ')
                if (spl[1]) { spl = spl[1] } else { return }; spl = spl.split('"')[0]
                if (spl !== undefined) {
                    if (extraOptions.doCallstack) {
                        console.log("ReleaseEngine Callstack:"); console.table({ caller: path, called: spl })
                    }

                    let __fileUrl = ""
                    file.GetFile(file.DetermineFinalPath(spl), (temp_file) => {
                        temp_file = file.RunReplacements(temp_file); __fileUrl = file.Blobify(temp_file, type)
                        fetchedDocument = fetchedDocument.replaceAll(
                            ln,
                            ln.replaceAll(`"path: ${spl}"`, `"${__fileUrl}"`)
                        ); file.LoadFile(__fileUrl, type, extraOptions)
                    })
                }
            })

            setTimeout(() => {
                const fileUrl = file.Blobify(fetchedDocument, type) // create a url
                window.sessionStorage.clear() // clear the session storage
                window.sessionStorage.setItem(path, fileUrl) // store the url in session storage
                switch (type) { // determine what to import and how to import it
                    case "text/css": // stylesheets
                        document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="${fileUrl}" class="__ReleaseEngine">`); break
                    case "text/html": // html markup
                        if (extraOptions.placement === "start") {
                            document.body.innerHTML = `<document><!-- alt: ${fileUrl} -->\n${fetchedDocument}</document>` + document.body.innerHTML
                        } else {
                            document.body.insertAdjacentHTML(extraOptions.placement ?? "beforeend", `
                        <document><!-- alt: ${fileUrl} -->\n${fetchedDocument}</document>`)
                        }; break
                    case "text/javascript": // javascript files
                        require([fileUrl], function ($) {
                            $.main(__url) // run the file's main function once
                            if ($.update) {
                                setInterval($.update, 1) // run the file's update function every frame (0.1s)
                            }
                        })

                        break
                    default: // non-standard type
                        document.head.insertAdjacentHTML("beforeend", `
                    <script type="${type}" class="__ReleaseEngine"><!-- alt: ${fileUrl} -->\n${fetchedDocument}</script>`); break
                }

                return fileUrl
            }, 100);
        })
    }
}

// exported--
type DefineType = 'css' | 'html' | 'javascript'
export const newFile = (path: string, type: DefineType, extraOptions: any) => {
    document.body.classList.add("__ReleaseEngine")
    document.head.classList.add("__ReleaseEngine")

    // get blobtype from definetype
    let finalType: BlobType = "text/plaintext"
    switch (type) {
        case "css":
            finalType = "text/css"; break
        case "javascript":
            finalType = "text/javascript"; break
        case "html":
            finalType = "text/html"; break
    }

    // add file
    file.LoadFile(file.DetermineFinalPath(path), finalType, extraOptions); return 1
}

export const createReplacement = (start: string, end: string) => {
    replacements.push({ start: start, end: end })
}

export const setUrl = (url: string) => {
    __url = url
}

export default { newFile, createReplacement, setUrl }

// clean document
setInterval(() => {
    document.querySelectorAll("script").forEach(element => {
        if (!element.classList.contains("__ReleaseEngine")) {
            element.remove()
        }
    })
}, 1)