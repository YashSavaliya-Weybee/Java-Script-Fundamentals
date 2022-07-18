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
let allTask = []
let activeTask = [];
let completedTask = [];

function displayEntries(arr) {
    listItem.textContent = "";
    for (let el of arr) {
        const task = `<li>
                         <input id='${el.id}' onclick="checkEl(this)" class="chkBox" type="checkbox">
                         <span ondblclick="editElement(this.parentElement)">${el.value}</span>
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
            value: text.toLowerCase(),
            isCheck: false
        });
        activeTask.push({
            id: inc,
            value: text.toLowerCase(),
            isCheck: false
        });
        inc++;
        inputText.value = "";
        inputText.focus();
        displayByCondition();
        displayAllButton.classList.add('active');
        displayActiveButton.classList.remove('active');
        displayCompletedButton.classList.remove('active');
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
        if (el.value == text.toLowerCase()) {
            found = true;
            listItem.textContent = "";
            const task = `<li>
                            <input id='${el.id}' onclick="checkEl(this)" class = "chkBox" type="checkbox">
                            <span ondblclick="editElement(this.parentElement)">${el.value}</span>
                            <a onclick="editElement(this.parentElement)" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                            <a onclick="deleteEl(this.parentElement)" href="#"><i class="fa-solid fa-delete-left"></i></a>
                          </li>`;
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
    console.log(idNo)

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
            if (inputBox.value == "") {
                el.querySelector('span').textContent = allTask[idNo].value;
            } else {
                allTask[idNo].value = inputBox.value;
                displayEntries(allTask);
            }
        }
    })
}

function deleteFromAll(idNo) {
    for (let [i, val] of allTask.entries()) {
        if (val.id == idNo) {
            allTask.splice(i, 1);
        }
    }
}

function deleteEl(el) {
    let taskToMove;
    const idNo = el.children[0].getAttribute('id');
    if (displayAllButton.classList.contains('active')) {
        deleteFromAll(idNo);
        displayByCondition();
    } else if (displayCompletedButton.classList.contains('active')) {
        for (let [i, val] of completedTask.entries()) {
            if (val.id == idNo) {
                completedTask.splice(i, 1);
            }
        }
        deleteFromAll(idNo);
        displayByCondition();
    } else if (displayActiveButton.classList.contains('active')) {
        for (let [i, val] of activeTask.entries()) {
            if (val.id == idNo) {
                activeTask.splice(i, 1);
            }
        }
        deleteFromAll(idNo);
        displayByCondition();
    }
}

function checkEl(el) {
    let taskToMove;
    const idNo = el.getAttribute('id');
    if (el.checked) {
        for (let [i, val] of allTask.entries()) {
            if (val.id == idNo) {
                val.isCheck = true;
                break;
            }
        }
        for (let [i, val] of activeTask.entries()) {
            if (val.id == idNo) {
                activeTask[i].isCheck = true;
                completedTask.push(activeTask[i]);
                activeTask.splice(i, 1);
                break;
            }
        }
    } else if (!el.checked) {
        for (let [i, val] of allTask.entries()) {
            if (val.id == idNo) {
                val.isCheck = false;
                break;
            }
        }
        for (let [i, val] of completedTask.entries()) {
            if (val.id == idNo) {
                activeTask.push(completedTask[i]);
                completedTask.splice(i, 1);
                break;
            }
        }
    }
    displayByCondition();
}

function displayByCondition() {
    if (displayAllButton.classList.contains('active')) {
        displayEntries(allTask);
        getSortedValue();
    } else if (displayActiveButton.classList.contains('active')) {
        displayEntries(activeTask);
        getSortedValue();
    } else if (displayCompletedButton.classList.contains('active')) {
        displayEntries(completedTask);
        getSortedValue();
    }
}

function selectEntries(el) {
    switch (el.getAttribute('id')) {
        case 'selectAll':
            displayAllButton.classList.add('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.remove('active');
            displayByCondition()
            break;
        case 'selectActive':
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.add('active');
            displayCompletedButton.classList.remove('active');
            listItem.textContent = "";
            displayByCondition()
            break
        case 'selectCompleted':
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.add('active');
            listItem.textContent = "";
            displayByCondition()
            break
    }
}

function getSelectedValue() {
    switch (actionDDL.value) {
        case 'Delete All Selected':
            for (let el of completedTask) {
                for (let [i, val] of allTask.entries()) {
                    if (val.id == el.id) {
                        allTask.splice(i, 1);
                    }
                }
            }
            completedTask = [];
            displayByCondition();
            break;

        case 'Select All':
            completedTask = [];
            activeTask = [];
            for (let [i, val] of allTask.entries()) {
                val.isCheck = true;
                completedTask.push(allTask[i]);
            }
            displayByCondition();
            break;

        case 'Deselect All':
            completedTask = [];
            activeTask = [];
            for (let [i, val] of allTask.entries()) {
                val.isCheck = false;
                activeTask.push(allTask[i]);
            }
            displayByCondition();
            break;
    }
}

function sorting() {
    if (displayAllButton.classList.contains('active')) {
        return [...allTask];
    } else if (displayActiveButton.classList.contains('active')) {
        return [...activeTask];
    } else if (displayCompletedButton.classList.contains('active')) {
        return [...completedTask];
    }
}

function getSortedValue() {
    switch (sortDDL.value) {
        case 'A-Z':
            let sorted = sorting().sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
            displayEntries(sorted);
            break;

        case 'Z-A':
            let sorted1 = sorting().sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
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