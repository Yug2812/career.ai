const API_BASE_URL = 'http://localhost:3000/api';

// Global Store: Centralized State Management with Observer Pattern
const Store = {
    state: {
        isLoggedIn: false,
        userName: null,
        userEmail: null,
        userId: null, // Critical for API calls
        // The currentView determines which main page div is visible
        currentView: 'landingPage', 
        // The currentSection determines which part of the dashboard is visible
        currentSection: 'quizSection',
        // Data for display
        profileDescription: 'Loading...',
        recommendations: [],
        quizResults: null,
        resumeFeedback: null
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

const pages = ['landingPage', 'loginPage', 'registerPage', 'helpPage', 'dashboardPage', 'forgotPasswordPage', 'termsPage'];
const sections = ['quizSection', 'recommendationsSection', 'skillsSection', 'resumeSection', 'resumeBuilderSection', 'chatbotComingSoonSection', 'profileSection'];

function router() {
    let hash = window.location.hash.slice(1);
    
    // Check if the hash matches a dashboard section
    if (sections.includes(hash)) {
        if (Store.state.isLoggedIn) {
            Store.update({ 
                currentView: 'dashboardPage', 
                currentSection: hash 
            });
            return;
        } else {
            // Redirect unauthenticated users trying to access dashboard sections
            window.location.hash = '#loginPage';
            return;
        }
    } 

    // Check if the hash matches a main page
    if (pages.includes(hash)) {
        Store.update({ currentView: hash });
        return;
    } 
    
    // Handle Empty or Invalid Hash
    if (hash === '' || !pages.includes(hash)) {
        // Default route based on login status
        window.location.hash = Store.state.isLoggedIn ? '#dashboardPage' : '#landingPage';
        return;
    }
}

// Function to fetch all user data after login
async function fetchUserData(userId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/profile/data/${userId}`);
        if (response.data.success) {
            const user = response.data.user;
            Store.update({
                profileDescription: user.profileDescription,
                quizResults: user.quizResults,
                resumeFeedback: user.resumeFeedback,
                // Ensure recommendations are set if quiz results exist
                recommendations: user.quizResults?.recommendations || [],
                // Ensure user data is up-to-date
                userName: user.name,
                userEmail: user.email,
            });
            // Auto-navigate to the correct section if quiz is done
            if (user.quizResults) {
                 window.location.hash = '#recommendationsSection';
            }
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Function to update the navbar dynamically based on login status (uses state)
function updateNavbar(state) {
    const navLinksContainer = document.getElementById('navLinks');
    navLinksContainer.innerHTML = '';
    
    if (state.isLoggedIn) {
        // --- LOGGED IN VIEW ---
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
                currentSection: 'quizSection' // Reset dashboard state
            });
            window.location.hash = '#landingPage'; // Redirect to landing page
        });
        
    } else {
        // --- PUBLIC VIEW (INCLUDING HOME, HELP, LOGIN, SIGNUP) ---
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

    // Re-attach theme toggle listener to new buttons
    document.querySelectorAll('#themeToggleBtnPublic, #themeToggleBtnDashboard').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    });
}


// Render App: The single function responsible for updating the entire UI based on the Store state
function renderApp(state) {
    // 1. Hide all main pages and show the active one
    document.querySelectorAll('#content > div').forEach(el => el.classList.add('d-none'));

    const targetPage = document.getElementById(state.currentView);
    if (targetPage) {
        targetPage.classList.remove('d-none');
    }
    
    // 2. Handle Dashboard-specific sections and sidebar
    if (state.currentView === 'dashboardPage') {
        // Hide all sections and show the active one
        document.querySelectorAll('#dashboardPage .content-section').forEach(el => el.classList.add('d-none'));

        const targetSection = document.getElementById(state.currentSection);
        if (targetSection) {
            targetSection.classList.remove('d-none');
        }

        // Update dashboard sidebar active state (now using href for selection)
        document.querySelectorAll('#dashboard-sidebar a').forEach(link => {
            link.classList.remove('active', 'active-sidebar', 'btn-primary');
            link.classList.add('btn-outline-primary');
        });
        const activeLink = document.querySelector(`#dashboard-sidebar a[href="#${state.currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'active-sidebar', 'btn-primary');
            activeLink.classList.remove('btn-outline-primary');
        }
        
        // Populate profile and quiz data
        updateDashboardContent(state);
    }

    // 3. Update all user-related UI elements (runs on every state change)
    updateNavbar(state);
    if (state.isLoggedIn) {
        document.querySelectorAll('#userName, #profileName, #navUserName').forEach(el => {
            if(el) el.textContent = state.userName;
        });
        if (document.getElementById('profileEmail')) {
             document.getElementById('profileEmail').textContent = state.userEmail;
        }
        // Set profile textarea value (if element exists)
        const descEl = document.getElementById('problemDescription');
        if (descEl) {
            descEl.value = state.profileDescription;
        }
    }


    // 4. Update Navbar Public/Dashboard Active Links (for underlining)
    document.querySelectorAll('#mainNavbar .nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    // Check main page links for active state (Home, Help, Login, Dashboard)
    let activeHash = state.currentView;
    if (state.isLoggedIn && activeHash === 'dashboardPage') {
        // The dashboard link itself is active
        activeHash = 'dashboardPage'; 
    } else if (!state.isLoggedIn && (activeHash === 'loginPage' || activeHash === 'registerPage')) {
        // Special case: keep Login/Signup links active when on their pages
        // Find the correct active link based on the view
        const loginLink = document.querySelector(`#mainNavbar .nav-link[href="#loginPage"]`);
        const registerLink = document.querySelector(`#mainNavbar .nav-link[href="#registerPage"]`);
        if (activeHash === 'loginPage' && loginLink) {
             loginLink.classList.add('active');
             loginLink.setAttribute('aria-current', 'page');
        } else if (activeHash === 'registerPage' && registerLink) {
             registerLink.classList.add('active');
             registerLink.setAttribute('aria-current', 'page');
        }
        // Early return if we highlighted login/register page
        if (activeHash === 'loginPage' || activeHash === 'registerPage') return;
    }
    
    // Now handle Home/Dashboard/Help/Terms links
    const publicActiveLink = document.querySelector(`#mainNavbar .nav-link[href="#${activeHash}"]`);
    if(publicActiveLink) {
        publicActiveLink.classList.add('active');
        publicActiveLink.setAttribute('aria-current', 'page');
    }

    // Scroll to top on navigation change
    window.scrollTo({ top: 0, behavior: "instant" });
}

function updateDashboardContent(state) {
    // 1. Update Quiz Recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    if (state.quizResults && recommendationsList) {
        recommendationsList.innerHTML = '';
        state.quizResults.recommendations.forEach(career => {
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
    } else if (recommendationsList && state.currentSection === 'recommendationsSection') {
         recommendationsList.innerHTML = '<p class="text-muted">Please complete the career quiz to see your personalized recommendations.</p>';
    }
    
    // 2. Update Skills Section
    if (state.quizResults) {
        const readinessProgress = document.getElementById('readinessProgress');
        const targetCareerName = document.getElementById('targetCareerName');
        if (readinessProgress) {
            const readiness = state.quizResults.skillReadiness;
            readinessProgress.style.width = readiness + '%';
            readinessProgress.textContent = `${readiness}% Ready`;
            readinessProgress.setAttribute('aria-valuenow', readiness);
        }
        if (targetCareerName) {
            targetCareerName.textContent = state.quizResults.targetCareer;
        }
    }
    
    // 3. Update Resume Analysis Results
    const feedbackArea = document.getElementById('resumeFeedbackArea');
    if (state.resumeFeedback && feedbackArea) {
        feedbackArea.classList.remove('d-none');
        document.getElementById('matchScore').textContent = `${state.resumeFeedback.score}%`;
        const feedbackList = document.getElementById('feedbackList');
        feedbackList.innerHTML = state.resumeFeedback.feedback.map(item => `
            <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 py-1">
                ${item.item} <span class="badge bg-${item.score === 'Excellent' ? 'success' : item.score === 'Good' ? 'primary' : 'warning'}">${item.score}</span>
            </li>
        `).join('');
    } else if (feedbackArea) {
        feedbackArea.classList.add('d-none');
    }
}


// Theme Toggle Logic (Kept the same)
function setTheme(theme) {
    const body = document.body;
    const publicBtnIcon = document.querySelector('#themeToggleBtnPublic i');
    const dashboardBtnIcon = document.querySelector('#themeToggleBtnDashboard i');
    const icons = [publicBtnIcon, dashboardBtnIcon].filter(i => i); 
    
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

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Setup
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newTheme = event.matches ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    const progressBar = document.getElementById('readinessProgress');
    if (progressBar) {
        const value = progressBar.getAttribute('aria-valuenow');
        progressBar.style.width = value + '%';
    }
    
    // 2. State & Routing Initialization
    Store.subscribe(renderApp);
    window.addEventListener('hashchange', router);
    
    // Check local storage for persistent user ID (basic session mock)
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedUserId && storedUserName && storedUserEmail) {
        Store.update({
            isLoggedIn: true,
            userId: storedUserId,
            userName: storedUserName,
            userEmail: storedUserEmail
        });
        // Fetch user data right after setting initial state
        fetchUserData(storedUserId);
    }
    
    router(); // Call once on load to determine initial view

    // 3. Global Event Listeners
    document.getElementById('logoLink').addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = Store.state.isLoggedIn ? '#dashboardPage' : '#landingPage';
    });

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
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    
    // Remove the unused chatbotBtn listener since the button was removed from HTML
    // const chatbotBtn = document.getElementById("chatbotBtn");
    // if (chatbotBtn) { chatbotBtn.addEventListener("click", () => { alert("AI Chatbot coming soon!"); }); }
});

// --- FORM SUBMISSION EVENT LISTENERS ---

async function handleSuccessfulAuth(user) {
    // Save state to local storage for persistence
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);

    // Update global store
    Store.update({
        isLoggedIn: true,
        userName: user.name,
        userEmail: user.email,
        userId: user.id
    });
    
    // Fetch all profile and quiz data before redirecting to dashboard
    await fetchUserData(user.id);

    // Redirect to dashboard (or recommendations if quiz done)
    window.location.hash = Store.state.quizResults ? '#recommendationsSection' : '#dashboardPage';
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const loginBtn = document.querySelector('#loginForm button[type="submit"]');
    loginBtn.textContent = 'Signing In...';
    loginBtn.disabled = true;

    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        
        if (response.data.success) {
            await handleSuccessfulAuth(response.data.user);
        } else {
            alert(`Login Failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error("Login API Error:", error.response ? error.response.data : error.message);
        alert('Server error during login.');
    } finally {
        loginBtn.textContent = 'Sign In';
        loginBtn.disabled = false;
    }
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const registerBtn = document.querySelector('#registerForm button[type="submit"]');
    registerBtn.textContent = 'Registering...';
    registerBtn.disabled = true;
    
    try {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        
        const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });

        if (response.data.success) {
            await handleSuccessfulAuth(response.data.user);
        } else {
            alert(`Registration Failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error("Registration API Error:", error.response ? error.response.data : error.message);
        alert('Server error during registration.');
    } finally {
        registerBtn.textContent = 'Sign Up';
        registerBtn.disabled = false;
    }
});

document.getElementById('careerQuizForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const quizBtn = document.querySelector('#careerQuizForm button[type="submit"]');
    quizBtn.textContent = 'Analyzing...';
    quizBtn.disabled = true;

    const answers = {
        subject: document.querySelector('input[name="subject"]:checked')?.value,
        problem: document.querySelector('input[name="problem"]:checked')?.value,
        projects: document.querySelector('input[name="projects"]:checked')?.value,
        environment: document.querySelector('input[name="environment"]:checked')?.value,
        motivation: document.querySelector('input[name="motivation"]:checked')?.value,
    };
    
    try {
        const response = await axios.post(`${API_BASE_URL}/quiz/submit`, {
            userId: Store.state.userId,
            answers
        });

        if (response.data.success) {
            Store.update({
                quizResults: response.data.results,
                recommendations: response.data.results.recommendations
            });
            window.location.hash = '#recommendationsSection';
        } else {
            alert(`Quiz Failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error("Quiz Submission API Error:", error.response ? error.response.data : error.message);
        alert('Server error during quiz submission.');
    } finally {
        quizBtn.textContent = 'Get My Career Recommendations';
        quizBtn.disabled = false;
    }
});

document.getElementById('resumeUploadForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const resumeFile = document.getElementById('resumeFile').files[0];
    const analyzeBtn = document.getElementById('analyzeResumeBtn');
    
    if (!resumeFile) return;

    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;
    
    // NOTE: For a real app, you'd use FormData to send the file.
    // Here, we simulate the API call based on the file's presence.
    
    try {
        const response = await axios.post(`${API_BASE_URL}/resume/analyze`, {
            userId: Store.state.userId,
            fileName: resumeFile.name,
            fileSize: resumeFile.size
        });

        if (response.data.success) {
            Store.update({ resumeFeedback: response.data });
            updateDashboardContent(Store.state); // Force render of resume section with new data
            document.getElementById('resumeFeedbackArea').classList.remove('d-none');
        } else {
            alert(`Analysis Failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error("Resume Analysis API Error:", error.response ? error.response.data : error.message);
        alert('Server error during resume analysis.');
    } finally {
        analyzeBtn.textContent = 'Analyze Resume';
        analyzeBtn.disabled = false;
    }
});


document.getElementById('profileForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const saveBtn = document.querySelector('#profileForm button[type="submit"]');
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
        const problemDescription = document.getElementById('problemDescription').value;

        const response = await axios.post(`${API_BASE_URL}/profile/update`, {
            userId: Store.state.userId,
            problemDescription
        });
        
        if (response.data.success) {
            Store.update({ profileDescription: problemDescription });
            alert('Your profile has been updated!');
        } else {
            alert(`Update Failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error("Profile Update API Error:", error.response ? error.response.data : error.message);
        alert('Server error saving profile.');
    } finally {
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
    }
});

document.getElementById('resumeBuilderForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const generateBtn = document.querySelector('#resumeBuilderForm button[type="submit"]');
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;
    document.getElementById('builderResultArea').classList.add('d-none'); // Hide previous results

    try {
        const targetGoal = document.getElementById('builderGoal').value;
        const highlights = document.getElementById('builderHighlights').value;

        // Mock AI generation response
        const mockDraft = `
            <h3>${Store.state.userName}'s Professional Resume</h3>
            <h4>Objective: ${targetGoal}</h4>
            <p><strong>Summary:</strong> Highly motivated professional with proven experience in ${highlights.substring(0, 50)}... seeking to leverage advanced skills to achieve organizational goals.</p>
            <hr/>
            <h4>Core Competencies</h4>
            <ul>
                <li>${targetGoal.split(' ')[0] || 'Technical'} Skills</li>
                <li>Problem Solving</li>
                <li>Leadership & Teamwork</li>
            </ul>
        `;
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        document.getElementById('resumeDraftContent').innerHTML = mockDraft;
        document.getElementById('builderResultArea').classList.remove('d-none');

    } catch (error) {
        console.error("Resume Generation Error:", error);
        alert('Failed to generate resume draft.');
    } finally {
        generateBtn.textContent = 'Generate Resume Draft';
        generateBtn.disabled = false;
    }
});


document.getElementById('chatbotForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const query = chatInput.value.trim();
    chatInput.value = '';
    
    if (!query) return;

    // 1. Display User Message
    chatMessages.innerHTML += `
        <div class="chat-message-user">
            <span class="chat-bubble chat-bubble-user">${query}</span>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 2. Display Loading Indicator
    const loadingMessageId = 'loading-' + Date.now();
    chatMessages.innerHTML += `
        <div class="chat-message-ai" id="${loadingMessageId}">
            <span class="chat-loading">
                AI is typing... <span class="dot-flashing"></span>
            </span>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await axios.post(`${API_BASE_URL}/chatbot/query`, {
            userId: Store.state.userId,
            query
        });
        
        const aiResponse = response.data.response || "I'm sorry, I couldn't process that request right now.";
        
        // 3. Replace Loading with AI Response
        const loadingEl = document.getElementById(loadingMessageId);
        if (loadingEl) {
            loadingEl.innerHTML = `<span class="chat-bubble chat-bubble-ai">${aiResponse}</span>`;
        }

    } catch (error) {
        console.error("Chatbot API Error:", error.response ? error.response.data : error.message);
        const loadingEl = document.getElementById(loadingMessageId);
        if (loadingEl) {
             loadingEl.innerHTML = `<span class="chat-bubble chat-bubble-ai">Error: Could not connect to AI service.</span>`;
        }
    } finally {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
