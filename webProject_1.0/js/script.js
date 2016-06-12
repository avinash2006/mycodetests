$(function() {
	
	$("#navbarToggle").blur(function(event){
		var screenWidth = window.innerWidth;
		if(screenWidth < 768){
			$("#collapsable-nav").collapse('hide');
		}
	});
});

(function(global){

var dc = {};
var homeHtml = "snippet/mainPage-snippet.html";
var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
var allCategoriesTitleHtml = "snippet/categories-title-snippet.html";
var caterogryHtml = "snippet/category-snippet.html";
var menuItemsUrl = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemTitleHtml = "snippet/menu-item-title.html";
var menuItemHtml = "snippet/menu-item.html";

var insertHtml = function(selector, html){
	var targetElement = document.querySelector(selector);
	targetElement.innerHTML = html;
};

var showLoading = function(selector){
	var html = "<div class = 'text-center'>";
	html += "<img src = 'images/ajax-loader.gif'></div>"
	insertHtml(selector, html);
};

var insertProperty = function(string, propName, propValue){
	var propToReplace = "{{" + propName + "}}";

	string = string.replace(new RegExp(propToReplace, "g"), propValue);
	return string;
};

document.addEventListener("DOMContentLoaded", function(event){
	showLoading("#main_container");
	$ajaxUtils.sendGetRequest(
		homeHtml,
		function(responseText){
			document.querySelector("#main_container")
			.innerHTML = responseText;
		},
		false)
});

dc.loadMenuCategories = function(){
	showLoading("#main_container");
	$ajaxUtils.sendGetRequest(
		allCategoriesUrl,
		buildAndShowCategoriesHTML);
};

dc.loadMenuItems = function(category){
	showLoading("#main_container");
	$ajaxUtils.sendGetRequest(
		menuItemsUrl + category,
		buildAndShowMenuItemsHTML);
};


var setMenuToActive = function(){
	var classes = document.querySelector("#navbar-homeButton").className;

	classes = classes.replace(new RegExp("active" , "g"), "");

	document.querySelector("#navbar-homeButton").className = classes;

	classes = document.querySelector("navbar-menuButton").className;

	if(classes.indexOf("active") == -1){
		classes += "active";
		document.querySelector("#navbar-menuButton").className = classes;
	}
};

function buildAndShowMenuItemsHTML(categoryMenuItems){
	$ajaxUtils.sendGetRequest(
		menuItemTitleHtml,
		function(menuItemTitleHtml){
			$ajaxUtils.sendGetRequest(
				menuItemHtml,
				function(menuItemHtml){
					var ItemView = buildItemView(
						categoryMenuItems,
						menuItemTitleHtml,
						menuItemHtml);

					insertHtml("#main_container", ItemView);
				}, false);

		}, false);
}

function buildItemView(categoryMenuItems, menuItemTitleHtml, menuItemHtml){

	menuItemTitleHtml = insertProperty(menuItemTitleHtml, "name", categoryMenuItems.category.name);
	menuItemTitleHtml - insertProperty(menuItemTitleHtml, "special_instruction", categoryMenuItems.category.special_instruction);

	var finalHtml = menuItemTitleHtml;
	finalHtml += "<section class = 'row'>";

	var menuItems = categoryMenuItems.menu_items;
	var cat_shortname = categoryMenuItems.category.short_name;

	for( var i = 0; i < menuItems.length; i++){
		var html = menuItemHtml;

		html = insertProperty(html, "short_name", menuItems[i].short_name);

		html = insertProperty(html, "catShortName", cat_shortname);

		html = insertItemPrice(html, "price_small", menuItems[i].price_small);

		//insertProperty(html, "price_small", menuItems[i].price_small);

		html = insertProperty(html, "small_portion_name", menuItems[i].small_portion_name);

		//html = insertProperty(html, "price_large", menuItems[i].price_large);
		html = insertItemPrice(html, "price_large", menuItems[i].price_large);

		html = insertProperty(html, "large_portion_name", menuItems[i].large_portion_name);

		html = insertProperty(html, "name", menuItems[i].name);

		html = insertProperty(html, "description", menuItems[i].description);
		// Add clearfix after every second menu item
    if (i % 2 != 0) {
      html += 
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    	finalHtml += html;

	}

	finalHtml += "</section>";
	return finalHtml;
}

function insertItemPrice(html, priceName, priceValue){
	if(!priceValue){
		html = insertProperty(html, priceName, "");
	}

	priceValue = "$" + priceValue;
	html = insertProperty(html, priceName, priceValue);

	return html;
}

function buildAndShowCategoriesHTML(categories){
	$ajaxUtils.sendGetRequest(
		allCategoriesTitleHtml,
		function(allCategoriesTitleHtml){
			$ajaxUtils.sendGetRequest(
				caterogryHtml,
				function(caterogryHtml){
					var categoriesView = 
					buildCategoriesView(
						categories, 
						allCategoriesTitleHtml, 
						caterogryHtml);

					insertHtml("#main_container", categoriesView);
				}, 
				false);
		},
		false);
}

function buildCategoriesView(categories,allCategoriesTitleHtml, caterogryHtml){
	var finalHtml = allCategoriesTitleHtml;

	finalHtml += "<section class = 'row'>";

	for (var i = 0; i < categories.length; i++) {
		var html = caterogryHtml;

		var name = "" + categories[i].name;

		var short_name = "" + categories[i].short_name;

		html = insertProperty(html, "name", name);
		html = insertProperty(html, "short_name", short_name);

		finalHtml += html; 
	}

	finalHtml += "</section>";
	return finalHtml;
}

global.$dc = dc;


})(window);
