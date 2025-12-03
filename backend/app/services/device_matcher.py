DEVICE_KEYWORDS = {
    "printer": ["printer", "hp printer", "canon printer", "epson"],
    "phone": ["phone", "iphone", "samsung", "android"],
    "laptop": ["laptop", "dell", "hp laptop", "macbook"],
    "router": ["router", "wifi box", "modem"],
    "tablet": ["tablet", "ipad", "galaxy tab"],
    "desktop": ["desktop", "pc", "tower"],
}

def detect_device_type(query: str):
    query = query.lower()
    for device_type, keywords in DEVICE_KEYWORDS.items():
        for kw in keywords:
            if kw in query:
                return device_type
    return None
