import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import analyze

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown events."""
    # Startup
    logger.info("SenseSketch API server is starting up...")
    logger.info("Server is ready to accept requests on http://0.0.0.0:8000")
    yield
    # Shutdown (if needed, add cleanup code here)
    # logger.info("SenseSketch API server is shutting down...")


# Create FastAPI app
app = FastAPI(
    title="SenseSketch API",
    description="Backend API for analyzing children's drawings and images",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/api/v1", tags=["analyze"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "SenseSketch API is running", "status": "ok"}

