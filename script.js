// DOM Elements
const pollQuestionInput = document.getElementById('pollQuestion');
const optionsContainer = document.getElementById('optionsContainer');
const addOptionBtn = document.getElementById('addOptionBtn');
const createPollBtn = document.getElementById('createPollBtn');
const pollListContainer = document.getElementById('pollList');

// Default poll
const defaultPoll = {
    id: 'default',
    question: "What is your favorite Indian car brand?",
    options: [
        { text: "Tata", votes: 0 },
        { text: "Maruti", votes: 0 },
        { text: "Mahindra", votes: 0 }
    ]
};

// Load polls from local storage
let polls = JSON.parse(localStorage.getItem('polls')) || [];

// Ensure default poll is always present
function ensureDefaultPoll() {
    if (!polls.some(poll => poll.id === 'default')) {
        polls.unshift(defaultPoll);
    }
}

// Check which page we're on
const isCreatePollPage = document.querySelector('#createPoll') !== null;

// Add option input
function addOptionInput() {
    const optionInput = document.createElement('div');
    optionInput.classList.add('option-input');
    optionInput.innerHTML = `
        <input type="text" placeholder="Enter an option">
        <button class="removeOptionBtn">Remove</button>
    `;
    optionsContainer.appendChild(optionInput);

    // Add event listener to remove button
    optionInput.querySelector('.removeOptionBtn').addEventListener('click', function() {
        optionsContainer.removeChild(optionInput);
    });
}

// Create a new poll
if (isCreatePollPage) {
    // Add initial option inputs
    addOptionInput();
    addOptionInput();

    // Add option button event listener
    addOptionBtn.addEventListener('click', addOptionInput);

    // Create poll button event listener
    createPollBtn.addEventListener('click', () => {
        const question = pollQuestionInput.value.trim();
        const optionInputs = optionsContainer.querySelectorAll('input[type="text"]');
        const options = Array.from(optionInputs).map(input => input.value.trim()).filter(option => option !== '');

        if (question && options.length >= 2) {
            const newPoll = {
                id: Date.now(),
                question,
                options: options.map(option => ({ text: option, votes: 0 }))
            };

            polls.push(newPoll);
            savePollsToLocalStorage();

            // Clear input fields
            pollQuestionInput.value = '';
            optionsContainer.innerHTML = '';
            addOptionInput();
            addOptionInput();

            alert('Poll created successfully!');
        } else {
            alert('Please enter a question and at least two options.');
        }
    });
}

// Render polls with voting options and results
function renderPolls() {
    if (!pollListContainer) return;
    
    ensureDefaultPoll();
    
    pollListContainer.innerHTML = '<h2>Active Polls</h2>';
    polls.forEach(poll => {
        const pollItem = document.createElement('div');
        pollItem.classList.add('poll-item');
        
        const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
        
        pollItem.innerHTML = `
            <h3>${poll.question}</h3>
            ${poll.options.map(option => `
                <div class="poll-option">
                    <span>${option.text}</span>
                    <button onclick="vote('${poll.id}', '${option.text}')">Vote</button>
                </div>
                <div class="result-bar" style="width: ${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%"></div>
                <p class="result-text">${option.votes} vote(s) (${totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0}%)</p>
            `).join('')}
            <p>Total votes: ${totalVotes}</p>
        `;
        pollListContainer.appendChild(pollItem);
    });
}

// Vote for an option
function vote(pollId, optionText) {
    const poll = polls.find(p => p.id.toString() === pollId.toString());
    if (poll) {
        const option = poll.options.find(o => o.text === optionText);
        if (option) {
            option.votes++;
            savePollsToLocalStorage();
            renderPolls();
        }
    }
}

// Save polls to local storage
function savePollsToLocalStorage() {
    ensureDefaultPoll();
    localStorage.setItem('polls', JSON.stringify(polls));
}

// Initialize the page
if (!isCreatePollPage) {
    renderPolls();
} else {
    ensureDefaultPoll();
    savePollsToLocalStorage();
}