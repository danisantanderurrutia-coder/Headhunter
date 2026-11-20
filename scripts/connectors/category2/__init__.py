"""Category 2 Connectors: ATS APIs and Structured Research Feeds."""

from .greenhouse import GreenhouseConnector
from .ashby import AshbyConnector
from .personio import PersonioConnector
from .workable import WorkableConnector
from .lever import LeverConnector
from .juelich_rss import JuelichRssConnector

CATEGORY_2_CONNECTORS = [
    GreenhouseConnector,
    AshbyConnector,
    PersonioConnector,
    WorkableConnector,
    LeverConnector,
    JuelichRssConnector
]
