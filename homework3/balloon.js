// Answers to Questions
    // How can you stop events from bubbling?
        // By using event.stopPropagation()
    // How can you reverse the flow of click handlers? 
        // By using emoveEventListener

const balloonElement = document.getElementById('balloon');
document.addEventListener('keydown', handleKeyDown);
currentFontSize = 1;

function handleKeyDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
    event.stopPropagation();

    if (event.key === 'ArrowUp') {
        currentFontSize += 1;
        balloonElement.style.fontSize = currentFontSize + "rem";
        if (currentFontSize == 11) {
            balloonElement.textContent = '💥';
            document.removeEventListener('keydown', handleKeyDown);
        }
    } else if (event.key === 'ArrowDown') {
        currentFontSize -= 1;
        balloonElement.style.fontSize = currentFontSize + "rem";
    }
}
