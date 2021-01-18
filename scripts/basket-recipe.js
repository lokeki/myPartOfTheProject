const getData = (key) => {
    if (!localStorage) return;

    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        console.error(`error getting item ${key} to localStorage`, err);
    }
}

const api = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const tdIntable1 = document.querySelector("#table--1 > tbody");

console.log(tdIntable1);
let strMeals = '';
const downoandApi = async(api, generateList) => {

    const apiDownoand = await (await (await fetch(api)).json());
    if (!generateList) {
        strMeals = '';
        strMeals += apiDownoand.meals[0].strMeal;
        //console.log(1, strMeals);
    } else {
        return apiDownoand.meals[0];
    }
}

const addElementInTableHtml = (i, idMeal) => {
    const tr = document.createElement('tr');
    tr.classList.add(`tr--${i}`);

    const tdcol1 = document.createElement('td');
    tdcol1.classList.add(`col--1`, `col-checkbox`);
    const divCheckbox = document.createElement('div');
    divCheckbox.classList.add('div-checkbox');
    const labelCheckbox = document.createElement('label');
    labelCheckbox.classList.add('label-checkbox');
    const inputCheckbox = document.createElement('input');
    inputCheckbox.classList.add('input-checkbox');
    inputCheckbox.id = idMeal;
    inputCheckbox.setAttribute('type', 'checkbox');
    const spanCheckbox = document.createElement('span');
    spanCheckbox.classList.add('span-checkbox');
    labelCheckbox.appendChild(inputCheckbox);
    labelCheckbox.appendChild(spanCheckbox);
    divCheckbox.appendChild(labelCheckbox);

    const tdcol2 = document.createElement('td');
    tdcol2.classList.add(`col--2`, `col-title`);
    const tdcol2h4 = document.createElement('h4');
    tdcol2h4.classList.add('h4-title-Recipe');
    tdcol2h4.innerText = strMeals;
    const divTitle = document.createElement('div');
    divTitle.classList.add('div-title-Recipe');
    divTitle.appendChild(tdcol2h4);

    const tdcol3 = document.createElement('td');
    tdcol3.classList.add(`col--3`, `col-remove`);
    const divRemove = document.createElement('div');
    divRemove.classList.add('div-remove');


    tdcol1.appendChild(divCheckbox);
    tdcol2.appendChild(divTitle);
    tdcol3.appendChild(divRemove);
    tr.appendChild(tdcol1);
    tr.appendChild(tdcol2);
    tr.appendChild(tdcol3);

    tdIntable1.appendChild(tr);
}

const addApiInHTML = (apiWithId) => {

}

const addItemHTML = async() => {

    const arrWithMeals = addDataFromLocalStorage();
    console.log(arrWithMeals);

    const arrWithMealsLength = arrWithMeals.length;
    for (let i = 0; i < arrWithMealsLength; i++) {

        const apiWithId = api + arrWithMeals[i].idMeals;
        console.log(apiWithId);
        await downoandApi(apiWithId, false);
        addElementInTableHtml(i, arrWithMeals[i].idMeals);
    }

}

const addDataFromLocalStorage = () => {
    const key = "Recipe";
    return getData(key);
}
addItemHTML();