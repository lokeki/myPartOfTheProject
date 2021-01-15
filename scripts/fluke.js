const jsPdf = window.jspdf;
//const { jsPDF } = require('jspdf');
const apiMeal = "https://www.themealdb.com/api/json/v1/1/";
$("#carouselFade").carousel();

const isFluke = function() {
    let pageIsFluke;
    const hrefInPage = window.location.href;
    pageIsFluke = hrefInPage.slice(hrefInPage.indexOf("=") + 1, hrefInPage.indexOf("&"));
    return Boolean(pageIsFluke);
};
const pageIsFluke = isFluke();

const downloadApi = async(api) => {
    apiDownoand = await (await fetch(api)).json();
    console.log(apiDownoand.meals[0]);
    return apiDownoand.meals[0];
};

const downloadSuitableApi = (pageIsFluke) => {
    if (pageIsFluke) {
        let buttonFluke = document.querySelector("#button-draw-recipe");
        //console.log(buttonFluke);
        buttonFluke.removeAttribute("style");
        const title = document.querySelector("title");
        title.innerText = "Fluke";
        let apiDownoandSuitable = downloadApi(`${apiMeal}random.php`);
        console.log(apiDownoandSuitable);
        return apiDownoandSuitable;
    } else {
        const title = document.querySelector("title");
        title.innerText = "Recipe";
        const hrefInPage = window.location.href;
        const idMeals = hrefInPage.slice(hrefInPage.indexOf("&") + 1);
        console.log(idMeals);
        let apiDownoandSuitable = downloadApi(`${apiMeal}lookup.php?i=${idMeals}`);
        return apiDownoandSuitable;
        /* TODO przycisk more na innych stronach !!! */
    }
};

const addElementsFromApi = () => {
    //let apiDownoand = downloadSuitableApi(pageIsFluke);

    //console.log(apiDownoand);

    const addInHTMl = apiDownoand
        .then((resp) => {
            //console.log(resp);
            const { strMeal, strMealThumb, strInstructions } = resp;
            const tabObiectIngredients = [];
            let i = 1;
            //console.log(resp[`strIngredient${i}`] !== "" && resp[`strIngredient${i}`] != null);
            while (!!(resp[`strIngredient${i}`] !== "" && resp[`strIngredient${i}`] != null)) {
                tabObiectIngredients.push({
                    measure: resp[`strMeasure${i}`],
                    ingredient: resp[`strIngredient${i}`],
                });
                i++;
            }
            //console.log(tabObiectIngredients);
            //console.log(strMeal, strMealThumb,tabObiectIngredients);
            return { strMeal, strMealThumb, tabObiectIngredients, strInstructions };
        })
        .catch((e) => {
            console.dir(`error in unpacking api: ${e}`);
        });

    addInHTMl
        .then((resp) => {
            //console.log(resp);
            const hTitleDish = document.querySelector("#title-dish");
            const imgDish = document.querySelector("#img-dish");
            const listIngredients = document.querySelector("#list-ingredients");
            const listIngredientscol2 = document.querySelector(
                "#list-ingredients-col2"
            );
            const description = document.querySelector(".content-description");
            const p = document.createElement("p");

            hTitleDish.innerText = resp.strMeal;
            imgDish.src = resp.strMealThumb;
            p.classList.add("instructions");

            p.innerText = resp.strInstructions;
            description.appendChild(p);

            for (let i = 0; i < resp.tabObiectIngredients.length; i++) {
                const li = document.createElement("li");
                li.classList.add("li-ingredient");

                if (i < 10) {
                    li.innerText = `${resp.tabObiectIngredients[i].measure} - ${resp.tabObiectIngredients[i].ingredient}`;
                    listIngredients.appendChild(li);
                } else {
                    li.innerText = `${resp.tabObiectIngredients[i].measure} - ${resp.tabObiectIngredients[i].ingredient}`;
                    listIngredientscol2.appendChild(li);
                }
            }
        })
        .catch((e) => {
            console.dir(`
    error in unpacking api: ${e}`);
        });
};

const removalAddedElementsToHtml = () => {
    const hTitleDish = document.querySelector("#title-dish");
    const imgDish = document.querySelector("#img-dish");
    const listIngredients = document.querySelectorAll(".li-ingredient");
    const instructions = document.querySelector(".instructions");

    hTitleDish.innerText = "";
    imgDish.src = "";
    for (el of listIngredients) {
        el.remove();
    }
    instructions.remove();
};

let apiDownoand = downloadSuitableApi(pageIsFluke);
addElementsFromApi(apiDownoand);
const buttonFluke = document.querySelector("#button-draw-recipe");

buttonFluke.addEventListener("click", () => {

    apiDownoand = downloadSuitableApi(pageIsFluke);
    console.log("click", apiDownoand);
    addElementsFromApi();
    removalAddedElementsToHtml(apiDownoand);
});

const generateListIngredientsPdf = (doc, margin, recipe) => {
    const liElements = document.querySelectorAll('.li-ingredient');
    let i = 60;
    lengthLiElements = liElements.length
    for (let j = 0; j < lengthLiElements; j++) {
        const liElementText = liElements[j].innerText;
        console.log(recipe, j);
        if (recipe && j == 13) {
            i = 120;
        } else if (recipe && j > 13) {
            console.log(liElementText);
            doc.text(20, i, `[   ]  ${liElementText}`);
        } else {
            console.log(liElementText);
            doc.text(margin, i, `[   ]  ${liElementText}`);
            console.log(i);
        }
        i += 10;
    }
}

const generateInstructions = (doc, instructions) => {
    const instructionsS = instructions.split('<br>');
    const instructionsSAdd = instructionsS.join(" ");
    lengthArrayInstructions = instructionsSAdd.length;
    let start = 0;
    let multiple = 80;
    j = 210;

    for (let i = 0; i < lengthArrayInstructions; i++) {
        if (i === multiple) {
            const arrayWithString = instructionsSAdd.substring(start, i);
            console.log("arr", arrayWithString);
            doc.text(20, j, `${arrayWithString}`);
            start = i;
            multiple += 80;
            j += 10;
        }
        if (j === 260) {
            doc.addPage();
            j = 20;
        }
    }
    const arrayWithString = instructionsSAdd.substring(start);
    doc.text(20, j, `${arrayWithString}`);
}

const generateShoppingListPdf = () => {
    const doc = jsPdf.jsPDF();
    //const doc = new jsPDF();
    const margin = 30;
    const hTitleDish = document.querySelector("#title-dish").innerText;
    doc.getFontList("Lobster");
    doc.text(90, 20, "Shopping list");
    doc.line(20, 30, 190, 30)
    doc.text(50, 45, `${hTitleDish}`);
    doc.getFontList("Segoe UI");
    doc.setFontSize(13);
    generateListIngredientsPdf(doc, margin);
    doc.save("shoppingList.pdf");
}

const generateRecipePdf = () => {
    recipe = true;
    const doc = jsPdf.jsPDF();
    //const doc = new jsPDF();
    const hTitleDish = document.querySelector("#title-dish").innerHTML;
    const imgDish = document.querySelector("#img-dish");
    const instructions = document.querySelector(".instructions").innerHTML;
    const margin = 120;

    doc.getFontList("Lobster");
    doc.text(90, 20, `${hTitleDish}`);
    doc.line(20, 30, 190, 30)
    doc.text(margin, 45, "Ingredients");
    doc.text(90, 200, "Instructions");
    doc.getFontList("Segoe UI");
    doc.setFontSize(13);
    doc.addImage(imgDish, 'JPEG', 20, 45, 80, 60);
    generateListIngredientsPdf(doc, margin, recipe);

    generateInstructions(doc, instructions);
    //console.log(instructions.split(''));

    const title = hTitleDish.replace(' ', '_')
    doc.save(`Recip_${title}.pdf`);
}

const buttonGenerateListPDF = document.querySelector("#button-generate-list");

buttonGenerateListPDF.addEventListener('click', () => {
    generateShoppingListPdf();
});

const buttonGenerateRecipePDF = document.querySelector("#button-generate-recipe");

buttonGenerateRecipePDF.addEventListener('click', () => {
    generateRecipePdf();
})