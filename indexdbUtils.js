const nameInput1 = document.querySelector('#nameinput');
const mailInput1 = document.querySelector('#emailinput');
const phoneInput1 = document.querySelector('#phoneinput');
const form = document.querySelector('#myForm');
const tableBody = document.querySelector('#tBody');
const submitDOM = document.querySelector('#submitbtn');
const saveDOM = document.querySelector('#savebtn');
const cancelDOM = document.querySelector('#cancelbtn');

let db;
let nextId = parseInt(localStorage.getItem('contactsNextId')) || 1;

let openRequest = indexedDB.open('contact', 1);

openRequest.onupgradeneeded = (e) => {
    let db = e.target.result;
    if (!db.objectStoreNames.contains('contacts')) {
        let store = db.createObjectStore('contacts', { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('email', 'email', { unique: true });
        store.createIndex('phone', 'phone', { unique: false });
    }
};

openRequest.onsuccess = (e) => {
    db = e.target.result;
    drawContactTable();
};

openRequest.onerror = (e) => {
    console.log('Error opening database', e);
};

function addContact(e) {
    e.preventDefault();

    let contact = {
        id: nextId,
        name: nameInput1.value,
        mail: mailInput1.value,
        phone: phoneInput1.value
    };

    let tx = db.transaction('contacts', 'readwrite');
    let store = tx.objectStore('contacts');
    let request = store.add(contact);

    request.onsuccess = () => {
        nextId++;
        localStorage.setItem('contactsNextId', nextId);
        form.reset();
        drawContactTable();
    };

    request.onerror = (e) => {
        console.log('Error adding contact', e);
    };
}

function createTR(id, name, mail, phone) {
    const contactTR = document.createElement("tr");

    const idTD = document.createElement("td");
    idTD.innerText = id;

    const nameTD = document.createElement("td");
    nameTD.innerText = name;

    const mailTD = document.createElement("td");
    mailTD.innerText = mail;

    const phoneTD = document.createElement("td");
    phoneTD.innerText = phone;

    const editTD = document.createElement("td");
    editTD.innerText = "✏️";
    editTD.style.cursor = "pointer";
    editTD.onclick = () => editContact(id);

    const deleteTD = document.createElement("td");
    deleteTD.innerText = "🗑️";
    deleteTD.style.cursor = "pointer";
    deleteTD.onclick = () => deleteContact(id);

    contactTR.appendChild(idTD);
    contactTR.appendChild(nameTD);
    contactTR.appendChild(mailTD);
    contactTR.appendChild(phoneTD);
    contactTR.appendChild(editTD);
    contactTR.appendChild(deleteTD);
    tableBody.appendChild(contactTR);
}

function editContact(id) {
    let tx = db.transaction('contacts', 'readwrite');
    let store = tx.objectStore('contacts');
    let request = store.get(id);

        request.onsuccess = () => {
        let contact = request.result;
        // if (!contact) return;

        nameInput1.value = contact.name;
        mailInput1.value = contact.mail;
        phoneInput1.value = contact.phone;

        submitDOM.style.display = 'none';
        saveDOM.style.display = 'inline-block';
        cancelDOM.style.display = 'inline-block';

        saveDOM.onclick = function () {
            contact.name = nameInput1.value;
            contact.mail = mailInput1.value;
            contact.phone = phoneInput1.value;

            let updateTx = db.transaction('contacts', 'readwrite');
            let updateStore = updateTx.objectStore('contacts');
            updateStore.put(contact);

            updateTx.onsuccess = () => {
                form.reset();
                submitDOM.style.display = 'inline-block';
                saveDOM.style.display = 'none';
                cancelDOM.style.display = 'none';
                drawContactTable();
            };
        };

        cancelDOM.onclick = function () {
            form.reset();
            submitDOM.style.display = 'inline-block';
            saveDOM.style.display = 'none';
            cancelDOM.style.display = 'none';
        };
    };

    request.onerror = (e) => {
        console.log('Error retrieving contact', e);
    };
}

function deleteContact(id) {
    let tx = db.transaction('contacts', 'readwrite');
    let store = tx.objectStore('contacts');
    let request = store.delete(id);

    request.onsuccess = () => {
        drawContactTable();
    };
}

function drawContactTable() {
    tableBody.innerHTML = '';

    let tx = db.transaction('contacts', 'readwrite');
    let store = tx.objectStore('contacts');
    let request = store.getAll();

    request.onsuccess = () => {
        let contacts = request.result;
        contacts.forEach(contact => createTR(contact.id, contact.name, contact.mail, contact.phone));
    };

    request.onerror = (e) => {
        console.log('Error retrieving contacts', e);
    };
}
