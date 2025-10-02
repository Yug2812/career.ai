// Global state for user information
let userState = {
    isLoggedIn: false,
    userName: null,
    userEmail: null
};

// Function to show/hide pages and sections
function showContent(contentId) {
    const pages = ['landingPage', 'loginPage', 'registerPage', 'helpPage', 'dashboardPage', 'forgotPasswordPage'];
    const sections = ['quizSection', 'recommendationsSection', 'skillsSection', 'resumeSection', 'resumeBuilderSection', 'chatbotComingSoonSection', 'profileSection'];

    // Hide all pages and sections initially
    pages.forEach(id => document.getElementById(id)?.classList.add('d-none'));
    sections.forEach(id => document.getElementById(id)?.classList.add('d-none'));

    // Check if the contentId is a main page or a dashboard section
    const isPage = pages.includes(contentId);
    const isSection = sections.includes(contentId);

    if (isPage) {
        // Show the selected page and reset dashboard sidebar
        document.getElementById(contentId)?.classList.remove('d-none');
        document.querySelectorAll('#dashboard-sidebar a').forEach(link => {
            link.classList.remove('active', 'active-sidebar', 'btn-primary');
            link.classList.add('btn-outline-primary');
        });
        // Special case: if we go to dashboard, show the quiz section by default
        if (contentId === 'dashboardPage') {
            showContent('quizSection');
        }
    } else if (isSection) {
        // Show the dashboard page and then the selected section
        document.getElementById('dashboardPage')?.classList.remove('d-none');
        document.getElementById(contentId)?.classList.remove('d-none');

        // Update dashboard sidebar active state
        document.querySelectorAll('#dashboard-sidebar a').forEach(link => {
            link.classList.remove('active', 'active-sidebar', 'btn-primary');
            link.classList.add('btn-outline-primary');
        });
        const activeLink = document.querySelector(`[data-page-section="${contentId}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'active-sidebar', 'btn-primary');
            activeLink.classList.remove('btn-outline-primary');
        }
    }

    // Update navbar active state for public links
    document.querySelectorAll('#mainNavbar .nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    const publicActiveLink = document.querySelector(`#mainNavbar .nav-link[data-page="${isPage ? contentId : 'dashboardPage'}"]`);
    if(publicActiveLink) {
        publicActiveLink.classList.add('active');
        publicActiveLink.setAttribute('aria-current', 'page');
    }
}


// Function to update the navbar dynamically based on login status
function updateNavbar() {
    const navLinksContainer = document.getElementById('navLinks');
    navLinksContainer.innerHTML = '';
    
    if (userState.isLoggedIn) {
        navLinksContainer.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#" data-page="dashboardPage">Dashboard</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-page="helpPage">Help</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user-circle me-2"></i> <span id="navUserName">${userState.userName}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#" data-page-section="profileSection">Profile</a></li>
                    <li><a class="dropdown-item" href="#" data-page-section="resumeBuilderSection">Resume Builder</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <button class="dropdown-item" id="themeToggleBtnDashboard" aria-label="Toggle Day/Night Theme">
                            <i class="fas fa-sun me-2"></i>Toggle Theme
                        </button>
                    </li>
                    <li><a class="dropdown-item" id="navLogout" href="#">Logout</a></li>
                </ul>
            </li>
            <li class="nav-item d-flex align-items-center ms-3 d-lg-none">
                <button id="themeToggleBtnPublic" class="btn btn-sm btn-outline-secondary rounded-pill" aria-label="Toggle Day/Night Theme">
                    <i class="fas fa-moon"></i>
                </button>
            </li>
        `;
        document.getElementById('navLogout').addEventListener('click', () => {
            userState.isLoggedIn = false;
            userState.userName = null;
            userState.userEmail = null;
            updateNavbar();
            showContent('landingPage');
        });
        
    } else {
        navLinksContainer.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="#" data-page="landingPage">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-page="helpPage">Help</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-page="loginPage">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-page="registerPage">Sign Up</a>
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


// Theme Toggle Logic
function setTheme(theme) {
    const body = document.body;
    const icons = document.querySelectorAll('#themeToggleBtnPublic i, #themeToggleBtnDashboard i');
    
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

// This function determines the theme based on local storage or system preference.
function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme on page load based on preference cascade
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    
    // Listen for changes in the system theme preference
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newTheme = event.matches ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    // Initial page and navbar setup
    updateNavbar();
    if (userState.isLoggedIn) {
        
        // Set user name and email in multiple locations
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = userState.userName;
        }
        if (document.getElementById('profileName')) {
            document.getElementById('profileName').textContent = userState.userName;
        }
        if (document.getElementById('profileEmail')) {
            document.getElementById('profileEmail').textContent = userState.userEmail;
        }
        if (document.getElementById('navUserName')) {
            document.getElementById('navUserName').textContent = userState.userName;
        }
        showContent('dashboardPage');
    } else {
        showContent('landingPage');
    }

    // Event listeners for all internal navigation
    document.addEventListener('click', (event) => {
        const target = event.target.closest('[data-page], [data-page-section]');
        if (target) {
            event.preventDefault();
            const pageId = target.getAttribute('data-page');
            const sectionId = target.getAttribute('data-page-section');
            if (pageId) {
                showContent(pageId);
            } else if (sectionId) {
                showContent(sectionId);
            }
        }
    });

    // Handle logo click
    document.getElementById('logoLink').addEventListener('click', (event) => {
        event.preventDefault();
        showContent(userState.isLoggedIn ? 'dashboardPage' : 'landingPage');
    });

    // Help form logic
    const helpForm = document.getElementById('helpForm');
    if (helpForm) {
        helpForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('helpName').value;
            const email = document.getElementById('helpEmail').value;
            const phone = document.getElementById('helpPhone').value;
            const subject = document.getElementById('helpSubject').value;
            const question = document.getElementById('helpQuestion').value;
            
            console.log(`Help request submitted: Name=${name}, Email=${email}, Phone=${phone}, Subject=${subject}, Question=${question}`);
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
            alert("AI Chatbot coming soon! This is a placeholder for future functionality.");
        });
    }
});

// Form submission event listeners
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // For now, using mock data and in-memory state
    userState.isLoggedIn = true;
    userState.userName = 'Jane Doe'; 
    userState.userEmail = 'jane.doe@example.com';
    
    console.log(`Simulating a sign-in for email: ${email}.`);
    document.getElementById('userName').textContent = userState.userName;
    document.getElementById('profileName').textContent = userState.userName;
    document.getElementById('profileEmail').textContent = userState.userEmail;
    document.getElementById('navUserName').textContent = userState.userName;
    updateNavbar();
    showContent('dashboardPage');
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    // For now, using mock data and in-memory state
    userState.isLoggedIn = true;
    userState.userName = name;
    userState.userEmail = email;

    console.log(`Simulating a new account registration for name: ${name}, email: ${email}.`);
    document.getElementById('userName').textContent = userState.userName;
    document.getElementById('profileName').textContent = userState.userName;
    document.getElementById('profileEmail').textContent = userState.userEmail;
    document.getElementById('navUserName').textContent = userState.userName;
    updateNavbar();
    showContent('dashboardPage');
});

document.getElementById('careerQuizForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Show a loading state immediately
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '<div class="loading-state">Generating recommendations...</div>';
    
    // Simulate a delay for the AI model to process data
    setTimeout(() => {
        const subject = document.querySelector('input[name="subject"]:checked').value;
        const problem = document.querySelector('input[name="problem"]:checked').value;
        const projects = document.querySelector('input[name="projects"]:checked').value;
        const environment = document.querySelector('input[name="environment"]:checked').value;
        const motivation = document.querySelector('input[name="motivation"]:checked').value;
        
        let recommendations = [];
        
        // Simulating API response based on quiz logic
        if (subject === 'math' && problem === 'logic' && projects === 'tech' && environment === 'solo' && motivation === 'income') {
            recommendations = ['Software Engineer', 'Data Scientist', 'AI/ML Engineer'];
        } else if (subject === 'science' && problem === 'creative' && projects === 'tech' && environment === 'team' && motivation === 'impact') {
            recommendations = ['Biomedical Engineer', 'UX Researcher', 'Robotics Engineer'];
        } else if (subject === 'arts' && problem === 'creative' && projects === 'designing' && environment === 'team' && motivation === 'balance') {
            recommendations = ['Graphic Designer', 'UI/UX Designer', 'Content Creator'];
        } else if (subject === 'business' && problem === 'people' && projects === 'finance' && environment === 'client' && motivation === 'income') {
            recommendations = ['Financial Analyst', 'Marketing Manager', 'Product Manager'];
        } else {
            recommendations = ['Career Advisor', 'Project Manager', 'Consultant'];
        }
        
        recommendationsList.innerHTML = '';
        recommendations.forEach(career => {
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
        
        showContent('recommendationsSection');
    }, 2000); // 2-second delay to simulate loading
});

// Event listener for the new profile form
document.getElementById('profileSection').querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const problemDescription = document.getElementById('problemDescription').value;
    console.log(`User problem saved: ${problemDescription}`);
    alert('Your profile has been updated!');
});