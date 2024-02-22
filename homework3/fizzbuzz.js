for (let num = 1; num <= 1000; num++) {
    const div = document.createElement('div');

    if ((num % 3 === 0) && (num % 5 === 0)) {
        console.log("fizzbuzz");
        div.classList.add('fizzbuzz');
    } else if (num % 3 === 0) {
        console.log("fizz");
        div.classList.add('fizz');
    } else if (num % 5 === 0) {
        console.log("buzz");
        div.classList.add('buzz');
    }

    document.body.appendChild(div);
}