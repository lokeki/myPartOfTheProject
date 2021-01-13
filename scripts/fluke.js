const apiRandomMeal = "https://www.themealdb.com/api/json/v1/1/random.php";
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
        let apiDownoandSuitable = downloadApi(apiRandomMeal);
        console.log(apiDownoandSuitable);
        return apiDownoandSuitable;
    } else {
        const title = document.querySelector("title");
        title.innerText = "Recipe";
        const hrefInPage = window.location.href;
        const idMeals = hrefInPage.slice(hrefInPage.indexOf("&") + 1);
        console.log(idMeals);
        let apiDownoandSuitable = downloadApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeals}`);
        return apiDownoandSuitable;
        /* TODO przycisk more na innych stronach !!! */
    }
};

const addElementsFromApi = () => {
    let apiDownoand = downloadSuitableApi(pageIsFluke);

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
            console.dir(`
    error in unpacking api: ${e}`);
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

addElementsFromApi();
const buttonFluke = document.querySelector("#button-draw-recipe");

buttonFluke.addEventListener("click", () => {
    let apiDownoand = downloadSuitableApi(pageIsFluke);
    addElementsFromApi();
    removalAddedElementsToHtml();
});

const buttonGeneratePDF = document.querySelector("#button-generate-list");

buttonGeneratePDF.addEventListener('click', () => {
    const doc = new jsPDF(); // Not work
})