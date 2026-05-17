"""
Stub heavy optional dependencies so tests run without the full Railway dep tree.
Only kicks in if the package is not already installed.
"""
import sys
from unittest.mock import MagicMock

_OPTIONAL = [
    "langchain_community",
    "langchain_community.vectorstores",
    "langchain_community.vectorstores.pgvector",
]
for _mod in _OPTIONAL:
    sys.modules.setdefault(_mod, MagicMock())
