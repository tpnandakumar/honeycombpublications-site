@echo off
cd /d "%~dp0"
echo Previewing at http://localhost:8000
echo Press Ctrl+C to stop.
py -3 -m http.server 8000
