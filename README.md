# Alumni Portal

A comprehensive web-based alumni management system built with Node.js, Express, EJS, and Bootstrap.

## Features

### 🎓 User Management
- User registration and authentication
- Profile management with personal and professional information
- Secure password hashing with bcrypt

### 👥 Alumni Directory
- Browse all registered alumni
- Search by name or company
- Filter by batch year and department
- Contact alumni via email

### 📅 Events Management
- View upcoming and past events
- Create new events (reunions, seminars, networking events)
- Event details including date, location, and organizer

### 💼 Job Board
- Post job opportunities
- Browse available positions
- Filter and search job listings
- Direct application via email

### 📰 News & Updates
- Share news and achievements
- Categorized articles (Achievement, Event, Announcement, Alumni Spotlight)
- Community updates and highlights

### 📊 Dashboard
- Overview statistics
- Quick access to all features
- Personalized user information

## Technology Stack

- **Backend**: Node.js with Express.js
- **Template Engine**: EJS (Embedded JavaScript)
- **Frontend**: HTML5, CSS3, Bootstrap 5
- **Authentication**: Express-session with bcryptjs
- **Data Storage**: JSON files (can be upgraded to MongoDB/PostgreSQL)
- **Icons**: Bootstrap Icons

## Installation

1. **Clone or download the project**
   ```bash
   cd alumni-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Access the application**
   Open your browser and navigate to: `http://localhost:3000`

## Project Structure

```
alumni-portal/
├── server.js              # Main application server
├── package.json           # Project dependencies
├── data/                  # JSON data storage
│   ├── users.json        # User accounts
│   ├── events.json       # Events data
│   ├── jobs.json         # Job postings
│   └── news.json         # News articles
├── views/                # EJS templates
│   ├── partials/         # Reusable components
│   │   ├── header.ejs   # Navigation header
│   │   └── footer.ejs   # Footer
│   ├── index.ejs        # Home page
│   ├── login.ejs        # Login page
│   ├── register.ejs     # Registration page
│   ├── dashboard.ejs    # User dashboard
│   ├── directory.ejs    # Alumni directory
│   ├── events.ejs       # Events page
│   ├── jobs.ejs         # Jobs page
│   ├── news.ejs         # News page
│   └── profile.ejs      # User profile
└── public/              # Static files
    ├── css/
    │   └── style.css    # Custom styles
    ├── js/
    │   └── main.js      # Client-side JavaScript
    └── images/          # Image assets
```

## Usage

### Registration
1. Click "Register" in the navigation
2. Fill in your details (name, email, password, batch, department)
3. Submit the form to create your account

### Login
1. Click "Login" in the navigation
2. Enter your email and password
3. Access your personalized dashboard

### Features Access
After logging in, you can:
- Browse the **Directory** to find alumni
- Check **Events** and create new ones
- Post or browse **Job Opportunities**
- Read and share **News** articles
- Update your **Profile** information

## Default Departments

- Computer Science
- Electrical Engineering
- Mechanical Engineering
- Civil Engineering
- Business Administration
- Economics
- Arts & Humanities
- Medicine
- Law

## Security Features

- Password hashing using bcryptjs
- Session-based authentication
- Protected routes requiring login
- SQL injection prevention (using JSON storage)

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Email notifications
- Photo uploads for profiles and events
- Advanced search and filtering
- Social media integration
- Chat/messaging system
- Event RSVP functionality
- Payment integration for events
- Mobile app version
- Admin dashboard
- Analytics and reporting

## API Endpoints

### Public Routes
- `GET /` - Home page
- `GET /login` - Login page
- `POST /login` - Login authentication
- `GET /register` - Registration page
- `POST /register` - User registration

### Protected Routes (Requires Authentication)
- `GET /dashboard` - User dashboard
- `GET /directory` - Alumni directory
- `GET /events` - Events page
- `POST /events` - Create event
- `GET /jobs` - Jobs page
- `POST /jobs` - Post job
- `GET /news` - News page
- `POST /news` - Add news
- `GET /profile` - User profile
- `POST /profile` - Update profile
- `GET /logout` - Logout

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

## Author

Built with ❤️ for connecting alumni communities worldwide.
