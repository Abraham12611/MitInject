import sys

sys.path.append("../")

import re
from typing import Optional
from camel.logger import get_logger

logger = get_logger(__name__)


def extract_pattern(content: str, pattern: str) -> Optional[str]:
    try:
        _pattern = rf"<{pattern}>(.*?)</{pattern}>"
        match = re.search(_pattern, content, re.DOTALL)
        if match:
            text = match.group(1)
            return text.strip()
        else:
            return None
    except Exception as e:
        logger.warning(f"Error extracting answer: {e}, current content: {content}")
        return None
