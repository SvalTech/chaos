import os
import time
import logging
import atexit
import signal
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from pypresence import Presence

# ==========================================
# 1. SETUP & CONFIGURATION
# ==========================================
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Load variables from .env file
load_dotenv()

CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
USER_UID = os.getenv('FIREBASE_UID')
APP_ID = os.getenv('FIREBASE_APP_ID', 'default-app-id')
CRED_PATH = os.getenv('FIREBASE_CREDENTIALS_PATH', 'serviceAccountKey.json')

if not CLIENT_ID or not USER_UID:
    logging.error("Missing critical environment variables. Check your .env file.")
    exit(1)

# ==========================================
# 2. DISCORD CONNECTION & CLEANUP
# ==========================================
RPC = Presence(CLIENT_ID)
current_status = False 

def connect_to_discord():
    """Keeps trying to connect to Discord in case it opens after the script."""
    while True:
        try:
            RPC.connect()
            logging.info("Successfully connected to Discord IPC.")
            break
        except Exception as e:
            logging.warning("Waiting for Discord client... Retrying in 10s.")
            time.sleep(10)

connect_to_discord()

def cleanup_presence():
    """Ensures Discord status is wiped if the script is killed or closed."""
    global current_status
    logging.info("Shutting down... Clearing Discord status.")
    try:
        if current_status:
            RPC.clear()
        RPC.close()
    except Exception as e:
        logging.error(f"Cleanup failed: {e}")

# Register cleanup for normal exits and background kills
atexit.register(cleanup_presence)

def signal_handler(signum, frame):
    exit(0)

signal.signal(signal.SIGINT, signal_handler)  # Catches Ctrl+C in terminal
signal.signal(signal.SIGTERM, signal_handler) # Catches background process kills

# ==========================================
# 3. FIREBASE CONNECTION
# ==========================================
try:
    cred = credentials.Certificate(CRED_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logging.info("Successfully authenticated with Firebase.")
except Exception as e:
    logging.error(f"Failed to initialize Firebase: {e}")
    exit(1)

# Point directly to the user's specific document
doc_ref = db.collection('artifacts').document(APP_ID).collection('socialProfiles').document(USER_UID)

# ==========================================
# 4. THE WATCHER LOGIC
# ==========================================
def on_snapshot(doc_snapshot, changes, read_time):
    global current_status
    
    for doc in doc_snapshot:
        data = doc.to_dict()
        if not data:
            continue
            
        is_studying = data.get('isStudying', False)
        
        if is_studying:
            subject = data.get('studySubject', 'Focus Session')
            mode = data.get('timerMode', 'flow')
            context = data.get('studyContext', '')
            
            # Formatting the Discord display
            details = f"📚 Deep Work: {subject}"
            state_text = context if context else f"Mode: {mode.capitalize()}"
            
            try:
                RPC.update(
                    state=state_text,
                    details=details,
                    large_image="chaosprep_logo", # Upload in Discord Dev Portal
                    large_text="ChaosPrep | sval.tech", 
                    small_image="sval_icon",      # Upload in Discord Dev Portal
                    small_text="Powered by sval.tech",
                    start=int(time.time()),       # Starts the elapsed timer
                    buttons=[
                        {"label": "Visit sval.tech", "url": "https://sval.tech"}
                    ]
                )
                current_status = True
                logging.info(f"Status Active -> {details} | {state_text}")
            except Exception as e:
                logging.error(f"Failed to push Discord update: {e}")
                
        elif not is_studying and current_status:
            try:
                RPC.clear()
                current_status = False
                logging.info("Session ended. Status cleared from Discord.")
            except Exception as e:
                logging.error(f"Failed to clear Discord status: {e}")

# ==========================================
# 5. INITIALIZATION
# ==========================================
doc_watch = doc_ref.on_snapshot(on_snapshot)
logging.info("Watcher active. Listening for database changes...")

# Keep the daemon alive
logging.info("Daemon running. Press Ctrl+C to exit gracefully.")
while True:
    time.sleep(15)