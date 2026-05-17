FROM python:3.12-slim

# curl needed for tectonic installer
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install tectonic (Rust-based LaTeX compiler, ~75 MB)
RUN curl --proto '=https' --tlsv1.2 -fsSL https://drop.fullyjustified.net/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-warm tectonic package cache at build time so runtime uses --only-cached
COPY preload.tex /tmp/preload.tex
RUN tectonic /tmp/preload.tex \
    && rm -f /tmp/preload.tex /tmp/preload.pdf

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
