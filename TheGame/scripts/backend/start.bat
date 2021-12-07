:: This script is to make starting the backend nice and easy
@echo OFF

:: Clear console and print starting message
cls
echo. && echo.
echo Starting backend...
echo. && echo.

:: Sleep for 2 seconds (for dramatic effect)
timeout /t 2 /nobreak > Nul

:: Read status file to determine if setup has been run
for /f %%x in (status.txt) DO (
    set status = %%x

    :: Check status code
    if status == 0 (
        :: Call setup function
        call :SETUP

        echo. && echo.
        echo SETUP COMPLETE
        echo. && echo.

        python main.py
        exit
    ) else (
        echo. && echo.
        echo PROJECT SETUP ALREADY DONE
        echo. && echo.

        :: Start backend
        python main.py
        exit
    )
)

:: Setup function
:SETUP
    :: Ensure python virtual environment is running
    call .\venv\scripts\activate.bat 
    call pip install -r requirements.txt

    :: Delete old status file and replace with new one with success code
    del status.txt
    echo 1 >> status.txt

    exit /b 1
