// Leave the next line, the form must be assigned to a variable named 'form' in order for the exercise test to pass
const form = document.querySelector('form');

const listOrigin = document.querySelector("#list");

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let product_value = form.elements.product.value;
    let quantity_value = form.elements.qty.value;
    const newItem = document.createElement("li"); // creating an li element in which to put our data
    newItem.innerText = `${quantity_value} ${product_value}`;
    listOrigin.appendChild(newItem);
    form.elements.product.value = '';
    form.elements.qty.value = '';
   
    console.log(`${quantity_value} ${product_value}`);
    // product_value = '';
});