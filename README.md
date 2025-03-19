# ReadTheRoom Reddit Moderation Extension

A Chrome extension for Reddit moderators to efficiently manage and moderate posts.

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- PostgreSQL
- Node.js and npm (for extension development)
- Google Chrome browser

### 1. Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:

```bash
psql -U postgres
CREATE DATABASE reddit_mod_db;
```

### 2. Backend Setup

1. Clone the repository:

```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install required packages:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with your Reddit API credentials:

```env
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=your_user_agent
REDDIT_USERNAME=your_username
REDDIT_PASSWORD=your_password
```

5. Start the Flask server:

```bash
python app.py
```

The server will run on `http://localhost:5000`

### 3. Chrome Extension Setup

1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `extension` directory from your project

### 4. Testing the Setup

1. Test the backend:

```bash
# Check API health
curl "http://localhost:5000/api/health"

# Test Reddit connection
curl "http://localhost:5000/api/test-connection"

# Show database contents
curl "http://localhost:5000/api/db/show"
```

2. Test the extension:

- Go to Reddit
- You should see "Add to Room" buttons next to posts
- Click the ReadTheRoom floating action button to open the moderation panel

## Available API Endpoints

### Health and Connection

- `GET /api/health` - Check API health
- `GET /api/test-connection` - Test Reddit API connection

### Moderation

- `GET/POST /api/mod/sync` - Sync unmoderated posts
- `GET /api/mod/stored-posts` - Get stored posts
- `GET /api/mod/modqueue` - Get moderation queue

### Database

- `GET /api/db/status` - Get database status
- `GET /api/db/inspect` - Inspect database contents
- `GET /api/db/show` - Show all database contents

## Project Structure
