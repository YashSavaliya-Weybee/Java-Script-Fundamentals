'use strict'

const listItem = document.querySelector('.list');
const inputText = document.querySelector('.inputText');
const addButton = document.querySelector('.addbtn');
const searchButton = document.querySelector('.searchbtn');
const actionDDL = document.getElementById('actionDDL');
const sortDDL = document.getElementById('sortDDL');
const displayAllButton = document.querySelector('#selectAll');
const displayActiveButton = document.querySelector('#selectActive');
const displayCompletedButton = document.querySelector('#selectCompleted');
displayAllButton.classList.add('active');

let inc = 0;
const displayAllTask = [];
const allTask = []
const activeTask = [];
const completedTask = [];


function displayEntries(arr) {
    listItem.textContent = "";
    for (let el of arr) {
        const task = `<li>
                         <input id='${el.id}' onclick="checkEl(this)" class="chkBox" type="checkbox">
                         <span>${el.value}</span>
                         <a onclick="editElement(this.parentElement)" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                         <a onclick="deleteEl(this.parentElement)" href="#"><i class="fa-solid fa-delete-left"></i></a>
                      </li>`;
        listItem.insertAdjacentHTML('afterbegin', task);
        if (el.isCheck == true) {
            document.getElementById(`${el.id}`).checked = true;
        }
    }
}

function addElement() {
    const text = inputText.value;
    if (text) {
        allTask.push({
            id: inc,
            value: text,
            isCheck: false,
            status: 'New'
        });
        displayAllTask.push({
            id: inc,
            value: text,
            isCheck: false,
            status: 'New'
        });
        inc++;
        inputText.value = "";
        inputText.focus();
        displayEntries(allTask);
    }
}

addButton.addEventListener('click', function () {
    addElement();
})

inputText.addEventListener('keydown', function (e) {
    if (e.key == 'Enter') {
        addElement();
    }
})

searchButton.addEventListener('click', function () {
    let found = false;
    const text = inputText.value;

    for (let el of allTask) {
        if (el.value == text) {
            found = true;
            listItem.textContent = "";
            const task = `<li>
                            <input id='${el.id}' onclick="checkEl(this)" class = "chkBox" type="checkbox">
                            <span>${el.value}</span>
                            <a onclick="editElement(this.parentElement)" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                            <a onclick="deleteEl(this.parentElement)" href="#"><i class="fa-solid fa-delete-left"></i></a>
                          </li>`
            listItem.insertAdjacentHTML('afterbegin', task);
            break;
        }
    }
    if (!found) {
        alert(`${text} is not found!`);
        displayEntries(allTask);
        inputText.value = "";
    }
})

function editElement(el) {
    const idNo = el.children[0].getAttribute('id');

    let tag = document.createElement("input");
    tag.setAttribute('type', 'text');
    tag.className = "inputBox";

    el.querySelector('span').textContent = "";
    el.querySelector('span').appendChild(tag).focus();
    const inputBox = document.querySelector('.inputBox');

    inputBox.addEventListener('blur', function () {
        if (inputBox.value == "") {
            el.querySelector('span').textContent = allTask[idNo].value;
        } else {
            allTask[idNo].value = inputBox.value;
            displayEntries(allTask);
        }
    })

    inputBox.addEventListener('keydown', function (e) {
        if (e.key == 'Enter') {
            allTask[idNo].value = inputBox.value;
            displayEntries(allTask);
        }
    })
}

function deleteFromDisplayTask(idNo) {
    for (let [i, val] of displayAllTask.entries()) {
        if (val.id == idNo) {
            displayAllTask.splice(i, 1)
        }
    }
}

function deleteEl(el) {
    let taskToMove;
    const idNo = el.children[0].getAttribute('id');
    if (displayAllButton.classList.contains('active')) {
        for (let [i, val] of allTask.entries()) {
            if (val.id == idNo) {
                allTask.splice(i, 1)
            }
        }
        deleteFromDisplayTask(idNo);
        displayEntries(allTask);
        getSortedValue();
    } else if (displayCompletedButton.classList.contains('active')) {
        for (let [i, val] of completedTask.entries()) {
            if (val.id == idNo) {
                completedTask.splice(i, 1)
            }
        }
        deleteFromDisplayTask(idNo);
        displayEntries(completedTask);
        getSortedValue();
    } else if (displayActiveButton.classList.contains('active')) {
        for (let [i, val] of activeTask.entries()) {
            if (val.id == idNo) {
                taskToMove = activeTask[i];
                activeTask.splice(i, 1);
                taskToMove.status = 'New';
                allTask.push(taskToMove);
                displayEntries(activeTask);
                getSortedValue()
                break;
            }
        }
        for (let [i, val] of displayAllTask.entries()) {
            if (val.id == idNo) {
                displayAllTask.status = 'New';
                break;
            }
        }
    }
}

function checkEl(el) {
    let taskToMove;
    const idNo = el.getAttribute('id');

    if (displayAllButton.classList.contains('active')) {
        for (let [i, val] of allTask.entries()) {
            if (val.id == idNo) {
                taskToMove = allTask[i];
                allTask.splice(i, 1);
                taskToMove.status = 'Active'
                activeTask.push(taskToMove);
                displayEntries(allTask);

                break;
            }
        }
        for (let [i, val] of displayAllTask.entries()) {
            if (val.id == idNo) {
                val.status = 'Active'
                break;
            }
        }
    } else if (displayActiveButton.classList.contains('active')) {
        for (let [i, val] of activeTask.entries()) {
            if (val.id == idNo) {
                taskToMove = activeTask[i];
                activeTask.splice(i, 1);
                taskToMove.status = 'Completed';
                taskToMove.isCheck = true;
                completedTask.push(taskToMove);
                displayEntries(activeTask);
                getSortedValue();
                break;
            }
        }
        for (let [i, val] of displayAllTask.entries()) {
            if (val.id == idNo) {
                displayAllTask.status = 'Completed';
                displayAllTask.isCheck = true;
                break;
            }
        }
    } else if (displayCompletedButton.classList.contains('active')) {
        for (let [i, val] of completedTask.entries()) {
            if (val.id == idNo) {
                taskToMove = completedTask[i];
                completedTask.splice(i, 1);
                taskToMove.status = 'Active';
                taskToMove.isCheck = false;
                activeTask.push(taskToMove);
                displayEntries(completedTask);
                getSortedValue();
                break;
            }
        }
        for (let [i, val] of displayAllTask.entries()) {
            if (val.id == idNo) {
                displayAllTask.status = 'Active';
                displayAllTask.isCheck = false;
                break;
            }
        }
    }
}

function selectEntries(el) {
    switch (el.getAttribute('id')) {
        case 'selectAll':
            displayAllButton.classList.add('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.remove('active');
            listItem.textContent = "";
            displayEntries(allTask);
            getSortedValue();
            break;
        case 'selectActive':
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.add('active');
            displayCompletedButton.classList.remove('active');
            listItem.textContent = "";
            displayEntries(activeTask);
            getSortedValue();
            break
        case 'selectCompleted':
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.add('active');
            listItem.textContent = "";
            displayEntries(completedTask);
            getSortedValue();
            break
    }
}

function sorting() {
    const sortedArr = []
    if (displayAllButton.classList.contains('active')) {
        for (let i of displayAllTask) {
            if (i.status == 'New') {
                sortedArr.push(i);
            }
        }
    } else if (displayActiveButton.classList.contains('active')) {
        for (let i of displayAllTask) {
            if (i.status == 'Active') {
                sortedArr.push(i);
            }
        }
    } else if (displayCompletedButton.classList.contains('active')) {
        for (let i of displayAllTask) {
            if (i.status == 'Completed') {
                sortedArr.push(i);
            }
        }
    }
    return sortedArr;
}

function getSortedValue() {
    switch (sortDDL.value) {
        case 'A-Z':
            let sorted = sorting();
            sorted.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0))
            displayEntries(sorted);
            break;

        case 'Z-A':
            let sorted1 = sorting();
            sorted1.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
            displayEntries(sorted1);
            break;

        case 'Newest':
            displayEntries(sorting());
            break;

        case 'Oldest':
            displayEntries(sorting().reverse());
            break;
    }
}




