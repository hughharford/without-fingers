FROM python:3.12-slim
WORKDIR /app
COPY ./without_fingers/docker_hello.py .
CMD ["python", "docker_hello.py"] 