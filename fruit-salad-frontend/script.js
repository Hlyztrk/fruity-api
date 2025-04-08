const fruitForm = document.querySelector("#inputSection form");
const fruitList = document.querySelector("#fruitSection ul");
const fruitNutrition = document.querySelector("#nutritionSection p");
const createForm = document.querySelector("#create-form")
const deleteForm = document.querySelector("#delete-form")
const patchForm = document.querySelector("#patch-form")

let cal = 0;
const fruitCal = {};
const apiKey = "49560341-5b3c998b00c887ae3603f6cbf"

fruitForm.addEventListener("submit", extractFruit)
createForm.addEventListener("submit", createNewFruit)
deleteForm.addEventListener("submit", deleteFruit)
patchForm.addEventListener("submit", updateFruit)

function extractFruit(e) {
    e.preventDefault();
    fetchFruitData(e.target.fruitInput.value);
    e.target.fruitInput.value = "";
}

async function fetchFruitData(fruit) {
    try {
        //Make sure to replace this link with your deployed API URL in this fetch
        const respData = await fetch(`https://fruity-api-9tuc.onrender.com/fruits/${fruit}`);
        const respImg = await fetch(
            `https://pixabay.com/api/?q=${fruit}+fruit&key=${apiKey}`
        );

        if (respData.ok && respImg.ok) {
            const data = await respData.json();
            const imgData = await respImg.json();
            addFruit(data, imgData);
        } else {
            throw "Something has gone wrong with one of the API requests";
        }
    } catch (e) {
        console.log(e);
    }
}

function addFruit(fruit, fruitImg) {
    const img = document.createElement("img");
    img.classList.add('fruits');
    img.alt = fruit.name;
    img.src = fruitImg.hits[0].previewURL;

    img.addEventListener("click", removeFruit, { once: true });
    fruitList.appendChild(img);

    fruitCal[fruit.name] = fruit.nutritions.calories;

    cal += fruit.nutritions.calories;
    fruitNutrition.textContent = "Total Calories: " + cal;
}

function removeFruit(e) {
    const fruitName = e.target.alt;
    cal -= fruitCal[fruitName];
    fruitNutrition.textContent = "Total Calories: " + cal;

    delete fruitCal[fruitName];
    e.target.remove();
}

async function createNewFruit(e){
    e.preventDefault()

    const data = {
        name: e.target.fruitInput.value
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch(`https://fruity-api-9tuc.onrender.com/fruits`, options)

    let messageStatus = document.querySelector('#message')
    
    if(response.status === 201){
        e.target.fruitInput.value = ''
        messageStatus.textContent = 'Fruit successfully added'

        setTimeout(() => {
            messageStatus.textContent = ""
        }, 4000)
    }else{
        e.target.fruitInput.value = ''
        messageStatus.textContent = 'This fruit alreay exists. Please enter another one'

        setTimeout(() => {
            messageStatus.textContent = ""
        }, 4000)
    }
}

async function deleteFruit(e){
    e.preventDefault()

    const data = e.target.fruitInput.value


    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(`https://fruity-api-9tuc.onrender.com/fruits/${data}`, options)

    let messageStatus = document.querySelector('#deleteMessage')
    
    if(response.status === 204){
        e.target.fruitInput.value = ''
        messageStatus.textContent = 'Fruit successfully deleted'

        setTimeout(() => {
            messageStatus.textContent = ""
        }, 4000)
    }else{
        e.target.fruitInput.value = ''
        messageStatus.textContent = 'There is an error with your code'

        setTimeout(() => {
            messageStatus.textContent = ""
        }, 4000)
    }

}


async function updateFruit(e){
    e.preventDefault()

    const name = e.target.originalInput.value

    const data = {
        name: e.target.fruitInput.value, 
        family: e.target.familyInput.value
    }


    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch(`https://fruity-api-9tuc.onrender.com/fruits/${name}`, options)
    console.log("Hello")
    let messageStatus = document.querySelector('#updateMessage')
    
    if(response.status === 200){
        e.target.fruitInput.value = ''
        messageStatus.textContent = `${name} successfully updated to ${data['name']}`

        setTimeout(() => {
            messageStatus.textContent = ""
        }, 4000)
    }else{
        e.target.fruitInput.value = ''
        messageStatus.textContent = 'There is an error with your code'

        setTimeout(() => {
            messageStatus.textContent = ""
        }, 4000)
    }

}

