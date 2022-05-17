const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals")
const searchTerm = document.getElementById("search-term")
const searchBtn = document.getElementById("search")
const mealPopup = document.getElementById("meal-popup")
const closePopupBtn = document.getElementById("close-popup")
const mealElInfo = document.getElementById("meal-info")



getRandomMeal();
fetchFavMeals();


/*------------------------fetching ------------------------------- */

async function getRandomMeal() {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const resData = await res.json();
    const randomMeal = resData.meals[0];
    addMeal(randomMeal);
}

async function getMealById(id) {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

    const resData = await res.json();
    const meal = resData.meals[0];

    return meal;
}


async function getMealsBySearch(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term );

    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
}


/*------------------------add the random meal to app with fav-btn---------------------------------- */
function addMeal(mealData) {  
    const meal = document.createElement("div");
    meal.classList.add = "meal";
    meal.innerHTML = `<div class="meal-header">
            <span class="random">Random Recipe</span>
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4> 
            <button class="fav-btn">
                <i class="fa fa-heart"></i>
            </button>
        </div>`;

        /*--------------favorite button ----------------------- */
    const favBtn = meal.querySelector(".fav-btn");

    favBtn.addEventListener("click", () => {
        if (favBtn.classList.contains("active")) {
            removeMealLs(mealData.idMeal)
            favBtn.classList.remove("active");
        }
        else {
            addMealsToLs(mealData.idMeal)
            favBtn.classList.add("active");
        }

        fetchFavMeals();

    })
    // show meal details 
    meal.addEventListener("click", ()=>{
        showMealDetails(mealData);
    });

    mealsEl.appendChild(meal);
}

// get meals form localStorage  
function getMealsToLs() {  
    const mealIds = JSON.parse(localStorage.getItem("mealIds")); 
    return mealIds === null ? [] : mealIds;
}


// add meal to localStorage  
function addMealsToLs(mealId) {
    const mealIds = getMealsToLs()   
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))
}


//remove ids from localStorage 
function removeMealLs(mealId) {
    const mealIds = getMealsToLs()
    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)))
}



/*---------------fetching favorite meals --------------------- */
async function fetchFavMeals() {
    favoriteContainer.innerHTML = '';
    const mealIds = getMealsToLs(); 
    console.log(mealIds)
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i]
        const meal = await getMealById(mealId)  
        addMealFav(meal);
    }
}




/*-----------------add meal to favorite container --------------------- */
function addMealFav(mealData) { // mealData == object contain keys 
    const favMeal = document.createElement("li");
    favMeal.innerHTML = `
    <img src="${mealData.strMealThumb}" 
    alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button> `;
    const btn = favMeal.querySelector(".clear")


    // clear button of favorite meal 
    btn.addEventListener("click", ()=>{
        removeMealLs(mealData.idMeal);
        fetchFavMeals();
    })
    
    // showing of favorite meal 
    favMeal.addEventListener("click", ()=>{
        showMealDetails(mealData);
    });

    favoriteContainer.appendChild(favMeal);
}



/*------------------------fetching meals by search term then add to cont ---------------------- */
searchBtn.addEventListener("click", async ()=>{
    mealsEl.innerHTML = "";
    const search = searchTerm.value
    const meals = await getMealsBySearch(search)
    if(meals){
        meals.forEach(meal => {
            addMeal(meal); 
        });
    }
})


/*-------------------showing meal details by click on it ------------------------ */
function showMealDetails(mealData){
    mealElInfo.innerHTML = "";
    const mealEl = document.createElement("div")

    
    const ingredients = [];

    // get ingredients and measures
    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(
                `${mealData["strIngredient" + i]} - ${
                    mealData["strMeasure" + i]
                }`
            );
        } else {
            break;
        }
    }

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" 
        alt=""
        >
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
                .map(
                    (ing) => `
            <li>${ing}</li>
            `
                )
                .join("")}
        </ul>
    `
    mealElInfo.appendChild(mealEl)
    mealPopup.classList.remove("hidden")
}

/*-------------------close the detailed menu of the meal-------------------------- */
closePopupBtn.addEventListener("click", ()=>{
    mealPopup.classList.add("hidden")
})





