"""Test the Electron-Python integration."""
from pytest_bdd import given, when, then, scenario
import pytest
import subprocess
import os
import signal
import time
import docker  # We'll need to add python-docker to our dependencies

# Global handles
electron_process: subprocess.Popen | None = None
python_output: str = ""  # Add this to store Python output

@pytest.fixture(scope="function", autouse=True)
def cleanup() -> None:
    """Cleanup fixture to terminate processes after each test."""
    yield
    if electron_process:
        try:
            os.killpg(os.getpgid(electron_process.pid), signal.SIGTERM)
        except:
            pass

@scenario('../features/electron_python_integration.feature', 'Opening a basic window')
def test_opening_window():
    """Test opening the application window."""
    pass

@scenario('../features/electron_python_integration.feature', 'Python script integration')
def test_python_integration():
    """Test Python script integration."""
    pass

@scenario('../features/electron_python_integration.feature', 'Docker container integration')
def test_docker_integration():
    """Test Docker container integration."""
    pass

@given('the application is installed')
def check_installation() -> None:
    """Verify the application is properly installed."""
    assert os.path.exists("main.js"), "main.js not found"
    assert os.path.exists("index.html"), "index.html not found"

@when('I start the application')
def start_application() -> None:
    """Start the Electron application."""
    global electron_process
    electron_process = subprocess.Popen(
        ["npm", "start"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )
    time.sleep(2)  # Give the app time to start

@then('I should see the main window')
def verify_window_visible() -> None:
    """Verify the main window is visible."""
    assert electron_process and electron_process.poll() is None, "Application failed to start"

# Scenario: Python script integration
@given('the application window is open')
def ensure_window_open() -> None:
    """Ensure application window is open."""
    global electron_process
    electron_process = subprocess.Popen(
        ["npm", "start"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )
    time.sleep(2)  # Give the app time to start

@when('the Python script runs')
def run_python_script() -> None:
    """Run the Python script and wait for output."""
    global python_output
    python_path = os.path.join(os.getcwd(), 'without_fingers', 'hello.py')
    result = subprocess.run(['python', python_path], 
                          capture_output=True, 
                          text=True)
    python_output = result.stdout.strip()
    print(f"Python output: {python_output}")  # Debug output
    time.sleep(1)  # Give time for output to be processed

@then('the message "Hello World from Python" should be displayed')
def verify_python_message() -> None:
    """Verify the Python message is displayed."""
    global python_output
    assert electron_process and electron_process.poll() is None, "Process ended unexpectedly"
    assert python_output == "Hello World from Python", f"Expected 'Hello World from Python' but got '{python_output}'"

@given('a Docker container is configured')
def setup_docker() -> None:
    """Ensure Docker container is built."""
    client = docker.from_env()
    client.images.build(path=".", tag="without-fingers:test")

@when('the application starts with Docker')
def start_with_docker() -> None:
    """Start the application with Docker container."""
    global electron_process
    electron_process = subprocess.Popen(
        ["npm", "start"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )
    time.sleep(2)  # Give the app time to start

@then('the message "Hello from Docker running Python" should be displayed')
def verify_docker_message() -> None:
    """Verify Docker container output."""
    client = docker.from_env()
    container = client.containers.run(
        "without-fingers:test", 
        remove=True,
        stdout=True,
        stderr=True
    )
    output = container.decode('utf-8').strip()
    assert output == "Hello from Docker running Python", f"Expected Docker message not found in output: {output}" 