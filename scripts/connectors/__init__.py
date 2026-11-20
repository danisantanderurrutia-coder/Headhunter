"""
Connectors Package for Empleo Master.
===================================
Exports all modular scraping connectors across:
- Category 1: Direct HTTP, RSS XML and Static HTML for Universities and Public Research Centers.
- Category 2: ATS APIs (Greenhouse, Ashby, Personio, Workable, Lever) and CMS Feeds.
"""

from .category1 import CATEGORY_1_CONNECTORS
from .category2 import CATEGORY_2_CONNECTORS

ALL_CONNECTORS = CATEGORY_1_CONNECTORS + CATEGORY_2_CONNECTORS
