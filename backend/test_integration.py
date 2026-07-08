"""Final integration test."""
import app.services.social_service as svc
svc._posts_cache = None
svc._news_cache = None
svc._live_posts = None
svc._live_news = None
svc._live_timestamp = 0

from app.services.social_service import get_posts, get_feed, get_data_source

posts = get_posts()
print("Posts:", len(posts))
print("Source:", get_data_source())

feed = get_feed(limit=5)
print("Feed posts:", len(feed["posts"]))
print("Total:", feed["totalPosts"])
print("Has more:", feed["hasMore"])
print("KPIs:", feed["kpis"]["totalPostsToday"])

for p in feed["posts"][:3]:
    mc = len(p.get("media", []))
    print(f"  {p['id']} | {p['platform']} | {p['category']} | media={mc}")

# Test filters
filtered = get_feed(limit=3, platform="instagram")
print("\nInstagram filter:", len(filtered["posts"]), "posts")
for p in filtered["posts"]:
    print(f"  {p['id']} | {p['platform']} | {p['category']}")
