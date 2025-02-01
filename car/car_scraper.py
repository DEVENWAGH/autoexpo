import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from datetime import datetime
import logging
import urllib.request
import hashlib
from PIL import Image
import io
from vehicle_model import create_vehicle, Vehicle, ImageInfo

class CarScraper:
    def __init__(self):
        self.base_url = "https://www.cardekho.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
        }
        self.brand_urls = {
            'Maruti': 'https://www.cardekho.com/maruti-suzuki-cars',
            'Tata': 'https://www.cardekho.com/cars/Tata',
            'Kia': 'https://www.cardekho.com/cars/Kia',
            'Toyota': 'https://www.cardekho.com/toyota-cars',
            'Hyundai': 'https://www.cardekho.com/cars/Hyundai',
            'Mahindra': 'https://www.cardekho.com/cars/Mahindra',
            'Honda': 'https://www.cardekho.com/cars/Honda',
            'MG': 'https://www.cardekho.com/cars/MG',
            'Skoda': 'https://www.cardekho.com/cars/Skoda'
        }
        self.setup_logging()
        self.image_dir = os.path.abspath('car_images')  # Get absolute path
        os.makedirs(self.image_dir, exist_ok=True)
        self.image_categories = {
            'exterior': ['front', 'rear', 'side', 'wheel', 'headlight', 'taillight'],
            'interior': ['dashboard', 'steering', 'seat', 'boot', 'console'],
            'colors': ['colour', 'color'],
            '360': ['360'],
            'variants': ['variant']
        }
        self.variant_info = {
            'price': None,
            'variants': []
        }
        self.downloaded_hashes = set()  # Track downloaded image hashes
        self.downloaded_urls = set()    # Track cleaned URLs
        self.downloaded_files = set()   # Track filenames
        self.processed_images = {}  # Track processed images by their file paths

        # Create category directories
        self.category_dirs = {}
        for category in self.image_categories.keys():
            category_path = os.path.join(self.image_dir, category)
            os.makedirs(category_path, exist_ok=True)
            self.category_dirs[category] = category_path

        self.image_quality = "?imwidth=3840&impolicy=resize"  # Increased quality
        self.model_variants = {}  # Track model variants

    def setup_logging(self):
        logging.basicConfig(
            filename=f'car_scraping_{datetime.now().strftime("%Y%m%d")}.log',
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )

    def fetch_page(self, url):
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            logging.error(f"Error fetching {url}: {str(e)}")
            return None

    def extract_specs(self, specs_text):
        specs = {}
        if specs_text:
            parts = specs_text.split('|')
            for part in parts:
                part = part.strip()
                if 'kmpl' in part:
                    specs['mileage'] = part
                elif 'cc' in part:
                    specs['engine'] = part
                elif 'bhp' in part:
                    specs['power'] = part
                elif any(x in part.lower() for x in ['manual', 'automatic']):
                    specs['transmission'] = part
        return specs

    def _extract_brand_info(self, brand_element):
        """Helper method to extract brand information from an element"""
        if not (brand_element.get('href') and '/cars/' in brand_element.get('href')):
            return None
            
        brand_name = (brand_element.find('span', class_='name').text.strip() 
                     if brand_element.find('span', class_='name') 
                     else brand_element.text.strip())
        brand_url = brand_element['href']
        if not brand_url.startswith('http'):
            brand_url = self.base_url + brand_url
            
        return {'name': brand_name, 'url': brand_url}

    def get_all_brands(self):
        try:
            soup = self.fetch_page(self.base_url)
            if not soup:
                raise requests.exceptions.RequestException("Failed to fetch home page")
                
            brand_section = soup.find('div', {'data-track-section': 'Popular Brands'})
            if not brand_section:
                logging.error("No brand section found")
                return []
                
            brands = []
            for brand in brand_section.find_all('a'):
                brand_info = self._extract_brand_info(brand)
                if brand_info:
                    brands.append(brand_info)
                    logging.info(f"Found brand: {brand_info['name']} at URL: {brand_info['url']}")
            
            logging.info(f"Found {len(brands)} brands")
            return brands
            
        except Exception as e:
            logging.error(f"Error getting brands: {str(e)}")
            return []

    def get_car_specs(self, car_url):
        try:
            specs_url = car_url + "/specs"
            soup = self.fetch_page(specs_url)
            if not soup:
                return {}

            specs = {}
            specs_section = soup.find('div', class_='specsAllLists')
            if specs_section:
                tables = specs_section.find_all('table')
                for table in tables:
                    rows = table.find_all('tr')
                    for row in rows:
                        cols = row.find_all('td')
                        if len(cols) == 2:
                            key = cols[0].text.strip()
                            value = cols[1].text.strip()
                            specs[key] = value

            return specs
        except Exception as e:
            logging.error(f"Error fetching specs for {car_url}: {str(e)}")
            return {}

    def get_car_images(self, car_url):
        """Get car images from various pages"""
        try:
            images = []
            
            # Get main pictures page images
            pictures_url = f"{car_url}/pictures"
            soup = self.fetch_page(pictures_url)
            if soup:
                images.extend(self.extract_images_from_gallery(soup))
            
            # Get exterior images
            ext_url = f"{car_url}/pictures/exterior" 
            soup = self.fetch_page(ext_url)
            if soup:
                images.extend(self.extract_images_from_gallery(soup))

            # Get interior images            
            int_url = f"{car_url}/pictures/interior"
            soup = self.fetch_page(int_url)
            if soup:
                images.extend(self.extract_images_from_gallery(soup))

            # Get color images
            color_url = f"{car_url}/colors"
            soup = self.fetch_page(color_url)
            if soup:
                images.extend(self.extract_color_images(soup))

            logging.info(f"Found {len(images)} images across all pages")
            return images

        except Exception as e:
            logging.error(f"Error fetching images: {str(e)}")
            return []

    def extract_images_from_gallery(self, soup):
        """Extract images from gallery section"""
        images = []
        gallery = soup.find('div', class_='pictureGallerySec')
        if (gallery):
            for img in gallery.find_all('img'):
                img_url = (img.get('data-lazy-src') or 
                          img.get('data-src') or 
                          img.get('src'))
                if img_url and not img_url.endswith('spacer3x2.png'):
                    if img_url.startswith('//'):
                        img_url = f"https:{img_url}"
                    img_url = img_url.split('?')[0]
                    img_url = f"{img_url}?imwidth=1920&impolicy=resize"
                    images.append({
                        'url': img_url,
                        'title': img.get('title', ''),
                        'alt': img.get('alt', '')
                    })
        return images

    def _get_color_name(self, color_element):
        """Extract color name from element"""
        name_element = color_element.find(['span', 'div'], class_=['name', 'title', 'gs_control'])
        if name_element:
            return name_element.get('title') or name_element.text.strip()
        return None

    def _process_image_url(self, img_url):
        """Process and format image URL"""
        if not img_url or img_url.endswith(('spacer.png', 'placeholder.jpg')):
            return None
            
        if img_url.startswith('//'):
            img_url = f"https:{img_url}"
            
        img_url = img_url.split('?')[0]
        return f"{img_url}?imwidth=1920&impolicy=resize"

    def _extract_image_from_element(self, img_element, title=None, alt=None):
        """Extract image information from element"""
        img_url = (img_element.get('data-lazy-src') or 
                  img_element.get('data-src') or 
                  img_element.get('src'))
                  
        img_url = self._process_image_url(img_url)
        if img_url:
            return {
                'url': img_url,
                'title': title or "Color Variant",
                'alt': alt or "Car Color",
                'category': 'colors'
            }
        return None

    def _process_color_element(self, color_element):
        """Process a single color element"""
        color_name = self._get_color_name(color_element)
        img = color_element.find('img')
        if img:
            return self._extract_image_from_element(
                img,
                title=f"Color - {color_name}" if color_name else "Color Variant",
                alt=color_name or "Car Color"
            )
        return None

    def extract_color_images(self, soup):
        """Extract color variant images with improved detection"""
        images = []
        try:
            # Process main color sections
            color_sections = soup.find_all(['div', 'section'], 
                class_=lambda x: x and any(c in x for c in ['ColorSection', 'colors-section', 'gsc_row']))
            
            for section in color_sections:
                color_elements = section.find_all(['li', 'div'], attrs={'data-color': True})
                for element in color_elements:
                    img_data = self._process_color_element(element)
                    if img_data:
                        images.append(img_data)

            # Process 360-degree views
            color_360_section = soup.find(['div', 'section'], 
                class_=lambda x: x and '360' in str(x).lower())
            if color_360_section:
                for img in color_360_section.find_all('img'):
                    img_data = self._extract_image_from_element(
                        img,
                        title="360 Color View",
                        alt="360 Degree Color View"
                    )
                    if img_data:
                        images.append(img_data)

        except Exception as e:
            logging.error(f"Error extracting color images: {str(e)}")
            
        # Remove duplicates while preserving order
        return list({img['url']: img for img in images}.values())

    def get_image_hash(self, img_url):
        """Generate hash of image content to detect duplicates"""
        try:
            response = requests.get(img_url, headers=self.headers)
            if response.status_code == 200:
                return hashlib.md5(response.content).hexdigest()
        except Exception as e:
            logging.error(f"Error generating image hash: {str(e)}")
        return None

    def clean_image_url(self, img_url):
        """Clean image URL to help identify duplicates"""
        if not img_url:
            return None
        # Remove query parameters and normalize protocol
        img_url = img_url.split('?')[0].replace('http:', 'https:')
        if img_url.startswith('//'):
            img_url = f"https:{img_url}"
        elif not img_url.startswith('http'):
            img_url = f"https://{img_url.lstrip('/')}"
        return img_url

    def is_duplicate_image(self, img_url, img_hash=None):
        """Check if image is duplicate using URL and hash"""
        clean_url = self.clean_image_url(img_url)
        if clean_url in self.downloaded_urls:
            return True
        
        if not img_hash:
            img_hash = self.get_image_hash(img_url)
        
        if img_hash and img_hash in self.downloaded_hashes:
            return True
            
        return False

    def _extract_car_url(self, container):
        """Extract car URL from container"""
        url_element = container.find('a', href=True)
        if not url_element:
            return None
        url = url_element['href']
        if not url.startswith('http'):
            url = self.base_url + url
        return url

    def _extract_car_name_price(self, container):
        """Extract car name and price from container"""
        name_element = container.find('h3')
        if not name_element:
            return None, None
        name = name_element.text.strip()
        
        price_div = container.find('div', class_='price')
        price = price_div.text.strip() if price_div else 'N/A'
        price = price.split('*')[0] if '*' in price else price
        price = price.replace('Rs.', '').strip()
        
        return name, price

    def _process_car_container(self, container, brand_name):
        """Process individual car container"""
        url = self._extract_car_url(container)
        if not url:
            logging.error("Could not find URL for car")
            return None

        name, price = self._extract_car_name_price(container)
        if not name:
            return None

        logging.info(f"Processing car {name} at URL: {url}")
        specs = self.get_car_specs(url)
        additional_images = self.get_car_images(url)
        variant_info = self.get_car_variants(url)

        car_data = {
            'brand': brand_name,
            'name': name,
            'price': price,
            'url': url,
            'specs': specs,
            'price_range': variant_info['price'],
            'variants': variant_info['variants']
        }

        # Process images
        car_images = []
        image_stats = {cat: 0 for cat in self.image_categories}
        
        for img_data in additional_images:
            if img_data['url'] and not self.is_duplicate_image(img_data['url']):
                category = self.get_image_category(img_data)
                result = self.download_image(img_data, brand_name, name)
                if result:
                    image_stats[category] += 1
                    car_images.append(ImageInfo(
                        url=img_data['url'],
                        title=img_data.get('title', ''),
                        alt=img_data.get('alt', ''),
                        category=category,
                        local_path=result
                    ))

        car_data.update({
            'images': car_images,
            'image_counts': image_stats
        })
        
        return create_vehicle(car_data)

    def get_cars_by_brand(self, brand_name, brand_url):
        """Get all cars for a specific brand"""
        try:
            soup = self.fetch_page(brand_url)
            if not soup:
                return []

            cars = []
            car_containers = soup.find_all('li', class_='gsc_col-xs-12 gsc_col-sm-6 gsc_col-md-12 gsc_col-lg-12')
            
            for container in car_containers:
                try:
                    # Get URL first - we need this for images and specs
                    url = None
                    url_element = container.find('a', href=True)
                    if url_element:
                        url = url_element['href']
                        if not url.startswith('http'):
                            url = self.base_url + url
                    
                    if not url:
                        logging.error("Could not find URL for car")
                        continue

                    name_element = container.find('h3')
                    if not name_element:
                        continue
                    name = name_element.text.strip()
                    
                    logging.info(f"Processing car {name} at URL: {url}")

                    # Extract price
                    price_div = container.find('div', class_='price')
                    price = price_div.text.strip() if price_div else 'N/A'
                    price = price.split('*')[0] if '*' in price else price
                    price = price.replace('Rs.', '').strip()

                    # Fetch car specifications
                    specs = self.get_car_specs(url)

                    # Get additional images from pictures page
                    additional_images = self.get_car_images(url)
                    
                    # Process images for base model
                    image_stats = {cat: 0 for cat in self.image_categories}
                    car_images = []
                    
                    for img_data in additional_images:
                        if img_data['url'] and not self.is_duplicate_image(img_data['url']):
                            category = self.get_image_category(img_data)
                            result = self.download_image(img_data, brand_name, name)
                            if result:
                                image_stats[category] += 1
                                car_images.append(ImageInfo(
                                    url=img_data['url'],
                                    title=img_data.get('title', ''),
                                    alt=img_data.get('alt', ''),
                                    category=category,
                                    local_path=result
                                ))

                    # Process variant information and images
                    variant_info = self.get_car_variants(url)
                    for variant in variant_info['variants']:
                        variant_images = self.get_car_images(variant['url'])
                        for img_data in variant_images:
                            if img_data['url']:
                                img_data['title'] = f"{variant['name']}_{img_data.get('title', 'image')}"
                                self.download_image(img_data, brand_name, name)

                    # Create car data dictionary
                    car_data = {
                        'brand': brand_name,
                        'name': name,
                        'price': price,
                        'fuel_type': specs.get('Fuel Type', 'N/A'),
                        'mileage': specs.get('ARAI Mileage', 'N/A'),
                        'engine': specs.get('Engine Displacement', 'N/A'),
                        'power': specs.get('Max Power', 'N/A'),
                        'transmission': specs.get('Transmission Type', 'N/A'),
                        'safety_rating': specs.get('Global NCAP Safety Rating', 'N/A'),
                        'url': url,
                        'image_counts': image_stats,
                        'specs': specs,
                        'price_range': variant_info['price'],
                        'variants': variant_info['variants'],
                        'images': car_images
                    }

                    # Create vehicle object
                    vehicle = create_vehicle(car_data)
                    cars.append(vehicle)
                    
                    logging.info(f"Successfully processed {name}")
                    
                except Exception as e:
                    logging.error(f"Error processing car: {str(e)}")
                    continue

            return cars
            
        except Exception as e:
            logging.error(f"Error processing brand {brand_name}: {str(e)}")
            return []

    def get_image_category(self, img_data):
        """Determine image category based on title/alt text"""
        title = (img_data.get('title', '') + ' ' + img_data.get('alt', '')).lower()
        
        for category, keywords in self.image_categories.items():
            if any(keyword in title for keyword in keywords):
                return category
        return 'exterior'  # Default category

    def organize_model_folders(self, brand_name, model_name):
        """Create organized folder structure for model"""
        model_path = os.path.join(self.image_dir, brand_name, model_name)
        
        # Create base folders for model
        folders = {
            'base': model_path,
            'colors': os.path.join(model_path, 'colors'),
            '360': os.path.join(model_path, '360'),
            'interior': os.path.join(model_path, 'interior'),
            'exterior': os.path.join(model_path, 'exterior'),
            'variants': os.path.join(model_path, 'variants')
        }
        
        for folder in folders.values():
            os.makedirs(folder, exist_ok=True)
            
        return folders

    def download_image(self, img_data, brand_name, model_name):
        """Download image with improved organization and quality"""
        try:
            img_url = img_data.get('url') if isinstance(img_data, dict) else img_data
            if not img_url:
                return None

            # Clean URL and improve quality
            clean_url = self.clean_image_url(img_url)
            if not clean_url:
                return None
            
            # Add high quality parameters
            clean_url = clean_url.split('?')[0] + self.image_quality

            # Check URL duplicates
            if clean_url in self.downloaded_urls:
                return None

            # Generate image hash
            img_hash = self.get_image_hash(clean_url)
            if not img_hash or img_hash in self.downloaded_hashes:
                return None
            
            # Create folder structure
            folders = self.organize_model_folders(brand_name, model_name)
            
            # Determine category and folder
            category = self.get_image_category(img_data) if isinstance(img_data, dict) else 'exterior'
            save_dir = folders.get(category, folders['base'])

            # Clean title and generate unique filename
            clean_title = "".join(c for c in img_data.get('title', 'image') if c.isalnum() or c in (' ', '-', '_')).rstrip() if isinstance(img_data, dict) else 'image'
            
            # Use content hash in filename to avoid duplicates
            filename = os.path.join(save_dir, f"{clean_title}_{img_hash[:8]}.jpg")
            
            # Skip if we already processed this image
            if filename in self.processed_images:
                return None

            # Download and verify image quality
            response = requests.get(clean_url, headers=self.headers, stream=True, timeout=10)
            response.raise_for_status()
            
            # Save image content
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            # Verify image quality
            try:
                with Image.open(filename) as img:
                    width, height = img.size
                    if width < 800 or height < 600:  # Skip low quality images
                        os.remove(filename)
                        return None
            except Exception:
                if os.path.exists(filename):
                    os.remove(filename)
                return None

            # Track successful download
            self.downloaded_hashes.add(img_hash)
            self.downloaded_urls.add(clean_url)
            self.processed_images[filename] = {
                'category': category,
                'hash': img_hash,
                'url': clean_url
            }
            
            logging.info(f"Successfully downloaded: {filename}")
            return category
            
        except Exception as e:
            logging.error(f"Error downloading image for {model_name}: {str(e)}")
            return None

    def get_car_variants(self, car_url):
        """Extract variant information from car details page"""
        try:
            soup = self.fetch_page(car_url)
            if not soup:
                return self.variant_info

            # Extract variant table section
            variant_section = soup.find('section', {'data-track-component': 'variantList'})
            if not variant_section:
                return self.variant_info

            # Get price range from header
            price_info = variant_section.find('p', class_='gs_readmore')
            if price_info:
                self.variant_info['price'] = price_info.text.strip()

            # Get variant table
            variant_table = variant_section.find('table', class_='allvariant')
            if not variant_table:
                return self.variant_info

            variants = []
            for row in variant_table.find_all('tr')[1:]:  # Skip header row
                cols = row.find_all('td')
                if len(cols) >= 3:
                    variant_link = cols[0].find('a')
                    if variant_link:
                        variant_name = variant_link.text.strip()
                        variant_url = variant_link.get('href')
                        if variant_url and not variant_url.startswith('http'):
                            variant_url = self.base_url + variant_url

                        # Get tags like "Base Model", "Top Model" etc
                        tags = []
                        tag_spans = cols[0].find_all('span', class_='variantTag')
                        for tag in tag_spans:
                            tags.append(tag.text.strip())

                        # Get "Recently Launched" or "Top Selling" info
                        selling_div = cols[0].find('div', class_='topselling')
                        if selling_div:
                            tags.append(selling_div.text.strip())

                        # Get specs like engine, transmission etc
                        specs_span = cols[0].find('span', class_='kmpl')
                        specs = specs_span.text.strip() if specs_span else ''

                        # Get price
                        price = cols[1].text.strip()
                        price = price.replace('Rs.', '').replace('*', '').strip()

                        variant_data = {
                            'name': variant_name,
                            'url': variant_url,
                            'tags': tags,
                            'specifications': specs,
                            'price': price
                        }
                        variants.append(variant_data)

            self.variant_info['variants'] = variants
            return self.variant_info

        except Exception as e:
            logging.error(f"Error getting variants: {str(e)}")
            return self.variant_info

    def scrape_all_cars(self):
        all_cars_data = []
        
        for brand, url in self.brand_urls.items():
            logging.info(f"Processing brand: {brand}")
            cars = self.get_cars_by_brand(brand, url)
            all_cars_data.extend(cars)
            time.sleep(2)  # Respect rate limiting
            
        return pd.DataFrame(all_cars_data)

    def save_data(self, vehicles, filename='cars_data.csv'):
        try:
            # Convert vehicle objects to dictionaries
            car_data = [vehicle.to_dict() for vehicle in vehicles]
            df = pd.DataFrame(car_data)
            
            # Save main car data
            columns_to_save = [
                'brand', 'name', 'price_range', 'fuel_type', 'mileage',
                'engine', 'power', 'transmission', 'safety_rating',
                'url'
            ]
            df[columns_to_save].to_csv(filename, index=False)
            
            # Save variants data separately
            variants_data = []
            for _, row in df.iterrows():
                for variant in row['variants']:
                    variant_row = {
                        'brand': row['brand'],
                        'model': row['name'],
                        **variant
                    }
                    variants_data.append(variant_row)
            
            pd.DataFrame(variants_data).to_csv('variants_data.csv', index=False)
            logging.info(f"Variants data saved to variants_data.csv")

            # Save image statistics separately
            image_stats = df.apply(
                lambda x: pd.Series(x['image_counts']), axis=1
            ).agg(['sum', 'mean']).round(2)
            
            image_stats.to_csv('image_statistics.csv')
            
            logging.info(f"Data saved to {filename}")
            logging.info(f"Image statistics saved to image_statistics.csv")
            
        except Exception as e:
            logging.error(f"Error saving data: {str(e)}")

def main():
    scraper = CarScraper()
    df = scraper.scrape_all_cars()
    scraper.save_data(df)

if __name__ == "__main__":
    main()
