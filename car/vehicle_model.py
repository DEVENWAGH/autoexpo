from dataclasses import dataclass
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class Variant:
    name: str
    url: str
    tags: List[str]
    specifications: str
    price: str

@dataclass
class VehicleSpecs:
    fuel_type: str
    mileage: str
    engine: str
    power: str
    transmission: str
    safety_rating: str
    additional_specs: Dict[str, str]

@dataclass
class ImageInfo:
    url: str
    title: str
    alt: str
    category: str
    local_path: Optional[str] = None

@dataclass
class Vehicle:
    brand: str
    name: str
    price: str
    price_range: str
    specs: VehicleSpecs
    variants: List[Variant]
    images: List[ImageInfo]
    url: str
    scraped_at: datetime
    
    def to_dict(self) -> dict:
        """Convert vehicle data to dictionary format"""
        return {
            'brand': self.brand,
            'name': self.name,
            'price': self.price,
            'price_range': self.price_range,
            'fuel_type': self.specs.fuel_type,
            'mileage': self.specs.mileage,
            'engine': self.specs.engine,
            'power': self.specs.power,
            'transmission': self.specs.transmission,
            'safety_rating': self.specs.safety_rating,
            'url': self.url,
            'variants': [vars(v) for v in self.variants],
            'image_counts': self.get_image_counts(),
            'scraped_at': self.scraped_at.isoformat()
        }
    
    def get_image_counts(self) -> Dict[str, int]:
        """Get count of images by category"""
        counts = {}
        for img in self.images:
            counts[img.category] = counts.get(img.category, 0) + 1
        return counts

def create_vehicle(car_data: dict) -> Vehicle:
    """Create a Vehicle instance from scraped data"""
    specs = VehicleSpecs(
        fuel_type=car_data.get('fuel_type', 'N/A'),
        mileage=car_data.get('mileage', 'N/A'),
        engine=car_data.get('engine', 'N/A'),
        power=car_data.get('power', 'N/A'),
        transmission=car_data.get('transmission', 'N/A'),
        safety_rating=car_data.get('safety_rating', 'N/A'),
        additional_specs=car_data.get('specs', {})
    )
    
    variants = [
        Variant(**variant_data)
        for variant_data in car_data.get('variants', [])
    ]
    
    images = [
        ImageInfo(**img_data)
        for img_data in car_data.get('images', [])
    ]
    
    return Vehicle(
        brand=car_data['brand'],
        name=car_data['name'],
        price=car_data['price'],
        price_range=car_data.get('price_range', ''),
        specs=specs,
        variants=variants,
        images=images,
        url=car_data['url'],
        scraped_at=datetime.now()
    )
