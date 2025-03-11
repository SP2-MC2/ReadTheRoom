from flask import Flask, request, jsonify
from flask_cors import CORS
import praw
import os
from dotenv import load_dotenv
import logging
from datetime import datetime


# Use this for fetch:
# http://localhost:5000/api/mod/unmoderated

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)
CORS(app)

reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT'),
    username=os.getenv('REDDIT_USERNAME'),
    password=os.getenv('REDDIT_PASSWORD')
)

def format_post(post):
    """Format a Reddit post into a clean dictionary"""
    return {
        'id': post.id,
        'title': post.title,
        'author': str(post.author) if post.author else '[deleted]',
        'created_utc': datetime.fromtimestamp(post.created_utc).isoformat(),
        'subreddit': str(post.subreddit),
        'permalink': post.permalink,
        'url': post.url,
        'selftext': post.selftext,
        'num_comments': post.num_comments,
        'score': post.score,
        'upvote_ratio': post.upvote_ratio,
        'is_self': post.is_self,
        'is_video': post.is_video,
        'stickied': post.stickied,
        'over_18': post.over_18,
        'spoiler': post.spoiler,
        'link_flair_text': post.link_flair_text
    }

@app.route('/api/moderator/me', methods=['GET'])
def get_moderator_info():
    """Get information about the authenticated moderator"""
    try:
        user = reddit.user.me()
        mod_subreddits = [{'name': str(sub), 'title': sub.title} 
                         for sub in reddit.user.moderator_subreddits()]
        
        return jsonify({
            'status': 'success',
            'data': {
                'username': str(user),
                'moderated_subreddits': mod_subreddits
            }
        })
    except Exception as e:
        logger.error(f"Error getting moderator info: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/mod/unmoderated', methods=['GET'])
def get_unmoderated():
    """Get unmoderated posts from specified subreddit or all moderated subreddits"""
    try:
        subreddit_name = request.args.get('subreddit', 'mod')  # 'mod' for all moderated subreddits
        limit = min(int(request.args.get('limit', 100)), 100)  # max 100 posts
        
        subreddit = reddit.subreddit(subreddit_name)
        unmoderated_posts = []
        
        for post in subreddit.mod.unmoderated(limit=limit):
            try:
                post_data = format_post(post)
                unmoderated_posts.append(post_data)
            except Exception as e:
                logger.error(f"Error processing post {post.id}: {e}")
                continue
        
        return jsonify({
            'status': 'success',
            'data': {
                'subreddit': subreddit_name,
                'posts': unmoderated_posts,
                'count': len(unmoderated_posts)
            }
        })
    except Exception as e:
        logger.error(f"Error fetching unmoderated posts: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/mod/modqueue', methods=['GET'])
def get_mod_queue():
    """Get posts in moderation queue"""
    try:
        subreddit_name = request.args.get('subreddit', 'mod')
        limit = min(int(request.args.get('limit', 100)), 100)
        
        subreddit = reddit.subreddit(subreddit_name)
        queue_posts = []
        
        for post in subreddit.mod.modqueue(limit=limit):
            try:
                post_data = format_post(post)
                # Add modqueue-specific information
                post_data.update({
                    'mod_reports': post.mod_reports,
                    'user_reports': post.user_reports,
                    'report_reasons': post.report_reasons
                })
                queue_posts.append(post_data)
            except Exception as e:
                logger.error(f"Error processing post {post.id}: {e}")
                continue
        
        return jsonify({
            'status': 'success',
            'data': {
                'subreddit': subreddit_name,
                'posts': queue_posts,
                'count': len(queue_posts)
            }
        })
    except Exception as e:
        logger.error(f"Error fetching mod queue: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True) 
    