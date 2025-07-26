@echo off
echo Starting RH App...
echo.

echo Starting Backend...
cd backend
start "Backend" cmd /k "npm run dev"

echo Starting Frontend...
cd ../frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo RH App is starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul 