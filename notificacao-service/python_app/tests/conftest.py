import sys
from pathlib import Path

# Adiciona automaticamente o diretório python_app ao sys.path para que
# `import main` funcione quando os testes forem executados a partir da raiz do repositório.
ROOT = Path(__file__).resolve().parents[1]
ROOT_STR = str(ROOT)
if ROOT_STR not in sys.path:
    sys.path.insert(0, ROOT_STR)
