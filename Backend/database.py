import sqlite3

def get_db():
    return sqlite3.connect("ewaste.db")

def create_tables():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analysis_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_name TEXT,
        category TEXT,
        value INTEGER,
        timestamp TEXT
    )
    """)

    conn.commit()
    conn.close()

create_tables()
