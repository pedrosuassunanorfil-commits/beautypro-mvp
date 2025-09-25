#!/usr/bin/env python3
"""
Deploy script para Railway
Este arquivo será executado no Railway para iniciar o backend
"""

import os
import sys
import subprocess

# Adicionar o diretório backend ao path
sys.path.append('/app/backend')

# Mudar para o diretório do backend
os.chdir('/app/backend')

# Executar o servidor
if __name__ == "__main__":
    port = os.environ.get("PORT", "8001")
    subprocess.run([
        "uvicorn", 
        "server:app", 
        "--host", "0.0.0.0", 
        "--port", port
    ])