"""
CraveSpot Database Initializer
Reads database/schema.sql and applies it to the configured MySQL instance.
"""

import os
import sys
from pathlib import Path
import mysql.connector
from dotenv import load_dotenv

# Ensure we read .env from project root
ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=ROOT_DIR / ".env", override=True)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "CraveSpot")


def init_database():
    print("=" * 60)
    print("CraveSpot MySQL Database Initializer")
    print("=" * 60)
    print(f"Connecting to MySQL at {DB_HOST}:{DB_PORT} as user '{DB_USER}'...")
    print(f"Target database: '{DB_NAME}'")

    schema_file = ROOT_DIR / "database" / "schema.sql"
    if not schema_file.exists():
        print(f"ERROR: Schema file not found at {schema_file}")
        sys.exit(1)

    try:
        # Connect to MySQL server
        conn = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            autocommit=True,
            use_pure=True
        )
        cursor = conn.cursor()
        print("Connected to MySQL Server successfully!")

        # Read schema.sql
        with open(schema_file, "r", encoding="utf-8") as f:
            sql_script = f.read()

        print(f"Executing schema script from {schema_file}...")

        # Parse and execute statements
        statements = []
        current = []
        for line in sql_script.splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("--") or stripped.startswith("/*"):
                continue
            current.append(line)
            if stripped.endswith(";"):
                stmt = "\n".join(current).strip()
                if stmt:
                    statements.append(stmt)
                current = []
        if current:
            stmt = "\n".join(current).strip()
            if stmt:
                statements.append(stmt)

        executed_count = 0
        for stmt in statements:
            s = stmt.strip()
            if s and s != ";":
                cursor.execute(s)
                executed_count += 1

        print(f"Executed {executed_count} SQL statements successfully!")
        print(f"Database '{DB_NAME}' and all tables initialized successfully!")

        # Verify tables and rows
        cursor.execute(f"USE `{DB_NAME}`")
        cursor.execute("SHOW TABLES")
        tables = [row[0] for row in cursor.fetchall()]
        print("\nVerified Tables in database:")
        for t in tables:
            cursor.execute(f"SELECT COUNT(*) FROM `{t}`")
            count = cursor.fetchone()[0]
            print(f"  - {t}: {count} records")

        cursor.close()
        conn.close()
        print("\nDatabase initialization complete! You can now run the project.")

    except mysql.connector.Error as err:
        print("\n" + "!" * 60)
        print("DATABASE INITIALIZATION ERROR:")
        print(f"MySQL Error Code: {getattr(err, 'errno', 'Unknown')}")
        print(f"Message: {err}")
        print("!" * 60)
        print("\nTroubleshooting tips:")
        print("1. Ensure MySQL Server is running on your laptop.")
        print("2. Check DB_USER and DB_PASSWORD in your .env file.")
        print("3. In MySQL Workbench, you can also open database/schema.sql and execute it directly.")
        sys.exit(1)


if __name__ == "__main__":
    init_database()
