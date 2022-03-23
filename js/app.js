'use strict';
/* Instructions: 

As a user, I would like to display three unique products by chance so that the viewers can pick a favorite.

Create a constructor function that creates an object associated with each product, and has the following properties:
Name of the product
File path of image
Times the image has been shown
Create an algorithm that will randomly generate three unique product images from the images directory and display them side-by-side-by-side in the browser window.

For each of the three images, increment its property of times it has been shown by one.

Attach an event listener to the section of the HTML page where the images are going to be displayed.

Once the users ‘clicks’ a product, generate three new products for the user to pick from.
As a user, I would like to track the selections made by viewers so that I can determine which products to keep for the catalog.
In the constructor function define a property to hold the number of times a product has been clicked.

After every selection by the viewer, update the newly added property to reflect if it was clicked.

As a user, I would like to control the number of rounds a user is presented with so that I can control the voting session duration.
By default, the user should be presented with 25 rounds of voting before ending the session.
Keep the number of rounds in a variable to allow the number to be easily changed for debugging and testing purposes.
As a user, I would like to view a report of results after all rounds of voting have concluded so that I can evaluate which products were the most popular.
Create a property attached to the constructor function itself that keeps track of all the products that are currently being considered.

After voting rounds have been completed, remove the event listeners on the product.

Add a button with the text View Results, which when clicked displays the list of all the products followed by the votes received, and number of times seen for each. Example: banana had 3 votes, and was seen 5 times.

NOTE: Displayed product names should match the file name for the product. Example: the product represented with dog-duck.jpg should be displayed to the user as exactly “dog-duck” when the results are shown.

Stretch Goals
Handle the display and voting for an arbitrary number of images
Using a variable, declare in your JS how many images to show.
Based on that value, dynamically create that many <img> tags
Also based on that value, ensure that your randomizer is properly handling the specified number of images for display and repeat tracking. */

/******************************       Global Variables       ********************************/
let productArray = [];
let rounds = 25;

/******************************       DOM References       **********************************/
let container = document.getElementById('container');
let imgOne = document.getElementById('img1');
let imgTwo = document.getElementById('img2');
let imgThree = document.getElementById('img3');

let ctx = document.getElementById('myChart').getContext('2d');

/******************************       Get local storage       *******************************/

let storedProducts = localStorage.getItem('product');
let parsedProducts = JSON.parse(storedProducts);

// console.log(storedProducts);
// console.log(parsedProducts);

/******************************       Constructor Function        ***************************/
function Product(name, fileExtension = 'jpg') {
    this.name = name;
    this.image = `images/${name}.${fileExtension}`;
    this.views = 0;
    this.clicks = 0;

    productArray.push(this);
}

/////// Objects /////////

/////// If'n it's storedProducts /////////

if (storedProducts) {
    productArray = parsedProducts;
} else {
new Product('bag');
new Product('banana');
new Product('bathroom');
new Product('boots');
new Product('breakfast');
new Product('bubblegum');
new Product('chair');
new Product('cthulhu');
new Product('dog-duck');
new Product('dragon');
new Product('pen');
new Product('pet-sweep');
new Product('scissors');
new Product('shark');
new Product('sweep', 'png');
new Product('tauntaun');
new Product('unicorn');
new Product('water-can');
new Product('wine-glass');
}

/******************************       Helper Functions       ********************************/
///////// Random Numberizer /////////
function randomProduct() {
    return Math.floor(Math.random() * productArray.length);
}

///////// Unique rounds /////////
let uniqueProducts = [];

///////// Render images /////////
function renderImages() {

// Unique rounds loop
    while (uniqueProducts.length < 6) {
        let rando = randomProduct();
        if(!uniqueProducts.includes(rando)) {
            uniqueProducts.push(rando);
        } 
    }

    let r1 = uniqueProducts.shift();
    let r2 = uniqueProducts.shift();
    let r3 = uniqueProducts.shift();

    // for (let i = 0; i < 6; i++) {
    //     if (r1 === r2) {
    //         r2 = randomProduct();
    //     } else if (r1 === r3) {
    //         r3 = randomProduct();
    //     } else if (r2 === r3) {
    //         r3 = randomProduct();
    //     }
    // }

    imgOne.src = productArray[r1].image;
    imgOne.alt = productArray[r1].name;
    productArray[r1].views++;

    imgTwo.src = productArray[r2].image;
    imgTwo.alt = productArray[r2].name;
    productArray[r2].views++;

    imgThree.src = productArray[r3].image;
    imgThree.alt = productArray[r3].name;
    productArray[r3].views++;

    console.log(uniqueProducts);

} renderImages();
    
/******************************       Graph Render Fx       *********************************/
function renderGraph() {

///////// Array for muh graphs /////////
let productNames = [];
let productClicks = [];
let productViews = [];

///////// For loop for above empty arrays to push data into graph /////////
for (let i = 0; i < productArray.length; i++) {
    productNames.push(productArray[i].name);
    productClicks.push(productArray[i].clicks);
    productViews.push(productArray[i].views);
}

///////// THE HOLY GRAPH /////////
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: productNames,
        datasets: [{
            label: 'Number of clicks',
            data: productClicks,
            backgroundColor: [
                'rgba(255, 60, 0, 0.5)'
            ],
            borderColor: [
                'rgba(255, 60, 0, 1)'
            ],
            borderWidth: 3
        },
        {
            label: 'Number of views',
            data: productViews,
            backgroundColor: [
                'rgba(112, 12, 69, 0.5)'
            ],
            borderColor: [
                'rgba(112, 12, 69, 1)'
            ],
            borderWidth: 3
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    } 
});
} 

/******************************       Event Handlers       **********************************/
///////// Adds clicks and calls render /////////
function clickyClick(event) {
    let imgClicked = event.target.alt;

    for (let i = 0; i < productArray.length; i++) {
        if (imgClicked === productArray[i].name) {
            productArray[i].clicks++
        }
    }
    rounds--;
    if (rounds === 0) {
        container.removeEventListener('click', clickyClick);
        renderGraph()

    /**********       Step 1: Local Storage hath begun      **********/
        let stringyThingy = JSON.stringify(productArray);
        localStorage.setItem('product', stringyThingy);
        // console.log('JSON.stringified', stringyThingy);

        return;
    }
    renderImages();
}

/******************************       Event Listeners       *********************************/
container.addEventListener('click', clickyClick);
