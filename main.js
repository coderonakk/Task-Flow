
let addbtn = document.querySelector(".addbtn")
let addinput = document.querySelector(".input")
let counter = document.querySelector(".counter")
let notasks = document.querySelector(".notasks")
let username = document.querySelector(".username")
let selectcat = document.querySelector(".select")
let allcat = document.querySelectorAll(".allcat")
let ntext = document.querySelector(".ntext")
let taskspace = document.querySelector(".taskspace")
let menubtn = document.querySelector(".menu-btn")
let closebtn = document.querySelector(".closemenu-btn")
let left = document.querySelector(".left")

let isediting = false

let currentCategory = "All Tasks"

// hamburger toggle ⬇⬇

menubtn.addEventListener("click", function () {
    left.classList.add("show-sidebar")
})

closebtn.addEventListener("click", function () {
    left.classList.remove("show-sidebar")
})

let arr = JSON.parse(localStorage.getItem("oldnotes")) || []

function savetasks() {
    localStorage.setItem("oldnotes", JSON.stringify(arr))
}

addinput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addtask()
})

selectcat.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addtask()
})


addbtn.addEventListener("click", addtask)

//  Tasks Render ⬇⬇

function rendertasks(tasks) {
    taskspace.innerHTML = ""

    tasks.forEach(task => {
        showtask(task)
    })

    emptytext(tasks)
} rendertasks(arr)

// Showing task on UI ⬇⬇

function showtask(data) {
    let div = document.createElement("div")
    let span = document.createElement("span")
    let del = document.createElement("button")
    let time = document.createElement("div")
    let content = document.createElement("div")

    content.classList.add("content")
    div.classList.add("task")
    del.classList.add("deletebtn")
    time.classList.add("time")
    del.innerHTML = '<i class="fa-solid fa-trash"></i>'
    span.textContent = data.text

    time.textContent = formatdate(data.date)

    content.append(span, time)
    div.append(content, del)
    taskspace.prepend(div)

    del.addEventListener("click", function () {

        arr = arr.filter(item => item.id !== data.id)

        if (currentCategory === "All Tasks") {
            rendertasks(arr)
        }

        else {
            let filterarr = arr.filter(item => item.category === currentCategory)
            rendertasks(filterarr)
        }

        savetasks()
        showcount()
        emptytext(arr)
    })

    span.addEventListener("click", function () {

        if (isediting) return

        isediting = true

        let taskinput = document.createElement("input")
        taskinput.value = data.text

        content.replaceChild(taskinput, span)
        taskinput.focus()

        taskinput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") run()
        })
        taskinput.addEventListener("blur", run)

        function run() {

            if (!isediting) return
            isediting = false

            let newText = taskinput.value.trim()

            if (!newText) {
                content.replaceChild(span, taskinput)
                return
            }

            let index = arr.findIndex(item => item.id === data.id)
            if (index !== -1) {
                arr[index].text = newText
            }

            data.text = newText

            span.textContent = newText
            content.replaceChild(span, taskinput)

            savetasks()
        }
    })

}
//  Date shit ⬇⬇

function formatdate(data) {
    let taskdate = new Date(data)

    let tasktime = taskdate.toLocaleString([], {
        hour: "numeric",
        minute: "2-digit"
    })

    let now = new Date()

    let yesterday = new Date()

    yesterday.setDate(yesterday.getDate() - 1)

    if (now.getDate() === taskdate.getDate() && now.getMonth() === taskdate.getMonth() && now.getFullYear() === taskdate.getFullYear()) {
        return `Today ${tasktime} `
    }

    else if (taskdate.getDate() === yesterday.getDate() && taskdate.getMonth() === yesterday.getMonth() && taskdate.getFullYear() === yesterday.getFullYear()) {
        return `Yesterday ${tasktime}`
    }

    else {
        return taskdate.toLocaleString([], {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit"
        })
    }
}


// Add task ⬇⬇


function addtask() {
    let text = addinput.value.trim()
    let selectcategory = selectcat.value

    if (!text) return

    let data = { id: Date.now(), text: text, category: selectcategory, date: Date.now() }
    arr.push(data)

    if (currentCategory === "All Tasks") {
        rendertasks(arr)
    }
    else {
        let filterarr = arr.filter(item => item.category === currentCategory)
        rendertasks(filterarr)
    }

    savetasks()

    addinput.value = ""

    showcount()
    addinput.focus()

}

// filter category ⬇⬇

allcat.forEach(item => item.addEventListener("click", function () {

    // remove active from all
    allcat.forEach(cat => cat.classList.remove("active-cat"))

    // add active to clicked one
    this.classList.add("active-cat")

    ntext.innerHTML = item.textContent.trim()

    currentCategory = item.textContent.trim()

    if (item.textContent.trim() === "All Tasks") {
        rendertasks(arr)
        counter.innerHTML = `<b>(${arr.length})</b>`
    }

    else {
        let filterarr = arr.filter(task => task.category === item.textContent.trim())
        counter.innerHTML = `<b>(${filterarr.length})</b>`
        rendertasks(filterarr)
        if (filterarr.length === 0) {
            emptytext(filterarr)
        }
    }

    if (window.innerWidth <= 1170) {
        left.classList.remove("show-sidebar")
    }
}))


// UserName Update ⬇⬇

let savedname = localStorage.getItem("savedname")
if (savedname) {
    username.innerHTML = savedname
}

username.addEventListener("click", function () {
    let name = prompt("Enter your name")

    if (!name || !name.trim()) return

    name = name.trim()
    if (name.length > 20) {
        alert("Name too long")
        return
    }

    username.innerHTML = name
    localStorage.setItem("savedname", name)
})

// Counter ⬇⬇

function showcount() {

    let count

    if (currentCategory === "All Tasks") {
        count = arr.length
    }

    else {
        let filterarr = arr.filter(item => item.category === currentCategory)
        count = filterarr.length
    }


    counter.innerHTML = `<b>(${count})</b>`
    counter.style.color = "orange"

} showcount()

// Empty Task ⬇⬇

function emptytext(param) {

    if (param.length === 0) {
        notasks.style.display = "flex"
    }

    else {
        notasks.style.display = "none"
    }
}

