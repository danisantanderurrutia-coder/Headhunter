"""Category 1 Connectors: Direct HTTP / RSS / Static HTML."""

from .boku import BokuConnector
from .univie import UnivieConnector
from .ethz import EthzConnector
from .freiburg import FreiburgConnector
from .bc3 import Bc3Connector
from .eawag import EawagConnector
from .bund_rss import BundRssConnector

CATEGORY_1_CONNECTORS = [
    BokuConnector,
    UnivieConnector,
    EthzConnector,
    FreiburgConnector,
    Bc3Connector,
    EawagConnector,
    BundRssConnector
]
