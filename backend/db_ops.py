import asyncpg
from config import config
import hashlib
import datetime

# Create a pool connection for efficient handling
pool = None

async def init_db_pool():
    global pool
    db_config = config()
    pool = await asyncpg.create_pool(user=db_config['user'], password=db_config['password'],
                                     database=db_config['database'], host=db_config['host'])

async def close_db_pool():
    global pool
    await pool.close()

hash = lambda x: hashlib.sha256(x.encode('utf-8')).hexdigest()

async def register_user(email, password, full_name):
    hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    async with pool.acquire() as connection:
        # Ensure email is unique
        if await check_customer_email(email):
            return {"status": "error", "detail": "Email already exists"}

        # Create user
        user_id = await connection.fetchval('''
            INSERT INTO users(email, password, full_name, created_at, is_active)
            VALUES($1, $2, $3, $4, $5) RETURNING id
        ''', email, hashed_password, full_name, datetime.datetime.utcnow(), False)
        
        # Create tenant for the user
        await connection.execute('''
            INSERT INTO tenants(name, owner_id, created_at)
            VALUES($1, $2, $3)
        ''', full_name + "'s Organization", user_id, datetime.datetime.utcnow())
        
    return {"status": "success", "detail": "User registered successfully and tenant created"}

async def check_customer_email(email):
    async with pool.acquire() as connection:
        result = await connection.fetch('''
            SELECT * FROM users WHERE email=$1
        ''', email)
        if len(result) == 0:
            return False
        return True

async def login_user(email, password):
    hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    async with pool.acquire() as connection:
        user = await connection.fetchrow('''
            SELECT * FROM users WHERE email=$1 AND password=$2
        ''', email, hashed_password)
        if user:
            if not user['is_active']:
                return {"status": "error", "detail": "Account not activated"}
            # In a real application, generate JWT or some form of token here
            return {"status": "success", "detail": "Logged in successfully", "user_id": user['id']}
        return {"status": "error", "detail": "Invalid email or password"}

async def add_news_source(name, rss_url, logo_url=None):
    async with pool.acquire() as connection:
        source_id = await connection.fetchval('''
            INSERT INTO news_sources(name, rss_url, logo_url)
            VALUES($1, $2, $3) RETURNING id
        ''', name, rss_url, logo_url)
    return {"status": "success", "detail": "News source added successfully", "source_id": source_id}

async def add_user_source(user_id, source_id, display_order):
    async with pool.acquire() as connection:
        await connection.execute('''
            INSERT INTO user_sources(user_id, source_id, display_order)
            VALUES($1, $2, $3)
        ''', user_id, source_id, display_order)
    return {"status": "success", "detail": "User source added successfully"}

async def remove_user_source(user_id, source_id):
    async with pool.acquire() as connection:
        await connection.execute('''
            DELETE FROM user_sources WHERE user_id=$1 AND source_id=$2
        ''', user_id, source_id)
    return {"status": "success", "detail": "User source removed successfully"}
