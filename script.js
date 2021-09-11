let filters = document.querySelectorAll(".filters");
let grid = document.querySelector(".grid");
let add = document.querySelector(".add");
let body = document.querySelector("body");
let deleteBtn = document.querySelector(".delete");
let deleteState = false;
let uid = new ShortUniqueId();
let isFilterSelected = false;
let ticketIdColor = "";


if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}

deleteBtn.addEventListener("click", function () {
  if (deleteState) {
    deleteState = false;
    deleteBtn.classList.remove("delete-highlight");
  } else {
    deleteState = true;
    deleteBtn.classList.add("delete-highlight");
  }
})


let visible = false;
let isNewText = false;

//---------------To display modal & use its functions---------------------

add.addEventListener("click", function () {
  deleteState = false;
  deleteBtn.classList.remove("delete-highlight");

  if (visible) return;
  let modal = document.createElement("div");
  modal.classList.add("modal-container");
  modal.innerHTML = ` <div class="modal">
  <div class="text" contentEditable>Enter text here!!</div>
</div>
<div class="function-selector">
  <div class="select">
      <div class="selectFilter">
          <div class="pink-filter"></div>
          <div class="blue-filter"></div>
          <div class="green-filter"></div>
          <div class="black-filter"></div>
      </div>
  </div>
  <div class="addBtn">ADD</div>
</div>`;
  body.appendChild(modal);
  visible = true;

  //-----------------To remove pre wrote text ((Enter Text here!!) in this case)-------------------

  let text = document.querySelector(".text");
  text.addEventListener("click", function () {
    if (isNewText) return;
    text.innerText = "";
    isNewText = true;
  })

  //------------------------To highlight selectd filter--------------------------

  let selectFilter = document.querySelector(".selectFilter");
  console.log(selectFilter.children.length);
  let children = selectFilter.children;
  for (let i = 0; i < selectFilter.children.length; i++) {
    children[i].addEventListener("click", function () {
      for (let j = 0; j < children.length; j++) {
        selectFilter.children[j].classList.remove("highlight-filters")

      }
      selectFilter.children[i].classList.add("highlight-filters");
      console.log(selectFilter.children[i].classList[0].split("-")[0]);
      ticketIdColor = selectFilter.children[i].classList[0].split("-")[0];
      ticketIdColor = colors[ticketIdColor];
      isFilterSelected = true;
      console.log(ticketIdColor);
      console.log(isFilterSelected);

    })
  }

  //-----------------------To create/remove ticket-------------------------------


  console.log(isFilterSelected);

  let AddBtn = document.querySelector(".addBtn");
  AddBtn.addEventListener("click", function () {
    let textWritten = text.innerText;
    if (textWritten == "Enter text here!!" && isNewText == false) {
      alert("Invalid input");
      return;
    }

    if (!isFilterSelected) {
      alert("Please select a filter before creating a new ticket!!");
      return;
    }

    let id = uid();
    let newTicket = document.createElement("div");
    newTicket.classList.add("list");
    newTicket.innerHTML = `
  <div class="id" style="background-color:${ticketIdColor}">#${id}</div>
  <div class="text-area" contentEditable>
  ${textWritten}
  </div>`

    grid.appendChild(newTicket);
    modal.remove();

    isNewText = false;
    visible = false;
    isFilterSelected = false;

    saveTicketInLocalStorage(id, ticketIdColor, textWritten);

    let ticketWritingArea = newTicket.querySelector(".text-area");
    writingAreaHandler(ticketWritingArea);

    // ticketWritingArea.addEventListener("input", function (e) {
    //   let textId = e.currentTarget.parentElement.querySelector(".id").innerText.substring(1);
    //   let taskarr = JSON.parse(localStorage.getItem("tasks"));
    //   let idx = -1;
    //   for (let i = 0; i < taskarr.length; i++) {
    //     if (taskarr[i].id == textId) {
    //       idx = i;
    //       break;
    //     }
    //   }

    //   taskarr[idx].textWritten = e.currentTarget.innerText;
    //   localStorage.setItem("tasks", JSON.stringify(taskarr));

    // })

    deletionHandler(newTicket);
    // newTicket.addEventListener("click", function () {
    //   if (deleteState) {
    //     newTicket.remove();
    //   }
    // })
  })

})

//-----------------------To change background colors--------------------

let colors = {
  pink: "rgb(167, 12, 64)",
  blue: "rgb(5, 33, 75)",
  green: "rgb(6, 58, 6)",
  black: "rgb(102, 11, 11)",
};
for (let i = 0; i < filters.length; i++) {
  filters[i].addEventListener("click", function (e) {

    // for(let j = 0 ; j < filters.length ; j++)
    // {
    //   filters[j].classList.remove("highlight-filters")
    // }

    console.log(filters[i].classList);

    if (filters[i].classList.contains("highlight-filter")) {
      filters[i].classList.remove("highlight-filter")

      taskLoader();
    }
    else {
      for (let j = 0; j < filters.length; j++) {
        filters[j].classList.remove("highlight-filter")
      }
      filters[i].classList.add("highlight-filter");

      let filterColor = document.querySelectorAll(".filters div");
      // console.log(filterColor[i].classList[0].split("-")[0]);
      let color = filterColor[i].classList[0].split("-")[0];
      console.log(colors[color]);
      // grid.style.backgroundColor = colors[color];
      taskLoader(colors[color]);
    }

    // filters[i].classList.add("highlight-filters");

    // let filterColor = document.querySelectorAll(".filters div");
    // // console.log(filterColor[i].classList[0].split("-")[0]);
    // let color = filterColor[i].classList[0].split("-")[0];
    // console.log(colors[color]);
    // // grid.style.backgroundColor = colors[color];
    // taskLoader(colors[color]);
  })
}


function saveTicketInLocalStorage(id, ticketIdColor, textWritten) {
  let reqObj = { id, ticketIdColor, textWritten };
  let taskarr = JSON.parse(localStorage.getItem("tasks"));
  taskarr.push(reqObj);
  localStorage.setItem("tasks", JSON.stringify(taskarr));
}

//------------------------------------------------------------

function writingAreaHandler(ticketWritingArea) {
  // let ticketWritingArea = newTicket.querySelector(".text-area");

  ticketWritingArea.addEventListener("input", function (e) {
    let textId = e.currentTarget.parentElement.querySelector(".id").innerText.substring(1);
    let taskarr = JSON.parse(localStorage.getItem("tasks"));
    let idx = -1;
    for (let i = 0; i < taskarr.length; i++) {
      if (taskarr[i].id == textId) {
        idx = i;
        break;
      }
    }

    taskarr[idx].textWritten = e.currentTarget.innerText;
    localStorage.setItem("tasks", JSON.stringify(taskarr));

  })
}

//---------------------------------------

function deletionHandler(newTicket) {
  newTicket.addEventListener("click", function (e) {
    if (deleteState) {
      let id = e.currentTarget.querySelector(".id").innerText.substring(1);

      let tasksArr = JSON.parse(localStorage.getItem("tasks"));

      tasksArr = tasksArr.filter(function (el) {
        return el.id != id;
      });

      localStorage.setItem("tasks", JSON.stringify(tasksArr));
      newTicket.remove();
    }
  })
}

//-----------------To load local storage elements after refreshing the page---------

function taskLoader(passedColor) {

  let allTickets = document.querySelectorAll(".list");
  for (let i = 0; i < allTickets.length; i++) allTickets[i].remove();

  let savedArr = JSON.parse(localStorage.getItem("tasks"));

  for (let i = 0; i < savedArr.length; i++) {
    let savedId = savedArr[i].id;
    let savedText = savedArr[i].textWritten;
    let savedColor = savedArr[i].ticketIdColor;

    if (passedColor) {
      if (passedColor != savedColor) continue;
    }

    let newTicket = document.createElement("div");
    newTicket.classList.add("list");
    newTicket.innerHTML = `
  <div class="id" style="background-color:${savedColor}">#${savedId}</div>
  <div class="text-area" contentEditable>
  ${savedText}
  </div>`

    grid.appendChild(newTicket);

    deletionHandler(newTicket);

    let ticketWritingArea = newTicket.querySelector(".text-area");
    writingAreaHandler(ticketWritingArea);

  }
}

taskLoader();