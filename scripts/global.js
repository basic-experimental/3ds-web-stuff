/**
 * Generates a random float number within the given range
 * @param  {Number} min Minimum value
 * @param {Number} max Maximum value
 * @return {Number}
 */
function randf(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer within the given range
 * @param  {Number} min Minimum value
 * @param {Number} max Maximum value
 * @return {Number}
 */
function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random element of the specified array
 * @param {Array} array
 * @return {*}
 */
function pickRandom(array){
    return array[randi(0, array.length - 1 )];
}

/**
 * Performs a linear interpolation between 2 numbers
 * @param  {Number} start Current number
 * @param {Number} end Target value
 * @param {Number} speed Speed of the interpolation
 * @return {Number}
 */
function lerp(start, end, speed){
    if(speed >= 1) return end;
    return (1-speed)*start+speed*end
}

/**
 * Performs a float modulo (% operator)
 * @param  {Number} a
 * @param {Number} b
 * @return {Number}
 */
function fmod(a, b){
    return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
}

/**
 * Limits a number to the specified range
 * @param {Number} value
 * @param {Number} min Minimum value
 * @param {Number} max Maximum value
 * @return {Number}
 */
function clamp(value, min, max){
    if(value > max) value = max;
    if(value < min) value = min;

    return value;
}

/**
 * Performs a "to the power of" calculation. The ** symbol doesn't work on the 3DS
 * @param base
 * @param exponent
 * @return {number}
 */
function pow(base, exponent) {
    if (exponent === 0) return 1;

    var result = 1;
    for (var i=0; i < Math.abs(exponent); i++){
        result *= base;
    }
    if (exponent < 0) {
        return 1 / result;
    } else {
        return result;
    }
}

/**
 * Checks if the user's browser is the Nintendo 3DS browser.
 * @return {Boolean}
 */
function is3DS(){
    return includes(window.navigator.userAgent,"Nintendo 3DS");
}

/**
 * Checks if the user's browser is the DSi browser.
 * @return {Boolean}
 */
function isDSi(){
    return includes(window.navigator.userAgent, "Nintendo DSi");
}

/**
 * Checks if the user's browser is the DS browser.
 * @return {Boolean}
 */
function isDS(){
    return !isDSi() && includes(window.navigator.userAgent, "Nintendo DS");
}

/**
 * Checks if the user's browser runs on the Nintendo DS family (Including DS, DSi, 3DS)
 * @return {Boolean}
 */
function isDSFamily(){
    return isDS() || isDSi() || is3DS();
}

// array.includes and string.includes does not work on the 3DS browser
/**
 * Performs a linear interpolation between 2 numbers
 * @param  {Object, String, Array} container The object you want to search in
 * @param {*} search Value you want to check if exists
 * @return {Boolean}
 */
function includes(container,search){
    if(typeof container === "string" || Array.isArray(container)){
        return container.indexOf(search) !== -1;
    }

    return container[search] !== undefined
}

/**
 * Returns the specified array without the specified value
 * @param  {Array} array The current array
 * @param  {*} exclude The value you want to exclude
 */
function getWithout(array,exclude){
    return array.filter(function (item) {
        return item !== exclude;
    });
}


var pressStates = {}
var pressCallbacks = {
    "Left": [],
    "Up": [],
    "Right": [],
    "Down": [],
    "A": []
}

/**
 * Triggers a callback when a button is pressed once.
 * @param {String} name Name of the button
 * @param {Function} callback Function to call when the button is pressed
 */
function onBtnJustPressed(name, callback){
    const keys = Object.keys(pressCallbacks);
    for(var i=0; i<keys.length; i++) {
        const key = keys[i];
        if(key.toLowerCase() === name.toLowerCase()) {
            pressCallbacks[key].push(callback);
        }
    }
}

/**
 * Returns an Array of the pressed gamepad buttons as strings.
 * @return {[String]}
 */
function getPressedBtns(){
    const keys = Object.keys(pressStates);
    var res = [];
    for(var i=0; i<keys.length; i++) {
        const key = keys[i];
        if(pressStates[key]) res.push(key);
    }
    return res;
}

/**
 * Checks if a gamepad button is pressed
 * @param {String} name String name of the button. Any case.
 * @return {Boolean}
 */
function isBtnPressed(name){
    const keys = Object.keys(pressStates);
    name = name.toLowerCase();
    for(var i=0; i<keys.length; i++) {
        const key = keys[i];
        if(pressStates[key] && name === key.toLowerCase()) return true;
    }
    return false;
}


function registerNon3DSlink(a){
    a.onclick = function (e){
        alert("The 3DS doesn't support that page. Please open \n\n"+a.href+"\n\non a external device (with a modern browser)")
        e.preventDefault();
        return false;
    }
}
/**
 * Checks if an Element is scrollable.
 * @param {HTMLElement} element Element you want to check
 * @return {Boolean}
 */
function isScrollable(element){
    const css = window.getComputedStyle(element);

    return (
        css.overflow === "scroll" ||
        css.overflowX === "scroll" ||
        css.overflowY === "scroll"
    );
}

/**
 * Finds the first scrollable ancestor of the specified element or the element itself.
 * @param {HTMLElement} element Element you want to search ancestors of.
 * @return {HTMLElement}
 */
function findScrollableAncestor(element) {
    if(isScrollable(element)) return element;
    var parent = element.parentElement;

    while (parent) {
        if (isScrollable(parent)) return parent;
        parent = parent.parentElement;
    }
}

/////// Dependency system ///////

var availableLibs = [];

/**
 *  Checks if a library is loaded
 * @param {String} lib Name of the library
 * @return boolean
 */
function hasLib(lib) {
    return includes(availableLibs, lib);
}

/**
 * Requires the specified library to be loaded for the script to function
 * @param {String} lib Name of the library to depend on
 */
function depend(lib) {
    if(!hasLib(lib)) {
        throw "Dependency error! '" + lib + "' is not loaded.";
    }
}

/**
 * Registers a library
 * @param {String} lib Name of the library
 */
function libName(lib) {
    if(hasLib(lib)) {
        throw "This library is already registered. Is this function duplicated? Did you mean depend()?";
    }
    availableLibs.push(lib);
}

/////////////////////////////////

var forcePosition = true;

/**
 * Moves the user's camera to an optimal position.
 */
function centerScreen() {
    if(!forcePosition) return;
    const x = 40;
    const y = 227;
    if(window.scrollX === x && window.scrollY === y) return;
    window.scrollTo(x,y);
}

if(is3DS()) setInterval(centerScreen);

const keycodes = {
    13: "A",
    65: "A",
    37: "Left",
    38: "Up",
    39: "Right",
    40: "Down"
};

window.addEventListener("keydown",function(e){
    const name = keycodes[e.keyCode];
    if(name) {
        if(!pressStates[name]) {
            const callbacks = pressCallbacks[name];
            for(var i=0; i<callbacks.length; i++) {
                callbacks[i]();
            }
        }
        pressStates[name] = true;
    }
})

window.addEventListener("keyup",function(e){
    const name = keycodes[e.keyCode];
    if(name) {
        pressStates[name] = false;
    }
})

window.addEventListener("blur", function (){
    pressStates = {};
})

// This prevents the browser from moving the page using the arrow keys
function prevent(event){
    if(event.keyCode === 8) return true; //backspace
    if(event.keyCode === 116) return true; //f5
    if(event.keyCode === 13) return true; //enter

    if(event.charCode || (event.key && event.key.length === 1 )) return true; // allow character keys

    event.preventDefault();
    return false;
}

document.onkeydown = prevent;
document.onkeyup = prevent;
///////////////////////////////////////////////////////////////////////

// You can't access console logs on the 3DS, so it will show an alert when there's an error
if(is3DS()){
    window.addEventListener("error", function(e) {
        alert(e.filename+":"+e.lineno+" "+e.message);
        return false;
    })
}

// Prevent dragging

var touchStart

document.addEventListener('touchstart', function(e) {
    touchStart = e.touches[0];
    if(e.target.classList.contains("drag-protection")) e.preventDefault(); // this can't be applied globally since it breaks click events
});

document.addEventListener('touchmove', function(e){
    const scrollable = findScrollableAncestor(e.target);

    if(scrollable){
        const css = window.getComputedStyle(scrollable);

        if(css.overflow === "scroll") return;

        const touching = e.touches[0];

        const deltaX = touching.clientX - touchStart.clientX;
        const deltaY = touching.clientY - touchStart.clientY;

        var direction = 1;

        const scrollX = scrollable.scrollLeft;
        const scrollY = scrollable.scrollTop;
        const w = scrollable.scrollWidth - scrollable.clientWidth;
        const h = scrollable.scrollHeight - scrollable.clientHeight;

        if(Math.abs(deltaX) > Math.abs(deltaY)){
            // Horizontal
            if(deltaX > 0) direction = -1

            const notExtended = (direction === 1 && scrollX<w) || (direction === -1 && scrollX>0);
            if(notExtended && css.overflowX === "scroll") return true;
        }
        else {
            // Vertical
            if(deltaY < 0) direction = -1

            // TODO: Fix drag prevention not working when scrolling upwards
            const notExtended = (direction === 1 && scrollY<h) || (direction === -1 && scrollY>0);
            if(notExtended && css.overflowY === "scroll") return true;
        }

    }

    e.preventDefault();
});

window.addEventListener("load",function (){
    if(is3DS()){
        const non3dsLinks = document.getElementsByClassName("non-3ds-link");
        for(var i=0;i<non3dsLinks.length;i++) registerNon3DSlink(non3dsLinks[i]);

    } else {
        const only3ds = document.getElementsByClassName("only-3ds");
        for(var i=0;i<only3ds.length;i++){
            only3ds[i].style.display = "none";
        }
    }

    // This ensures that the canvas isn't stretched and blured
    const dualScreen = document.getElementsByClassName("dual-screen");
    for(var i=0;i<dualScreen.length;i++){
        const elm = dualScreen[i];
        if(elm.tagName.toLowerCase() === "canvas"){
            const ctx = elm.getContext("2d");
            ctx.imageSmoothingEnabled = false;

            elm.width = 320
            elm.height = 457
        }
    }
})