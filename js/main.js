// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll("[data-da]");
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute("data-da");
			if (daMove != "") {
				const daArray = daMove.split(",");
				const daPlace = daArray[1] ? daArray[1].trim() : "last";
				const daBreakpoint = daArray[2] ? daArray[2].trim() : "767";
				const daType = daArray[3] === "min" ? daArray[3].trim() : "max";
				const daDestination = document.querySelector("." + daArray[0].trim());
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute("data-da-index", number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						parent: daElement.parentNode,
						index: indexInParent(daElement),
					};
					//Заполняем массив элементов
					daElementsArray[number] = {
						element: daElement,
						destination: document.querySelector("." + daArray[0].trim()),
						place: daPlace,
						breakpoint: daBreakpoint,
						type: daType,
					};
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(
				window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)")
			);
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === "first") {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === "last") {
						actualIndex = indexOfElements(daDestination)[
							indexOfElements(daDestination).length
						];
					}
					daDestination.insertBefore(
						daElement,
						daDestination.children[actualIndex]
					);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute("data-da-index");
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace["parent"];
		const indexPlace = originalPlace["index"];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute("data-da") == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1;
			} else {
				return 1;
			}
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1;
			} else {
				return -1;
			}
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
})();

//burger menu
var burger = document.querySelector("#menu-burger");
var element = document.querySelector(".menu");
var headerBlock = document.querySelector(".header__header");

if (burger) {
	burger.addEventListener("click", openMenu);
}

function openMenu() {
	element.classList.toggle("open");
	burger.classList.toggle("change");

	if (element.classList.contains("open")) {
		headerBlock.style.padding = "0px";
		burger.style.position = "absolute";
		burger.style.right = "25px";
		burger.style.top = "22px";
		document.body.style.overflow = "hidden";
	} else if (screen.width > "470") {
		burger.style.position = "relative";
		headerBlock.style.padding = "20px 50px";
		burger.style.right = "0px";
		burger.style.top = "0px";
		document.body.style.overflow = "auto";
	} else if (screen.width <= "470") {
		burger.style.position = "relative";
		headerBlock.style.padding = "20px 25px";
		burger.style.right = "0px";
		burger.style.top = "0px";
		document.body.style.overflow = "auto";
	}
} //btnScpoll

window.onscroll = function () {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById("btnScpoll").style.display = "block";
	} else {
		document.getElementById("btnScpoll").style.display = "none";
	}
}

function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
} //more btn

(function () {
	var throttle = function throttle(type, name, obj) {
		obj = obj || window;
		var running = false;

		var func = function func() {
			if (running) {
				return;
			}

			running = true;
			requestAnimationFrame(function () {
				obj.dispatchEvent(new CustomEvent(name));
				running = false;
			});
		};

		obj.addEventListener(type, func);
	};

	throttle("resize", "optimizedResize");
})();

window.addEventListener("optimizedResize", function () {
	tracking();
});

function tracking() {
	if (
		window.innerWidth < 770 &&
		document.querySelector(".partner__shop__items27-33")
	) {
		document.querySelector(".partner__shop__items27-33").classList.add("content__parther");
	} else if (document.querySelector(".partner__shop__items27-33")) {
		document.querySelector(".partner__shop__items27-33").classList.remove("content__parther");
	}

	if (
		window.innerWidth > 770 &&
		document.querySelector(".partner__shop__items27-33")
	) {
		document.querySelector(".partner__shop__items27-33").style.display = "flex";
	} else if (document.querySelector(".partner__shop__items27-33")) {
		document.querySelector(".partner__shop__items27-33").style.display = "none";
	}

	if (window.innerWidth < 470 && document.querySelector(".servise__mb")) {
		document.querySelector(".servise__mb").classList.add("content__servise");
	} else if (document.querySelector(".servise__mb")) {
		document.querySelector(".servise__mb").classList.remove("content__servise");
	}

	if (
		window.innerWidth < 470 &&
		document.querySelector(".servise__title") &&
		document.querySelector(".servise__subtitle")
	) {
		document.querySelector(".servise__title").classList.add("content__servise");
		document.querySelector(".servise__subtitle").classList.add("content__servise");
	} else if (
		document.querySelector(".servise__title") &&
		document.querySelector(".servise__subtitle")
	) {
		document.querySelector(".servise__subtitle").classList.remove("content__servise");
		document.querySelector(".servise__title").classList.remove("content__servise");
	}

	if (window.innerWidth > 470 && document.querySelector(".servise__mb")) {
		document.querySelector(".servise__mb").style.display = "flex";
	} else if (document.querySelector(".servise__mb")) {
		document.querySelector(".servise__mb").style.display = "none";
	}
}

tracking();
var btn = document.getElementsByClassName("arrow");
var btn2 = document.getElementsByClassName("arrow2");
var btn3 = document.getElementsByClassName("arrow3");

for (var x = 0; x < btn.length; x++) {
	btn[x].addEventListener("click", function () {
		this.classList.toggle("open__btn");
		var content = document.getElementsByClassName("content__parther");

		for (var i = 0; i < content.length; i++) {
			if (this.classList.contains("open__btn")) {
				content[i].style.display = "flex";
				this.innerHTML = `<p class="arrow__text">Свернуть</p>
						<img src="img/icon/arrow.svg" alt="arrow">`;
			} else {
				content[i].style.display = "none";
				this.innerHTML = `<p class="arrow__text">Развернуть</p>
						<img src="img/icon/arrow.svg" alt="arrow">`;
			}
		}
	});
}

for (var x = 0; x < btn2.length; x++) {
	btn2[x].addEventListener("click", function () {
		this.classList.toggle("open__btn");
		var content = document.getElementsByClassName("content__servise");
		for (var i = 0; i < content.length; i++) {
			if (this.classList.contains("open__btn")) {
				console.log(content[i]);
				content[i].style.display = "flex";
				this.innerHTML = `<p class="arrow__text">Свернуть</p>
						<img src="img/icon/arrow.svg" alt="arrow">`;
			} else {
				content[i].style.display = "none";
				this.innerHTML = `<p class="arrow__text">Развернуть</p>
						<img src="img/icon/arrow.svg" alt="arrow">`;
			}
		}
	});
}

for (var x = 0; x < btn3.length; x++) {
	btn3[x].addEventListener("click", function () {
		this.classList.toggle("open__btn");
		var content = document.getElementsByClassName("content__city");
		for (var i = 0; i < content.length; i++) {
			if (this.classList.contains("open__btn")) {
				content[i].style.display = "flex";
				this.innerHTML = `<p class="arrow__text">Свернуть</p>
						<img src="img/icon/arrow.svg" alt="arrow">`;
			} else {
				content[i].style.display = "none";
				this.innerHTML = `<p class="arrow__text">Развернуть</p>
						<img src="img/icon/arrow.svg" alt="arrow">`;
			}
		}
	});
}

// modal
var ModalBtn = document.getElementById("modal-call");
var ModalBtn2 = document.getElementById("modal-call2");
var ModalBtn3 = document.getElementById("modal-call3");
var ModalBtn4 = document.getElementById("modal-call4");
var modalPromoText = document.getElementById("modal-promo-text");
var btnCopy = document.getElementById("modal-copy");
var promo = document.querySelector(".modal_promo");

//copy text
if (btnCopy) {
	btnCopy.onclick = function () {
		var copyModal = document.createElement("div");
		copyModal.className = "copyModal";
		copyModal.innerHTML = "Промокод скопирован в буфер";
		document.body.append(copyModal);
		setTimeout(function () {
			copyModal.remove();
		}, 3000);
	};
}

if (ModalBtn) {
	ModalBtn.addEventListener("click", openModal);
	btnCopy.addEventListener("click", copyCode);
}
if (ModalBtn2) {
	ModalBtn2.addEventListener("click", openModal2);
}
if (ModalBtn3) {
	ModalBtn3.addEventListener("click", openModal3);
}
if (ModalBtn4) {
	ModalBtn4.addEventListener("click", openModal4);
}

// Запрещение ввода в поле
if (modalPromoText) {
	modalPromoText.setAttribute("readonly", "true");
}

// 1 модальное окно
function openModal() {
	$(".modal-window-one").arcticmodal({
		closeOnEsc: true,
		closeOnOverlayClick: true,
		overlay: {
			css: {},
		},
	});
}

function openModal2() {
	$(".modal-window-two").arcticmodal({
		closeOnEsc: true,
		closeOnOverlayClick: true,
		overlay: {
			css: {},
		},
	});
}

function openModal3() {
	$(".modal-window-three").arcticmodal({
		closeOnEsc: true,
		closeOnOverlayClick: true,
		overlay: {
			css: {},
		},
	});
}

function openModal4() {
	$(".modal-window-fore").arcticmodal({
		closeOnEsc: true,
		closeOnOverlayClick: true,
		overlay: {
			css: {},
		},
	});
}

// Копирование промокода
function copyCode(e) {
	e.preventDefault();
	modalPromoText.select();
	document.execCommand("copy");
}