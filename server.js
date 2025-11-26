const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'alumni-portal-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});
// Data files
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');

// Initialize data files
function initDataFiles() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR);
    }
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    }
    if (!fs.existsSync(EVENTS_FILE)) {
        fs.writeFileSync(EVENTS_FILE, JSON.stringify([]));
    }
    if (!fs.existsSync(JOBS_FILE)) {
        fs.writeFileSync(JOBS_FILE, JSON.stringify([]));
    }
    if (!fs.existsSync(NEWS_FILE)) {
        fs.writeFileSync(NEWS_FILE, JSON.stringify([]));
    }
}

initDataFiles();

// Helper functions
function readJSON(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        return [];
    }
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Routes

// Home page
app.get('/', (req, res) => {
    const news = readJSON(NEWS_FILE).slice(0, 3);
    const events = readJSON(EVENTS_FILE).slice(0, 3);
    res.render('index', { user: req.session.user, news, events });
});

// Login page
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});

// Login POST
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            batch: user.batch,
            department: user.department
        };
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid email or password' });
    }
});

// Register page
app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('register', { error: null });
});

// Register POST
app.post('/register', async (req, res) => {
    const { name, email, password, batch, department, phone, city } = req.body;
    const users = readJSON(USERS_FILE);

    if (users.find(u => u.email === email)) {
        return res.render('register', { error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        batch,
        department,
        phone,
        city,
        bio: '',
        company: '',
        position: '',
        registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    writeJSON(USERS_FILE, users);

    req.session.user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        batch: newUser.batch,
        department: newUser.department
    };

    res.redirect('/dashboard');
});

// Dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
    const users = readJSON(USERS_FILE);
    const events = readJSON(EVENTS_FILE);
    const jobs = readJSON(JOBS_FILE);
    const news = readJSON(NEWS_FILE);

    res.render('dashboard', {
        user: req.session.user,
        totalAlumni: users.length,
        upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
        activeJobs: jobs.length,
        recentNews: news.length
    });
});

// Alumni Directory
app.get('/directory', isAuthenticated, (req, res) => {
    const users = readJSON(USERS_FILE);
    const { search, batch, department } = req.query;

    let filteredUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        batch: u.batch,
        department: u.department,
        city: u.city,
        company: u.company,
        position: u.position
    }));

    if (search) {
        filteredUsers = filteredUsers.filter(u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            (u.company && u.company.toLowerCase().includes(search.toLowerCase()))
        );
    }

    if (batch) {
        filteredUsers = filteredUsers.filter(u => u.batch === batch);
    }

    if (department) {
        filteredUsers = filteredUsers.filter(u => u.department === department);
    }

    res.render('directory', { user: req.session.user, alumni: filteredUsers, query: req.query });
});

// Events
app.get('/events', isAuthenticated, (req, res) => {
    const events = readJSON(EVENTS_FILE);
    res.render('events', { user: req.session.user, events });
});

// Add Event
app.post('/events', isAuthenticated, (req, res) => {
    const { title, description, date, location, organizer } = req.body;
    const events = readJSON(EVENTS_FILE);

    const newEvent = {
        id: Date.now().toString(),
        title,
        description,
        date,
        location,
        organizer: req.session.user.name,
        createdAt: new Date().toISOString()
    };

    events.push(newEvent);
    writeJSON(EVENTS_FILE, events);

    res.redirect('/events');
});

// Jobs
app.get('/jobs', isAuthenticated, (req, res) => {
    const jobs = readJSON(JOBS_FILE);
    res.render('jobs', { user: req.session.user, jobs });
});

// Add Job
app.post('/jobs', isAuthenticated, (req, res) => {
    const { title, company, location, description, requirements, contactEmail } = req.body;
    const jobs = readJSON(JOBS_FILE);

    const newJob = {
        id: Date.now().toString(),
        title,
        company,
        location,
        description,
        requirements,
        contactEmail,
        postedBy: req.session.user.name,
        postedAt: new Date().toISOString()
    };

    jobs.push(newJob);
    writeJSON(JOBS_FILE, jobs);

    res.redirect('/jobs');
});

// News
app.get('/news', isAuthenticated, (req, res) => {
    const news = readJSON(NEWS_FILE);
    res.render('news', { user: req.session.user, news });
});

// Add News
app.post('/news', isAuthenticated, (req, res) => {
    const { title, content, category } = req.body;
    const news = readJSON(NEWS_FILE);

    const newNews = {
        id: Date.now().toString(),
        title,
        content,
        category,
        author: req.session.user.name,
        createdAt: new Date().toISOString()
    };

    news.push(newNews);
    writeJSON(NEWS_FILE, news);

    res.redirect('/news');
});

// Profile
app.get('/profile', isAuthenticated, (req, res) => {
    const users = readJSON(USERS_FILE);
    const userProfile = users.find(u => u.id === req.session.user.id);
    res.render('profile', { user: req.session.user, profile: userProfile });
});

// Update Profile
app.post('/profile', isAuthenticated, (req, res) => {
    const { phone, city, bio, company, position } = req.body;
    const users = readJSON(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.session.user.id);

    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            phone,
            city,
            bio,
            company,
            position
        };
        writeJSON(USERS_FILE, users);
    }

    res.redirect('/profile');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`Alumni Portal is running on http://localhost:${PORT}`);
});
