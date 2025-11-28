# SenseSketch - Drawing Analysis Prototype

A full-stack prototype application for analyzing children's drawings and images using AI. Built with React Native (Expo) frontend and FastAPI backend with Google Gemini integration.

## Project Structure

```
P-Inno/
├── .env                    # Environment variables (GEMINI_API_KEY)
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── core/          # Configuration and Gemini client
│   │   ├── api/v1/        # API routes
│   │   ├── schemas/       # Pydantic models
│   │   └── main.py        # FastAPI app entry point
│   └── requirements.txt   # Python dependencies
├── frontend/               # React Native (Expo) frontend
│   ├── src/
│   │   ├── screens/       # Screen components
│   │   ├── components/   # Reusable UI components
│   │   ├── api/          # API client functions
│   │   ├── config/       # Environment and theme config
│   │   ├── navigation/   # Navigation setup
│   │   └── types/        # TypeScript type definitions
│   └── package.json      # Node dependencies
└── README.md
```

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ and npm/yarn (for frontend)
- Expo CLI (install with `npm install -g expo-cli`)
- Google Gemini API Key (already in `.env`)

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify `.env` file exists at project root:**
   The `.env` file should contain:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Run the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The server will start on `http://0.0.0.0:8000` (accessible at `http://localhost:8000`).

6. **Test the API:**
   Visit `http://localhost:8000` in your browser to see the health check message.

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Base URL:**
   
   Edit `frontend/src/config/env.ts` to set the correct `API_BASE_URL`:
   
   - **Android Emulator:** `http://10.0.2.2:8000` (default)
   - **iOS Simulator:** `http://localhost:8000`
   - **Physical Device:** Use your computer's IP address (e.g., `http://192.168.1.100:8000`)
   
   To find your computer's IP:
   - **Windows:** Run `ipconfig` and look for IPv4 Address
   - **Mac/Linux:** Run `ifconfig` or `ip addr` and look for inet address

4. **Start the Expo development server:**
   ```bash
   npm start
   ```
   
   Or run directly on a platform:
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   npm run web      # For web browser
   ```

## Features

### Feature 1: Drawing Canvas & Intent Recognition (Core)

✅ **Drawing Canvas:**
- Draw sketches with finger/touch
- Clear canvas functionality
- Export drawing as base64 image

✅ **Image Upload/Capture:**
- Upload image from gallery
- Capture photo with camera
- Send image for analysis

✅ **Analysis Results:**
- Display list of intents with:
  - Label (in Vietnamese)
  - Confidence percentage
  - Category (need, emotion, object, activity)
  - Reasoning explanation

✅ **User Experience:**
- Loading overlay during analysis
- Error messages for failed requests
- Calm, minimal UI design

## API Contract

### Endpoint: `POST /api/v1/analyze`

**Request:**
```json
{
  "image_base64": "<base64-encoded PNG/JPEG>"
}
```

**Response:**
```json
{
  "intents": [
    {
      "label": "Con muốn uống nước",
      "confidence": 0.85,
      "category": "need",
      "reasoning": "Bé vẽ một chiếc ly có nước và ống hút."
    }
  ]
}
```

## Development Notes

### Backend
- Uses FastAPI with async/await
- Gemini API integration with JSON response format
- CORS enabled for development (allows all origins)
- Error handling with appropriate HTTP status codes

### Frontend
- React Native with Expo
- TypeScript for type safety
- React Navigation for routing
- SVG-based drawing canvas
- Image picker for gallery/camera access

## Troubleshooting

### Backend Issues

1. **Module not found errors:**
   - Ensure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

2. **Gemini API errors:**
   - Verify `GEMINI_API_KEY` in `.env` is correct
   - Check API quota/limits

3. **Port already in use:**
   - Change port: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8001`

### Frontend Issues

1. **Cannot connect to backend:**
   - Verify backend is running
   - Check `API_BASE_URL` in `src/config/env.ts`
   - For physical devices, ensure phone and computer are on same network
   - Check firewall settings

2. **Drawing canvas not working:**
   - Ensure `react-native-svg` is installed
   - Try clearing cache: `expo start -c`

3. **Image picker not working:**
   - Check permissions are granted
   - On iOS, ensure Info.plist includes camera/photo library permissions (Expo handles this)

## Next Steps (Not Implemented)

- Authentication system
- Database for storing drawings and results
- Reports and analytics
- Advanced drawing tools (colors, brush sizes)
- User profiles

## License

This is a prototype project for educational purposes.
