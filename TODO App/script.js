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
        if (el.isCheck) {
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

    if (text) {
        listItem.textContent = "";
        for (let el of allTask) {
            let x = el.value.search(text);
            if (x >= 0) {
                found = true;
                const task = `<li>
                                <input id='${el.id}' onclick="checkEl(this)" class = "chkBox" type="checkbox">
                                <span ondblclick="editElement(this.parentElement)">${el.value}</span>
                                <a onclick="editElement(this.parentElement)" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                                <a onclick="deleteEl(this.parentElement)" href="#"><i class="fa-solid fa-delete-left"></i></a>
                              </li>`;
                listItem.insertAdjacentHTML('afterbegin', task);
            }
        }
        if (!found) {
            alert(`${text} is not found!`);
            displayEntries(allTask);
            inputText.value = "";
        }
    } else {
        alert("Enter task to search!")
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
    inputBox.value = allTask[idNo].value;

    inputBox.addEventListener('blur', function () {
        if (inputBox.value == "") {
            el.querySelector('span').textContent = allTask[idNo].value;
        } else {
            for (let i of allTask) {
                if (i.id == idNo) {
                    i.value = inputBox.value;
                    break;
                }
            }
            displayByCondition();
        }
    })

    inputBox.addEventListener('keydown', function (e) {
        if (e.key == 'Enter') {
            if (inputBox.value == "") {
                el.querySelector('span').textContent = allTask[idNo].value;
            } else {
                for (let i of allTask) {
                    if (i.id == idNo) {
                        i.value = inputBox.value;
                        break;
                    }
                }
                displayByCondition();
            }
        }
    })
}

function deleteEl(el) {
    const idNo = el.children[0].getAttribute('id');

    for (let [i, val] of allTask.entries()) {
        if (val.id == idNo) {
            allTask.splice(i, 1);
        }
    }
    displayByCondition();
}

function checkEl(el) {
    const idNo = el.getAttribute('id');
    if (el.checked) {
        for (let val of allTask) {
            if (val.id == idNo) {
                val.isCheck = true;
            }
        }
    } else if (!el.checked) {
        for (let [i, val] of allTask.entries()) {
            if (val.id == idNo) {
                val.isCheck = false;
            }
        }
    }
    displayByCondition();
}

function displayByCondition() {
    if (displayAllButton.classList.contains('active')) {
        listItem.textContent = "";
        for (let el of allTask) {
            const task = `<li>
                            <input id='${el.id}' onclick="checkEl(this)" class="chkBox" type="checkbox">
                            <span ondblclick="editElement(this.parentElement)">${el.value}</span>
                            <a onclick="editElement(this.parentElement)" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                            <a onclick="deleteEl(this.parentElement)" href="#"><i class="fa-solid fa-delete-left"></i></a>
                          </li>`;
            listItem.insertAdjacentHTML('afterbegin', task);
            if (el.isCheck) {
                document.getElementById(`${el.id}`).checked = true;
            }
        }
        getSortedValue();
    } else if (displayActiveButton.classList.contains('active')) {
        listItem.textContent = "";
        for (let el of allTask) {
            if (!el.isCheck) {
                const task = `<li>
                                <input id='${el.id}' onclick="checkEl(this)" class="chkBox" type="checkbox">
                                <span ondblclick="editElement(this.parentElement)">${el.value}</span>
                                <a onclick="editElement(this.parentElement)" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                                <a onclick="deleteEl(this.parentElement)" href="#"><i class="fa-solid fa-delete-left"></i></a>
                              </li>`;
                listItem.insertAdjacentHTML('afterbegin', task);
            }
        }
        getSortedValue();
    } else if (displayCompletedButton.classList.contains('active')) {
        listItem.textContent = "";
        for (let el of allTask) {
            if (el.isCheck) {
                const task = `<li>
                                <input id='${el.id}' onclick="checkEl(this)" class="chkBox" type="checkbox">
                                <span ondblclick="editElement(this.parentElement)">${el.value}</span>
                                <a onclick="editElement(this.parentElement)" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                                <a onclick="deleteEl(this.parentElement)" href="#"><i class="fa-solid fa-delete-left"></i></a>
                              </li>`;
                listItem.insertAdjacentHTML('afterbegin', task);
                document.getElementById(`${el.id}`).checked = true;
            }
        }
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
            displayByCondition()
            break
        case 'selectCompleted':
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.add('active');
            displayByCondition()
            break
    }
}

function getSelectedValue() {
    switch (actionDDL.value) {
        case 'Delete All Selected':
            for (let [i, el] of allTask.entries()) {
                if (el.isCheck) {
                    allTask.splice(i, 1);
                }
            }
            displayByCondition();
            break;

        case 'Select All':
            for (let val of allTask) {
                val.isCheck = true;
            }
            displayByCondition();
            break;

        case 'Deselect All':
            for (let val of allTask) {
                val.isCheck = false;
            }
            displayByCondition();
            break;
    }
}

function sorting() {
    if (displayAllButton.classList.contains('active')) {
        return allTask;
    } else if (displayActiveButton.classList.contains('active')) {
        let activeTask = [];
        for (let el of allTask) {
            if (!el.isCheck) {
                activeTask.push(el)
            }
        }
        return activeTask;
    } else if (displayCompletedButton.classList.contains('active')) {
        let completeTask = [];
        for (let el of allTask) {
            if (!el.isCheck) {
                completeTask.push(el);
            }
        }
        return completeTask;
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