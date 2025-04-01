Feature: Electron Python Integration
    As a user
    I want to run Python scripts within an Electron window
    So that I can have a GUI interface for my Python application

    Scenario: Opening a basic window
        Given the application is installed
        When I start the application
        Then I should see the main window

    Scenario: Python script integration
        Given the application window is open
        When the Python script runs
        Then the message "Hello World from Python" should be displayed

    Scenario: Docker container integration
        Given a Docker container is configured
        When the application starts with Docker
        Then the message "Hello from Docker running Python" should be displayed