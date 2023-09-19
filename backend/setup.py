from config import config # type: ignore
import psycopg2 as psql # type: ignore

params = config()
conn = psql.connect(**params)
cur = conn.cursor()