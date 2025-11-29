console.log("js loaded");// Base API URL
const API_BASE = "https://www.themealdb.com/api/json/v1/1/";

// Utility: render meals as Bootstrap cards
function renderMeals(meals) {
  const results = document.getElementById("results");
  results.innerHTML = "";

  if (!meals) {
    results.innerHTML = "<p class='text-center text-danger'>No meals found.</p>";
    return;
  }

  meals.forEach(meal => {
    const col = document.createElement("div");
    col.className = "col-md-3 mb-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="card-text text-muted">${meal.strCategory || ""} ${meal.strArea ? "• " + meal.strArea : ""}</p>
          <button class="btn btn-primary mt-auto" onclick="showMealDetails('${meal.idMeal}')">
            View Recipe
          </button>
        </div>
      </div>
    `;
    results.appendChild(col);
  });
}

// Search by meal name
function searchMeal() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;
  fetch(`${API_BASE}search.php?s=${query}`)
    .then(res => res.json())
    .then(data => renderMeals(data.meals));
}

// Get random meal
function getRandomMeal() {
  fetch(`${API_BASE}random.php`)
    .then(res => res.json())
    .then(data => renderMeals(data.meals));
}

// Filter by category
function filterByCategory(category) {
  if (!category) return;
  fetch(`${API_BASE}filter.php?c=${category}`)
    .then(res => res.json())
    .then(data => renderMeals(data.meals));
}

// Filter by area
function filterByArea(area) {
  if (!area) return;
  fetch(`${API_BASE}filter.php?a=${area}`)
    .then(res => res.json())
    .then(data => renderMeals(data.meals));
}

// Search by ingredient
function searchByIngredient() {
  const ingredient = document.getElementById("ingredientInput").value.trim();
  if (!ingredient) return;
  fetch(`${API_BASE}filter.php?i=${ingredient}`)
    .then(res => res.json())
    .then(data => renderMeals(data.meals));
}

// Show detailed recipe (modal or alert for now)
function showMealDetails(id) {
  fetch(`${API_BASE}lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      alert(`Recipe: ${meal.strMeal}\n\nInstructions:\n${meal.strInstructions}`);
    });
}

// Populate dropdowns on load
function loadFilters() {
  // Categories
  fetch(`${API_BASE}list.php?c=list`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("categorySelect");
      data.meals.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.strCategory;
        opt.textContent = c.strCategory;
        select.appendChild(opt);
      });
    });

  // Areas
  fetch(`${API_BASE}list.php?a=list`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("areaSelect");
      data.meals.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.strArea;
        opt.textContent = a.strArea;
        select.appendChild(opt);
      });
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", loadFilters);