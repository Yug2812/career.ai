const API_URL = 'http://localhost:3000/api';

// Global Store: Centralized State Management with Observer Pattern
const Store = {
    state: {
        isLoggedIn: false,
        userName: null,
        userEmail: null,
        userId: null, // Critical for API calls
        currentView: 'landingPage', 
        currentSection: 'quizSection',
        profileDescription: '',
        quizResults: null,
        resumeFeedback: null,
        chatHistory: [] // New state for chat messages
    },
    listeners: [],
    
    subscribe(listener) {
        this.listeners.push(listener);
    },
    
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    },
    
    update(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }
};

// --- ROUTER & VIEW RENDERING ---

function router() {
    let fullHash = window.location.hash.slice(1);
    let [hash, queryString] = fullHash.split('?');
    
    // Added 'termsPage' to the list of main pages
    const pages = ['landingPage', 'loginPage', 'registerPage', 'helpPage', 'dashboardPage', 'forgotPasswordPage', 'termsPage'];
    const sections = ['quizSection', 'recommendationsSection', 'skillsSection', 'resumeSection', 'resumeBuilderSection', 'chatbotComingSoonSection', 'profileSection'];

    if (sections.includes(hash)) {
        if (Store.state.isLoggedIn) {
            Store.update({ 
                currentView: 'dashboardPage', 
                currentSection: hash 
            });
            return;
        } else {
            window.location.hash = '#loginPage';
            return;
        }
    } 

    if (pages.includes(hash)) {
        // If navigating to login while already logged in, force dashboard
        if (hash === 'loginPage' && Store.state.isLoggedIn) {
            Store.update({ currentView: 'dashboardPage' });
            return;
        }
        Store.update({ currentView: hash });
        return;
    } 
    
    if (hash === '' || !pages.includes(hash)) {
        // This ensures the page is correctly redirected to #landingPage on initial load
        window.location.hash = Store.state.isLoggedIn ? '#dashboardPage' : '#landingPage';
        return;
    }
}

// Helper to get query params from current hash
function getHashQueryParam(key) {
    const fullHash = window.location.hash.slice(1);
    const parts = fullHash.split('?');
    if (parts.length < 2) return null;
    const params = new URLSearchParams(parts[1]);
    return params.get(key);
}

// --- RENDERING FUNCTIONS ---

// Renders the list of recommended careers
function renderRecommendations(results) {
    const recommendationsList = document.getElementById('recommendationsList');
    if (!recommendationsList) return;

    if (!results || !results.recommendations) {
        recommendationsList.innerHTML = '<p class="text-muted">Please complete the career quiz to see your personalized recommendations.</p>';
        return;
    }

    recommendationsList.innerHTML = '';
    results.recommendations.forEach(career => {
        const cardHtml = `
            <div class="col-md-6">
                <div class="card p-3 h-100">
                    <h5>${career}</h5>
                    <p class="text-muted">A brief description of this career path.</p>
                </div>
            </div>
        `;
        recommendationsList.innerHTML += cardHtml;
    });
}

// Renders the Skills Gap section (static mock + progress bar)
function renderSkillsSection(state) {
    const progressBar = document.getElementById('readinessProgress');
    const targetCareerEl = document.getElementById('targetCareerName');
    const readinessEl = document.querySelector('#readinessProgress');
    
    if (progressBar && targetCareerEl && readinessEl) {
        const results = state.quizResults;
        if (results) {
            const readiness = results.skillReadiness;
            const target = results.targetCareer;

            targetCareerEl.textContent = target;
            readinessEl.textContent = `${readiness}% Ready`;
            readinessEl.style.width = `${readiness}%`;
            readinessEl.setAttribute('aria-valuenow', readiness);
            
            // Note: Hard Skills/Learning Roadmap lists remain static as mock data is not complex enough to update them dynamically.
        }
    }
}

// Renders the chat messages
function renderChat(state) {
    const chatMessagesEl = document.getElementById('chatMessages');
    if (!chatMessagesEl) return;
    
    chatMessagesEl.innerHTML = '';
    
    if (state.chatHistory.length === 0) {
        chatMessagesEl.innerHTML = '<div class="text-center text-muted small p-2">Ask me anything about careers, skills, or job market trends!</div>';
        return;
    }
    
    state.chatHistory.forEach(msg => {
        const msgClass = msg.role === 'user' ? 'text-end' : 'text-start';
        const bubbleClass = msg.role === 'user' ? 'bg-primary text-white' : 'bg-light text-dark';
        
        const messageHtml = `
            <div class="${msgClass} mb-2">
                <span class="d-inline-block p-2 rounded-lg shadow-sm ${bubbleClass}" style="max-width: 80%;">
                    ${msg.text}
                </span>
            </div>
        `;
        chatMessagesEl.innerHTML += messageHtml;
    });
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight; // Auto-scroll to bottom
}

// Main rendering function that subscribes to the Store
function renderApp(state) {
    // 1. View & Section Management (Router Logic)
    document.querySelectorAll('#content > div').forEach(el => el.classList.add('d-none'));

    const targetPage = document.getElementById(state.currentView);
    if (targetPage) {
        targetPage.classList.remove('d-none');
    }
    
    if (state.currentView === 'dashboardPage') {
        document.querySelectorAll('#dashboardPage .content-section').forEach(el => el.classList.add('d-none'));

        const targetSection = document.getElementById(state.currentSection);
        if (targetSection) {
            targetSection.classList.remove('d-none');
        }

        document.querySelectorAll('#dashboard-sidebar a').forEach(link => {
            link.classList.remove('active', 'active-sidebar', 'btn-primary');
            link.classList.add('btn-outline-primary');
        });
        const activeLink = document.querySelector(`#dashboard-sidebar a[href="#${state.currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'active-sidebar', 'btn-primary');
            activeLink.classList.remove('btn-outline-primary');
        }
    }

    // 2. Dynamic UI Updates (Data Binding)
    updateNavbar(state);
    if (state.isLoggedIn) {
        document.querySelectorAll('#userName, #profileName, #navUserName').forEach(el => {
            if(el) el.textContent = state.userName;
        });
        if (document.getElementById('profileEmail')) {
             document.getElementById('profileEmail').textContent = state.userEmail;
        }
        if (document.getElementById('problemDescription')) {
            document.getElementById('problemDescription').value = state.profileDescription || '';
        }
        
        // Render specific dashboard content
        renderRecommendations(state.quizResults);
        renderSkillsSection(state);
        renderChat(state);
    }

    // 3. Update Navbar Active Links
    document.querySelectorAll('#mainNavbar .nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    const publicActiveLink = document.querySelector(`#mainNavbar .nav-link[href="#${state.currentView}"]`);
    if(publicActiveLink) {
        publicActiveLink.classList.add('active');
        publicActiveLink.setAttribute('aria-current', 'page');
    }

    // Scroll to top on navigation change
    window.scrollTo({ top: 0, behavior: "instant" });
}

// Function to update the navbar dynamically based on login status (uses state)
function updateNavbar(state) {
    const navLinksContainer = document.getElementById('navLinks');
    navLinksContainer.innerHTML = '';
    
    if (state.isLoggedIn) {
        navLinksContainer.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#landingPage">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#dashboardPage">Dashboard</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#helpPage">Help</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user-circle me-2"></i> <span id="navUserName">${state.userName || 'User'}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#profileSection">Profile</a></li>
                    <li><a class="dropdown-item" href="#resumeBuilderSection">Resume Builder</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <button class="dropdown-item" id="themeToggleBtnDashboard" aria-label="Toggle Day/Night Theme">
                            <i class="fas fa-sun me-2"></i>Toggle Theme
                        </button>
                    </li>
                    <li><button class="dropdown-item" id="navLogout">Logout</button></li>
                </ul>
            </li>
            <li class="nav-item d-flex align-items-center ms-3">
                <button id="themeToggleBtnLogged" class="btn btn-sm btn-outline-secondary rounded-pill" aria-label="Toggle Day/Night Theme">
                    <i class="fas fa-moon"></i>
                </button>
            </li>
            <li class="nav-item d-flex align-items-center ms-3 d-lg-none">
                <button id="themeToggleBtnPublic" class="btn btn-sm btn-outline-secondary rounded-pill" aria-label="Toggle Day/Night Theme">
                    <i class="fas fa-moon"></i>
                </button>
            </li>
        `;
        document.getElementById('navLogout').addEventListener('click', () => {
            Store.update({
                isLoggedIn: false,
                userName: null,
                userEmail: null,
                userId: null,
                profileDescription: null,
                quizResults: null,
                resumeFeedback: null,
                chatHistory: []
            });
            // After logout, always go to Home (landingPage)
            window.location.hash = '#landingPage';
        });
        
    } else {
        navLinksContainer.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#landingPage">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#helpPage">Help</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#loginPage">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#registerPage">Sign Up</a>
            </li>
            <li class="nav-item d-flex align-items-center ms-3">
                <button id="themeToggleBtnPublic" class="btn btn-sm btn-outline-secondary rounded-pill" aria-label="Toggle Day/Night Theme">
                    <i class="fas fa-moon"></i>
                </button>
            </li>
        `;
    }

    document.querySelectorAll('#themeToggleBtnPublic, #themeToggleBtnDashboard, #themeToggleBtnLogged').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    });
}

// --- INITIALIZATION AND THEME LOGIC (kept the same) ---

function setTheme(theme) {
    const body = document.body;
    const publicBtnIcon = document.querySelector('#themeToggleBtnPublic i');
    const dashboardBtnIcon = document.querySelector('#themeToggleBtnDashboard i');
    const loggedBtnIcon = document.querySelector('#themeToggleBtnLogged i');
    const icons = [publicBtnIcon, dashboardBtnIcon, loggedBtnIcon].filter(i => i); 
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        icons.forEach(icon => {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        });
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        icons.forEach(icon => {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        });
    }
    localStorage.setItem('theme', theme);
}

function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// --- API FETCHERS ---

// Fetches user profile data after login or on dashboard load
async function fetchUserProfile(userId) {
    try {
        const response = await axios.get(`${API_URL}/profile/data/${userId}`);
        if (response.data.success) {
            const user = response.data.user;
            // Update the state with all fetched data
            Store.update({
                userName: user.name,
                userEmail: user.email,
                profileDescription: user.profileDescription,
                quizResults: user.quizResults,
                resumeFeedback: user.resumeFeedback,
                // Add any other user data here
            });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}


// --- EVENT HANDLERS ---

document.addEventListener('DOMContentLoaded', () => {
    // Initial Setup
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newTheme = event.matches ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    // Set initial style for progress bar (will be updated by renderSkillsSection)
    const progressBar = document.getElementById('readinessProgress');
    if (progressBar) {
        const value = progressBar.getAttribute('aria-valuenow');
        progressBar.style.width = value + '%';
    }
    
    // State & Routing Initialization
    Store.subscribe(renderApp);
    window.addEventListener('hashchange', router);
    router(); 

    // Handle logo click -> always go Home (landingPage), keep login state
    document.getElementById('logoLink').addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = '#landingPage';
    });

    // Help form logic
    const helpForm = document.getElementById('helpForm');
    if (helpForm) {
        helpForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Thank you! Your question has been submitted. We will get back to you shortly.');
            helpForm.reset();
        });
    }

    // SCROLL TO TOP BUTTON LOGIC
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
            scrollToTopBtn.style.opacity = "1";
        } else {
            scrollToTopBtn.style.opacity = "0";
            setTimeout(() => { scrollToTopBtn.style.display = "none"; }, 300);
        }
    };
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // CHATBOT BUTTON LOGIC
    const chatbotBtn = document.getElementById("chatbotBtn");
    if (chatbotBtn) {
        chatbotBtn.addEventListener("click", () => {
             if (Store.state.isLoggedIn) {
                window.location.hash = '#chatbotComingSoonSection';
            } else {
                window.location.hash = '#loginPage';
            }
        });
    }
    
    // Profile form logic (connected to API)
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Resume Builder form logic (NEW)
    const resumeBuilderForm = document.getElementById('resumeBuilderForm');
    if (resumeBuilderForm) {
        resumeBuilderForm.addEventListener('submit', handleResumeBuild);
    }
    
    // Chatbot submit form logic (NEW)
    const chatbotForm = document.getElementById('chatbotForm');
    if (chatbotForm) {
        chatbotForm.addEventListener('submit', handleChatbotSubmit);
    }
});


// --- FORM SUBMISSION API HANDLERS ---

async function handleAuthentication(url, name, email, password, redirect) {
    try {
        const payload = { name, email, password };
        const response = await axios.post(`${API_URL}/auth/${url}`, payload);
        
        if (response.data.success) {
            const user = response.data.user;
            Store.update({
                isLoggedIn: true,
                userName: user.name,
                userEmail: user.email,
                userId: user.id,
            });
            // Fetch all profile data now that we have the userId
            await fetchUserProfile(user.id);
            // Conditional redirect logic
            if (redirect === 'dashboard' || Store.state.currentView === 'dashboardPage') {
                window.location.hash = '#dashboardPage';
            } else if (redirect === 'home') {
                window.location.hash = '#landingPage';
            } else {
                window.location.hash = '#landingPage';
            }
        } else {
            alert(response.data.message || 'Authentication failed.');
        }
    } catch (error) {
        console.error('Authentication API Error:', error);
        alert('Server error during login/registration. Please ensure your Node.js server is running on port 3000 and try again.');
    }
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const redirect = getHashQueryParam('redirect');
    await handleAuthentication('login', null, email, password, redirect);
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const redirect = getHashQueryParam('redirect');
    await handleAuthentication('register', name, email, password, redirect);
});

document.getElementById('careerQuizForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const userId = Store.state.userId;
    if (!userId) return alert('Please log in to submit the quiz.');

    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '<div class="loading-state">Generating recommendations...</div>';
    
    // Gather quiz answers
    const answers = {
        subject: document.querySelector('input[name="subject"]:checked')?.value,
        problem: document.querySelector('input[name="problem"]:checked')?.value,
        projects: document.querySelector('input[name="projects"]:checked')?.value,
        environment: document.querySelector('input[name="environment"]:checked')?.value,
        motivation: document.querySelector('input[name="motivation"]:checked')?.value,
    };

    try {
        const response = await axios.post(`${API_URL}/quiz/submit`, { userId, answers });
        
        if (response.data.success) {
            Store.update({ quizResults: response.data.results });
            window.location.hash = '#recommendationsSection';
        } else {
            alert('Failed to submit quiz.');
        }
    } catch (error) {
        console.error('Quiz API Error:', error);
        alert('Server error while generating recommendations.');
    }
});

document.getElementById('resumeUploadForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const userId = Store.state.userId;
    if (!userId) return alert('Please log in to analyze your resume.');

    const resumeFile = document.getElementById('resumeFile').files[0];
    const feedbackArea = document.getElementById('resumeFeedbackArea');
    const analyzeBtn = document.getElementById('analyzeResumeBtn');
    
    if (resumeFile) {
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;

        // In a real app, you would use FormData here to upload the file
        // For our mock API, we only send the userId
        try {
            const response = await axios.post(`${API_URL}/resume/analyze`, { userId, fileName: resumeFile.name });
            
            if (response.data.success) {
                const results = response.data;
                
                // Update frontend state with results
                Store.update({ resumeFeedback: results }); 

                document.getElementById('matchScore').textContent = `${results.score}%`;
                
                // Update feedback list (hardcoded for now, but API provides the data)
                const feedbackList = document.getElementById('feedbackList');
                feedbackList.innerHTML = results.feedback.map(item => `
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 py-1">
                        ${item.item} <span class="badge ${item.score === 'Excellent' ? 'bg-success' : (item.score === 'Needs work' ? 'bg-danger' : 'bg-warning')}">${item.score}</span>
                    </li>
                `).join('');

                feedbackArea.classList.remove('d-none');
            } else {
                alert('Resume analysis failed.');
            }
        } catch (error) {
            console.error('Resume Analysis API Error:', error);
            alert('Server error during resume analysis.');
        } finally {
            analyzeBtn.textContent = 'Analyze Resume';
            analyzeBtn.disabled = false;
        }
    }
});

async function handleProfileUpdate(event) {
    event.preventDefault();
    const userId = Store.state.userId;
    if (!userId) return;
    
    const problemDescription = document.getElementById('problemDescription').value;
    const saveBtn = event.target.querySelector('button[type="submit"]');

    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
        const response = await axios.post(`${API_URL}/profile/update`, { userId, problemDescription });
        
        if (response.data.success) {
            Store.update({ profileDescription: problemDescription });
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile.');
        }
    } catch (error) {
        console.error('Profile Update API Error:', error);
        alert('Server error while saving profile.');
    } finally {
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
    }
}

// --- NEW FUNCTION: AI RESUME BUILDER LOGIC ---
async function handleResumeBuild(event) {
    event.preventDefault();
    const userId = Store.state.userId;
    if (!userId) return;
    
    const goal = document.getElementById('builderGoal').value;
    const highlights = document.getElementById('builderHighlights').value;
    const resultArea = document.getElementById('builderResultArea');
    const submitBtn = event.target.querySelector('button[type="submit"]');

    submitBtn.textContent = 'Generating...';
    submitBtn.disabled = true;
    resultArea.classList.add('d-none');

    // Mock API call to simulate resume generation
    try {
        // We simulate a 2.5s delay for the AI generation
        await new Promise(resolve => setTimeout(resolve, 2500)); 
        
        const mockResumeContent = `
            <h4 class="text-primary">${Store.state.userName || 'Jane Doe'}</h4>
            <p class="small text-muted mb-4">${Store.state.userEmail || 'user@example.com'} | Phone: (555) 123-4567 | LinkedIn.com/in/user</p>

            <h5 class="fw-bold border-bottom pb-1">Summary</h5>
            <p>Highly motivated professional targeting a role as a <strong>${goal}</strong>. Brings ${highlights.length > 50 ? highlights.substring(0, 50) + '...' : highlights}. Successfully translated complex business requirements into robust technical solutions.</p>

            <h5 class="fw-bold border-bottom pb-1 mt-4">Experience</h5>
            <p class="mb-1"><strong>Senior Consultant</strong> | Tech Solutions | 2020 - Present</p>
            <ul>
                <li>Led a team of five developers in migrating legacy systems to modern cloud infrastructure (AWS/Azure).</li>
                <li>Achieved 25% efficiency gain in core processes using Python automation scripts.</li>
            </ul>

            <h5 class="fw-bold border-bottom pb-1 mt-4">Skills</h5>
            <p><strong>Targeted Skills for ${goal}:</strong> JavaScript, Python, Cloud (AWS/Azure), SQL, Data Modeling.</p>
        `;
        
        document.getElementById('resumeDraftContent').innerHTML = mockResumeContent;
        resultArea.classList.remove('d-none');
        alert('Resume draft generated!');

    } catch (error) {
        console.error('Resume Builder Error:', error);
        alert('An error occurred during resume generation.');
    } finally {
        submitBtn.textContent = 'Generate Resume Draft';
        submitBtn.disabled = false;
    }
}

// --- NEW FUNCTION: AI CHATBOT LOGIC ---
async function handleChatbotSubmit(event) {
    event.preventDefault();
    const userId = Store.state.userId;
    const chatInput = document.getElementById('chatInput');
    const query = chatInput.value.trim();

    if (!userId || !query) return;
    
    // 1. Add user message to state and clear input
    const newChatHistory = [...Store.state.chatHistory, { role: 'user', text: query }];
    Store.update({ chatHistory: newChatHistory });
    chatInput.value = '';
    
    const sendBtn = document.getElementById('chatSendBtn');
    sendBtn.disabled = true;

    // 2. Call backend API
    try {
        const response = await axios.post(`${API_URL}/chatbot/query`, { userId, query });
        
        if (response.data.success) {
            const botMessage = response.data.response;
            const updatedChatHistory = [...Store.state.chatHistory, { role: 'bot', text: botMessage }];
            
            // 3. Update state with bot's response
            Store.update({ chatHistory: updatedChatHistory });
        } else {
            const errorMsg = `[Error] ${response.data.message || 'Could not connect to the chatbot service.'}`;
            Store.update({ chatHistory: [...Store.state.chatHistory, { role: 'bot', text: errorMsg }] });
        }
    } catch (error) {
        console.error('Chatbot API Error:', error);
        const errorMsg = `[Error] Failed to get response from server. (API call failed)`;
        Store.update({ chatHistory: [...Store.state.chatHistory, { role: 'bot', text: errorMsg }] });
    } finally {
        sendBtn.disabled = false;
    }
}