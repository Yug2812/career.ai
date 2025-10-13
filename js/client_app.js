const API_URL = 'http://localhost:3000/api';

// --- NEW: Detailed Career Roadmap Data ---
const careerRoadmaps = {
    "Software Developer": {
        title: "Software Developer (Backend / Core Development)",
        focus: "Logic, algorithms, and building software systems (server-side, algorithms, APIs).",
        steps: [
            { title: "Programming Fundamentals", points: ["Languages: Python, Java, C++", "Concepts: Loops, Functions, OOP, Data Structures"], resources: "Learn Python, Java Programming" },
            { title: "Data Structures & Algorithms", points: ["Arrays, Linked Lists, Trees, Graphs, Sorting/Searching"], resources: "GeeksforGeeks DSA, LeetCode" },
            { title: "Backend Development", points: ["Databases: MySQL, PostgreSQL, MongoDB", "Server-side frameworks: Django (Python), Spring Boot (Java), Node.js", "API development: RESTful APIs, JSON, JWT Authentication"], resources: "freeCodeCamp Backend Tutorials, Django Docs" },
            { title: "Version Control", points: ["Git, GitHub, Branching & Merging"], resources: "Git Official Docs" },
            { title: "Projects", points: ["Build a mini-library management system", "RESTful API for e-commerce backend"], resources: "" },
            { title: "Internships / Open Source", points: ["Apply for backend roles or contribute to GitHub backend projects"], resources: "" }
        ]
    },
    "App Developer": {
        title: "App Developer (Mobile App Development)",
        focus: "Build mobile applications for Android and iOS.",
        steps: [
            { title: "Programming Basics", points: ["Java/Kotlin for Android, Swift for iOS"], resources: "Android Developer Official, Swift.org" },
            { title: "Mobile Frameworks", points: ["Android Studio, Xcode, Flutter (cross-platform)"], resources: "Flutter Documentation" },
            { title: "UI & UX", points: ["Material Design, Navigation, Widgets, Animations"], resources: "Google Material Design" },
            { title: "Backend Integration", points: ["REST API consumption, Firebase, SQLite"], resources: "Firebase Docs" },
            { title: "Testing & Deployment", points: ["Unit tests, UI tests, Play Store/App Store deployment"], resources: "" },
            { title: "Projects", points: ["To-do list app with Firebase", "Weather app with API integration"], resources: "Showcase apps on GitHub & Play Store" }
        ]
    },
    "Full Stack Developer": {
        title: "Full Stack Developer",
        focus: "Both frontend and backend, end-to-end application development.",
        steps: [
            { title: "Frontend", points: ["HTML, CSS, JavaScript", "Frameworks: React, Angular, Vue"], resources: "freeCodeCamp Frontend" },
            { title: "Backend", points: ["Node.js, Express, Django, Flask", "Databases: SQL & NoSQL"], resources: "" },
            { title: "Version Control", points: ["Git, GitHub, branching, pull requests"], resources: "" },
            { title: "Projects", points: ["Build full-stack apps: e-commerce site, blogging platform", "Deploy using Heroku / Netlify / AWS"], resources: "" },
            { title: "Advanced Skills", points: ["Authentication, Authorization", "REST API / GraphQL", "State management (Redux, Context API)"], resources: "" },
            { title: "Portfolio & Internships", points: ["Showcase full-stack projects", "Apply to startups or full-stack roles"], resources: "" }
        ]
    },
    "AI Engineer": {
        title: "AI Engineer",
        focus: "Building intelligent systems, deep learning, AI pipelines.",
        steps: [
            { title: "Programming & Math", points: ["Python, NumPy, Pandas", "Linear Algebra, Probability, Statistics"], resources: "Khan Academy, Python Docs" },
            { title: "Machine Learning Basics", points: ["Regression, Classification, Clustering", "Libraries: scikit-learn"], resources: "Coursera ML by Andrew Ng" },
            { title: "Deep Learning", points: ["Neural networks, CNN, RNN, Transformers", "Libraries: TensorFlow, PyTorch"], resources: "DeepLearning.ai" },
            { title: "Projects", points: ["Chatbots, Image recognition, Recommendation systems"], resources: "" },
            { title: "Competitions / Portfolio", points: ["Kaggle, Hackathons"], resources: "" }
        ]
    },
    "Machine Learning Engineer": {
        title: "Machine Learning Engineer",
        focus: "Implementing ML models in production.",
        steps: [
            { title: "Programming & Math", points: ["Python, Pandas, NumPy, Linear Algebra, Probability"], resources: "" },
            { title: "ML & DL Models", points: ["Regression, Classification, NLP, CNN, RNN"], resources: "" },
            { title: "Data Preprocessing & Pipelines", points: ["Feature engineering, Data cleaning"], resources: "" },
            { title: "Deployment", points: ["Flask/Django APIs, Docker, Cloud deployment"], resources: "" },
            { title: "Projects & Portfolio", points: ["Predictive models, Recommendation engines"], resources: "Hands-on ML with Scikit-Learn, Keras, TensorFlow" }
        ]
    },
    "Data Scientist": {
        title: "Data Scientist",
        focus: "Extract insights from data and build predictive models.",
        steps: [
            { title: "Programming & Stats", points: ["Python/R, SQL, Statistics", "Libraries: Pandas, NumPy"], resources: "Kaggle Learn, DataCamp" },
            { title: "Data Visualization & Analysis", points: ["Matplotlib, Seaborn, Tableau, Power BI"], resources: "" },
            { title: "Machine Learning", points: ["Regression, Classification, Clustering"], resources: "" },
            { title: "Big Data Tools", points: ["Spark, Hadoop, AWS/GCP"], resources: "" },
            { title: "Projects & Portfolio", points: ["Predictive analytics, dashboards, Kaggle projects"], resources: "" }
        ]
    },
    "Data Analyst": {
        title: "Data Analyst",
        focus: "Reporting, data visualization, deriving business insights.",
        steps: [
            { title: "Programming & SQL", points: ["Python (Pandas, NumPy)", "SQL queries"], resources: "" },
            { title: "Data Visualization", points: ["Tableau, Power BI, Matplotlib, Seaborn"], resources: "" },
            { title: "Basic Statistics & Business Analysis", points: ["Descriptive stats, A/B testing, KPIs"], resources: "" },
            { title: "Projects", points: ["Sales dashboards, business insights reports"], resources: "Google Data Analytics Certificate" }
        ]
    },
    "Cybersecurity Specialist": {
        title: "Cybersecurity Specialist / Security Engineer",
        focus: "Protect systems, networks, and applications.",
        steps: [
            { title: "Networking & Linux", points: ["TCP/IP, OSI Model, Linux basics"], resources: "" },
            { title: "Security Fundamentals", points: ["Cryptography, Firewalls, Authentication, OWASP Top 10"], resources: "" },
            { title: "Hands-On Labs", points: ["Penetration testing, Wireshark, Nmap, Metasploit"], resources: "" },
            { title: "Certifications", points: ["CompTIA Security+, CEH"], resources: "Cybrary" },
            { title: "Projects / Portfolio", points: ["Vulnerability assessments, secure systems"], resources: "" }
        ]
    },
    "Cloud Engineer": {
        title: "Cloud Engineer Roadmap",
        focus: "Deploying, scaling, monitoring applications.",
        steps: [
            { title: "Linux & Scripting", points: ["Bash, Python"], resources: "" },
            { title: "Cloud Platforms", points: ["AWS, Azure, GCP fundamentals"], resources: "" },
            { title: "Infrastructure as Code", points: ["Terraform, CloudFormation"], resources: "" },
            { title: "Projects", points: ["Deploy apps, monitor resources"], resources: "" },
            { title: "Certifications", points: ["AWS Certified Solutions Architect, Azure Architect"], resources: "" }
        ]
    },
    "DevOps Engineer": {
        title: "DevOps Engineer Roadmap",
        focus: "Automating and improving development and operational workflows.",
        steps: [
            { title: "Version Control & CI/CD", points: ["Git, GitHub, Jenkins, GitLab pipelines"], resources: "" },
            { title: "Containerization", points: ["Docker, Kubernetes"], resources: "" },
            { title: "Monitoring & Logging", points: ["Prometheus, Grafana, ELK stack"], resources: "" },
            { title: "Projects", points: ["Automate deployment pipeline, CI/CD demo"], resources: "" }
        ]
    },
    "UI/UX Designer": {
        title: "UI/UX Designer Roadmap",
        focus: "Creating user-friendly and visually appealing digital products.",
        steps: [
            { title: "Design Basics", points: ["Typography, Color theory, Layouts"], resources: "" },
            { title: "Tools", points: ["Figma, Adobe XD"], resources: "" },
            { title: "User Research", points: ["Wireframes, Mockups, Usability testing"], resources: "" },
            { title: "Portfolio", points: ["3–5 case studies with real app redesign"], resources: "" }
        ]
    },
    "Product Manager": {
        title: "Product Manager Roadmap",
        focus: "Guiding the success of a product and leading the cross-functional team that is responsible for improving it.",
        steps: [
            { title: "Product Fundamentals", points: ["Agile, Scrum, Kanban"], resources: "" },
            { title: "Market Research", points: ["Roadmap planning"], resources: "" },
            { title: "Tools & Communication", points: ["Jira, Trello, Slack"], resources: "" },
            { title: "Projects", points: ["Manage small projects, create MVPs"], resources: "" }
        ]
    },
    "Researcher": {
        title: "Researcher / Academic / AI Scientist",
        focus: "Deep theoretical work, publishing research.",
        steps: [
            { title: "Foundational Knowledge", points: ["Algorithms, Data Structures, Systems, Math"], resources: "" },
            { title: "Specialization", points: ["AI, ML, NLP, Computer Vision"], resources: "" },
            { title: "Research Skills", points: ["Read papers, summarize findings, design experiments"], resources: "" },
            { title: "Publications & Conferences", points: ["ArXiv, IEEE journals, Kaggle competitions"], resources: "" },
            { title: "Advanced Studies", points: ["Masters / PhD programs"], resources: "" }
        ]
    },
    "Entrepreneur": {
        title: "Entrepreneur / Startup Founder / Product Leader",
        focus: "Build companies, lead teams, launch products.",
        steps: [
            { title: "Idea Generation & Problem-Solving", points: ["Identify market gaps, user pain points"], resources: "" },
            { title: "Technical Skills", points: ["Web dev, App dev, AI basics (to prototype MVPs)"], resources: "" },
            { title: "Business & Product Management", points: ["Lean Startup, Agile, Marketing basics"], resources: "" },
            { title: "Team & Leadership", points: ["Delegation, mentoring, team building"], resources: "" },
            { title: "Launch & Iterate", points: ["Build MVP, get feedback, scale"], resources: "Y Combinator Startup School" }
        ]
    }
};

// Add aliases for different career titles
careerRoadmaps["Backend Developer"] = careerRoadmaps["Software Developer"];
careerRoadmaps["Security Engineer"] = careerRoadmaps["Cybersecurity Specialist"];
careerRoadmaps["AI Scientist"] = careerRoadmaps["Researcher"];
careerRoadmaps["Startup Founder"] = careerRoadmaps["Entrepreneur"];
careerRoadmaps["Product Leader"] = careerRoadmaps["Entrepreneur"];


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

// New Initial AI Message (to provide default starter text if history is empty)
const INITIAL_BOT_MESSAGE = { role: "bot", text: "Welcome! I'm here to help you navigate your career choices. Tell me what you're currently interested in, or what doubts you have about your future path." };

// --- ROUTER & VIEW RENDERING ---

function router() {
    let fullHash = window.location.hash.slice(1);
    let [hash, queryString] = fullHash.split('?');

    const pages = ['landingPage', 'loginPage', 'registerPage', 'helpPage', 'dashboardPage', 'forgotPasswordPage', 'termsPage'];
    const sections = ['quizSection', 'recommendationsSection', 'resumeSection', 'resumeBuilderSection', 'chatbotComingSoonSection', 'profileSection'];

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
        if (hash === 'loginPage' && Store.state.isLoggedIn) {
            Store.update({ currentView: 'dashboardPage' });
            return;
        }
        Store.update({ currentView: hash });
        return;
    }

    if (hash === '' || !pages.includes(hash)) {
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

// **MODIFIED**: Renders clickable career recommendations that trigger the modal
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
                <div class="card p-3 h-100" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#roadmapModal" data-career="${career}">
                    <h5>${career}</h5>
                    <p class="text-muted mb-0">Click to view the career roadmap.</p>
                </div>
            </div>
        `;
        recommendationsList.innerHTML += cardHtml;
    });
}

// Renders the chat messages
function renderChat(state) {
    const chatMessagesEl = document.getElementById('chatMessages');
    if (!chatMessagesEl) return;

    chatMessagesEl.innerHTML = '';

    const displayHistory = state.chatHistory.length === 0 ?
        [INITIAL_BOT_MESSAGE] :
        state.chatHistory;

    displayHistory.forEach(msg => {
        const isUser = msg.role === 'user';
        const isLoading = msg.role === 'loading';
        const msgClass = isUser ? 'text-end' : 'text-start';
        const bubbleClass = isUser ? 'bg-primary text-white' : 'bg-light text-dark';

        let messageText;
        if (isLoading) {
            messageText = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
        } else {
            messageText = msg.text;
        }

        const messageHtml = `
            <div class="${msgClass} mb-2">
                <span class="d-inline-block p-2 rounded-lg shadow-sm ${bubbleClass}" style="max-width: 80%;">
                    ${messageText}
                </span>
            </div>
        `;
        chatMessagesEl.innerHTML += messageHtml;
    });
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight; // Auto-scroll to bottom
}

// Main rendering function that subscribes to the Store
function renderApp(state) {
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

    updateNavbar(state);
    if (state.isLoggedIn) {
        document.querySelectorAll('#userName, #profileName, #navUserName').forEach(el => {
            if (el) el.textContent = state.userName;
        });
        if (document.getElementById('profileEmail')) {
            document.getElementById('profileEmail').textContent = state.userEmail;
        }
        if (document.getElementById('problemDescription')) {
            document.getElementById('problemDescription').value = state.profileDescription || '';
        }

        renderRecommendations(state.quizResults);
        renderChat(state);
    }

    document.querySelectorAll('#mainNavbar .nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    const publicActiveLink = document.querySelector(`#mainNavbar .nav-link[href="#${state.currentView}"]`);
    if (publicActiveLink) {
        publicActiveLink.classList.add('active');
        publicActiveLink.setAttribute('aria-current', 'page');
    }

    window.scrollTo({ top: 0, behavior: "instant" });
}

// Function to update the navbar dynamically
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

// --- INITIALIZATION AND THEME LOGIC ---

function setTheme(theme) {
    const body = document.body;
    const icons = document.querySelectorAll('#themeToggleBtnPublic i, #themeToggleBtnDashboard i, #themeToggleBtnLogged i');

    if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        icons.forEach(icon => {
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        icons.forEach(icon => {
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }
    localStorage.setItem('theme', theme);
}

function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// --- API FETCHERS ---

async function fetchUserProfile(userId) {
    try {
        const response = await axios.get(`${API_URL}/profile/data/${userId}`);
        if (response.data.success) {
            const user = response.data.user;
            Store.update({
                userName: user.name,
                userEmail: user.email,
                profileDescription: user.profileDescription,
                quizResults: user.quizResults,
                resumeFeedback: user.resumeFeedback,
            });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}


// --- EVENT HANDLERS ---

document.addEventListener('DOMContentLoaded', () => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);

    Store.subscribe(renderApp);
    window.addEventListener('hashchange', router);
    router();

    document.getElementById('logoLink').addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = '#landingPage';
    });

    const helpForm = document.getElementById('helpForm');
    if (helpForm) {
        helpForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Thank you! Your question has been submitted.');
            helpForm.reset();
        });
    }

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
            scrollToTopBtn.style.opacity = "1";
        } else {
            scrollToTopBtn.style.opacity = "0";
            setTimeout(() => { if (window.scrollY === 0) scrollToTopBtn.style.display = "none"; }, 300);
        }
    };
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    const resumeBuilderForm = document.getElementById('resumeBuilderForm');
    if (resumeBuilderForm) {
        resumeBuilderForm.addEventListener('submit', handleResumeBuild);
    }

    const chatbotForm = document.getElementById('chatbotForm');
    if (chatbotForm) {
        chatbotForm.addEventListener('submit', handleChatbotSubmit);
    }

    // **NEW**: Event listener for the roadmap modal
    const roadmapModal = document.getElementById('roadmapModal');
    if (roadmapModal) {
        roadmapModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const career = button.getAttribute('data-career');
            const roadmap = careerRoadmaps[career] || { title: "Roadmap not available", focus: "", steps: [] };

            const modalTitle = roadmapModal.querySelector('.modal-title');
            const modalBody = roadmapModal.querySelector('.modal-body');

            modalTitle.textContent = roadmap.title;
            let bodyContent = `<p class="lead">${roadmap.focus}</p><hr/>`;
            roadmap.steps.forEach(step => {
                bodyContent += `<h5>${step.title}</h5><ul>`;
                step.points.forEach(point => {
                    bodyContent += `<li>${point}</li>`;
                });
                if (step.resources) {
                    bodyContent += `<li><strong>Resources:</strong> ${step.resources}</li>`;
                }
                bodyContent += `</ul>`;
            });
            modalBody.innerHTML = bodyContent;
        });
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
            await fetchUserProfile(user.id);
            window.location.hash = redirect === 'dashboard' ? '#dashboardPage' : '#landingPage';
        } else {
            alert(response.data.message || 'Authentication failed.');
        }
    } catch (error) {
        console.error('Authentication API Error:', error);
        alert('Server error during login/registration. Please ensure your Node.js server is running.');
    }
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const redirect = getHashQueryParam('redirect');
    await handleAuthentication('login', null, email, password, redirect);
});

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const redirect = getHashQueryParam('redirect');
    await handleAuthentication('register', name, email, password, redirect);
});

document.getElementById('careerQuizForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const userId = Store.state.userId;
    if (!userId) return alert('Please log in to submit the quiz.');

    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '<div class="loading-state">Generating recommendations...</div>';

    const answers = {};
    for (let i = 1; i <= 12; i++) {
        const questionName = `q${i}`;
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        if (selectedOption) {
            answers[`Q${i}`] = selectedOption.value.toUpperCase();
        } else {
            alert(`Please answer question ${i}.`);
            recommendationsList.innerHTML = '<p class="text-muted">Quiz incomplete. Please answer all questions.</p>';
            return;
        }
    }

    try {
        const response = await axios.post(`${API_URL}/quiz/submit`, { userId, answers });

        if (response.data.success) {
            Store.update({ quizResults: response.data.results });
            window.location.hash = '#recommendationsSection';
        } else {
            alert('Failed to submit quiz: ' + response.data.message);
            recommendationsList.innerHTML = `<p class="text-danger">Error: ${response.data.message}</p>`;
        }
    } catch (error) {
        console.error('Quiz API Error:', error);
        alert('Server error while generating recommendations. Ensure the AI service is running and the model has been trained.');
        recommendationsList.innerHTML = '<p class="text-danger">A server error occurred. Please try again later.</p>';
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

    try {
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

async function handleChatbotSubmit(event) {
    event.preventDefault();
    const userId = Store.state.userId;
    const chatInput = document.getElementById('chatInput');
    const query = chatInput.value.trim();

    if (!userId || !query) return;

    const currentHistory = Store.state.chatHistory;

    const userMessage = { role: 'user', text: query };
    const loadingMessage = { role: 'loading', text: '' };
    const startingHistory = [...currentHistory, userMessage, loadingMessage];

    Store.update({ chatHistory: startingHistory });
    chatInput.value = '';

    const sendBtn = document.getElementById('chatSendBtn');
    sendBtn.disabled = true;

    try {
        const response = await axios.post(`${API_URL}/chatbot/query`, {
            userId,
            query,
            history: [...currentHistory, userMessage]
        });

        if (response.data.success) {
            const botMessage = response.data.response;

            const finalHistory = startingHistory.slice(0, -1);
            finalHistory.push({ role: 'bot', text: botMessage });

            Store.update({ chatHistory: finalHistory });
        } else {
            const errorMsg = `[Error] ${response.data.message || 'Could not connect to the chatbot service.'}`;
            const errorHistory = startingHistory.slice(0, -1);
            errorHistory.push({ role: 'bot', text: errorMsg });
            Store.update({ chatHistory: errorHistory });
            alert('Chatbot Error: ' + errorMsg);
        }
    } catch (error) {
        console.error('Chatbot API Error:', error);
        const errorMsg = `[Error] Failed to get response from server. (API call failed)`;
        const errorHistory = startingHistory.slice(0, -1);
        errorHistory.push({ role: 'bot', text: errorMsg });
        Store.update({ chatHistory: errorHistory });
        alert('Chatbot Critical Error: ' + errorMsg);
    } finally {
        sendBtn.disabled = false;
    }
}