import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from datetime import datetime
import logging
import urllib.request

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
        self.downloaded_urls = set()  # Track downloaded URLs to prevent duplicates
        self.color_urls = {}  # Track color URLs to prevent duplicate downloads

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

    def get_all_brands(self):
        try:
            # Use home page URL instead of manufacturers page
            url = self.base_url
            soup = self.fetch_page(url)
            if not soup:
                raise Exception("Failed to fetch home page")
                
            brands = []
            # Find the popular brands section
            brand_section = soup.find('div', {'data-track-section': 'Popular Brands'})
            
            if (brand_section):
                brand_elements = brand_section.find_all('a')
                for brand in brand_elements:
                    if brand.get('href') and '/cars/' in brand.get('href'):
                        brand_name = brand.find('span', class_='name').text.strip() if brand.find('span', class_='name') else brand.text.strip()
                        brand_url = brand['href']
                        if not brand_url.startswith('http'):
                            brand_url = self.base_url + brand_url
                        
                        brands.append({
                            'name': brand_name,
                            'url': brand_url
                        })
                        logging.info(f"Found brand: {brand_name} at URL: {brand_url}")
            
            if not brands:
                logging.error("No brands found in the popular brands section")
                
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

    def extract_gallery_images(self, section):
        """Extract images from gallery based on section type"""
        images = []
        
        # Find main carousel container
        carousel = section.find('ul', {'data-carousel': 'ColorGallery'})
        if carousel:
            # Get both active and lazy loaded images
            for img in carousel.find_all('img'):
                img_url = (img.get('data-lazy-src') or 
                          img.get('data-src') or 
                          img.get('src'))
                
                if img_url and not img_url.endswith('spacer3x2.png'):
                    if img_url.startswith('//'):
                        img_url = f"https:{img_url}"
                    
                    # Clean URL and add high res params
                    img_url = img_url.split('?')[0]
                    img_url = f"{img_url}?imwidth=1920&impolicy=resize"
                    
                    images.append({
                        'url': img_url,
                        'title': img.get('title', ''),
                        'alt': img.get('alt', ''),
                        'category': 'interior' if 'interior' in img_url.lower() else 'exterior'
                    })
                    
        # Get thumbnail images which may have different angles
        thumbs = section.find('ul', class_='gscr_lSPager')
        if thumbs:
            for thumb in thumbs.find_all('img', class_='thumbItemList'):
                img_url = thumb.get('src')
                if img_url and not img_url.endswith('spacer3x2.png'):
                    # Convert thumbnail URL to full size
                    img_url = img_url.replace('/medium/', '/').replace('?tr=h-60', '')
                    img_url = f"{img_url}?imwidth=1920&impolicy=resize"
                    
                    if img_url not in [x['url'] for x in images]:
                        images.append({
                            'url': img_url,
                            'title': thumb.get('title', ''),
                            'alt': thumb.get('alt', ''),
                            'category': 'interior' if 'interior' in img_url.lower() else 'exterior'
                        })

        return images

    def get_car_images(self, car_url):
        """Get car images from various pages"""
        try:
            images = []
            
            # Get main page images first
            soup = self.fetch_page(car_url)
            if soup:
                # Extract from image gallery tab sections
                gallery_sections = soup.find_all('div', {'data-track-section': lambda x: x and ('Exterior' in x or 'Interior' in x)})
                for section in gallery_sections:
                    # Get main large images
                    for img in section.select('img[src*="/images/car"]'):
                        img_url = img.get('src', '')
                        if img_url and not img_url.endswith('spacer3x2.png'):
                            if img_url.startswith('//'):
                                img_url = f"https:{img_url}"
                            img_url = img_url.split('?')[0] + '?imwidth=1920&impolicy=resize'
                            category = 'interior' if 'interior' in img_url.lower() else 'exterior'
                            images.append({
                                'url': img_url,
                                'title': img.get('title', ''),
                                'alt': img.get('alt', ''),
                                'category': category
                            })

                    # Get thumbnail images and convert to full size
                    for thumb in section.select('.gsc_main img[src*="/images/car"]'):
                        img_url = thumb.get('src', '')
                        if img_url and not img_url.endswith('spacer3x2.png'):
                            if img_url.startswith('//'):
                                img_url = f"https:{img_url}"
                            # Convert thumbnail to high res
                            img_url = (img_url.replace('/medium/', '/carexteriorimages/')
                                            .replace('/small/', '/carexteriorimages/')
                                            .replace('?tr=h-60', '')
                                            .split('?')[0]) + '?imwidth=1920&impolicy=resize'
                            category = 'interior' if 'interior' in img_url.lower() else 'exterior'
                            images.append({
                                'url': img_url,
                                'title': thumb.get('title', ''),
                                'alt': thumb.get('alt', ''),
                                'category': category
                            })

            # Get color variant images
            color_url = f"{car_url}/colors"
            soup = self.fetch_page(color_url)
            if soup:
                # Get color gallery images
                gallery = soup.find('ul', {'data-carousel': 'ColorGallery'})
                if gallery:
                    for img in gallery.find_all('img'):
                        img_url = img.get('src', '')
                        if img_url and not img_url.endswith('spacer3x2.png'):
                            if img_url.startswith('//'):
                                img_url = f"https:{img_url}"
                            img_url = img_url.split('?')[0] + '?imwidth=1920&impolicy=resize'
                            images.append({
                                'url': img_url,
                                'title': img.get('title', ''),
                                'alt': img.get('alt', ''),
                                'category': 'colors'
                            })

                # Get individual color pages
                color_links = soup.select('div.gscr_lSGallery li[data-color] a[href]')
                for link in color_links:
                    color_url = link['href']
                    if not color_url.startswith('http'):
                        color_url = self.base_url + color_url
                    
                    color_soup = self.fetch_page(color_url)
                    if color_soup:
                        color_gallery = color_soup.find('ul', {'data-carousel': 'ColorGallery'})
                        if color_gallery:
                            for img in color_gallery.find_all('img'):
                                img_url = img.get('src', '')
                                if img_url and not img_url.endswith('spacer3x2.png'):
                                    if img_url.startswith('//'):
                                        img_url = f"https:{img_url}"
                                    img_url = img_url.split('?')[0] + '?imwidth=1920&impolicy=resize'
                                    images.append({
                                        'url': img_url,
                                        'title': img.get('title', ''),
                                        'alt': img.get('alt', ''),
                                        'category': 'colors'
                                    })

            # Remove duplicates while preserving order
            seen = set()
            unique_images = []
            for img in images:
                if img['url'] not in seen:
                    seen.add(img['url'])
                    unique_images.append(img)

            logging.info(f"Found {len(unique_images)} unique images across all pages")
            return unique_images

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

    def extract_color_images(self, soup):
        """Extract color variant images"""
        images = []
        try:
            # First try to get directly from color gallery
            color_gallery = soup.find('ul', {'data-carousel': 'ColorGallery'})
            if color_gallery:
                for img in color_gallery.find_all('img'):
                    if not img.get('src', '').endswith('spacer3x2.png'):
                        img_url = img.get('src', '')
                        if img_url:
                            if img_url.startswith('//'):
                                img_url = f"https:{img_url}"
                            img_url = img_url.split('?')[0] + '?imwidth=1920&impolicy=resize'
                            title = img.get('title', '').replace('Dzire ', '')  # Clean up title
                            images.append({
                                'url': img_url,
                                'title': title,
                                'alt': title,
                                'category': 'colors'
                            })

            # Get list of all color variants from color picker
            color_dots = soup.select('div.gscr_lSGallery li[data-color]')
            for dot in color_dots:
                try:
                    color_control = dot.find('div', class_='gs_control')
                    if not color_control:
                        continue
                        
                    # Get color name
                    color_name = color_control.get('title', '')
                    
                    # Get color style to detect dual tone
                    color_icon = dot.find('i', class_='coloredIcon')
                    is_dual_tone = 'linear-gradient' in color_icon.get('style', '') if color_icon else False
                    
                    # Get color index and find corresponding image
                    color_index = dot.get('data-color', '').replace('color', '')
                    img_container = soup.select_one(f'ul[data-carousel="ColorGallery"] li:nth-of-type({int(color_index)+1})')
                    if img_container:
                        img = img_container.find('img')
                        if img and not img.get('src', '').endswith('spacer3x2.png'):
                            img_url = img.get('src', '')
                            if img_url:
                                if img_url.startswith('//'):
                                    img_url = f"https:{img_url}"
                                img_url = img_url.split('?')[0] + '?imwidth=1920&impolicy=resize'
                                
                                # Clean up title
                                title = f"{color_name}"
                                if is_dual_tone:
                                    title = f"{title} with Dual Tone"
                                
                                images.append({
                                    'url': img_url,
                                    'title': title,
                                    'alt': color_name,
                                    'category': 'colors'
                                })

                    # Check for color variant specific page
                    color_link = dot.find('a', href=True)
                    if color_link and color_link['href'] not in self.color_urls:
                        color_url = color_link['href']
                        if not color_url.startswith('http'):
                            color_url = self.base_url + color_url
                            
                        self.color_urls[color_link['href']] = True
                        color_soup = self.fetch_page(color_url)
                        if color_soup:
                            color_gallery = color_soup.find('ul', {'data-carousel': 'ColorGallery'})
                            if color_gallery:
                                for img in color_gallery.find_all('img'):
                                    if not img.get('src', '').endswith('spacer3x2.png'):
                                        img_url = img.get('src', '')
                                        if img_url:
                                            if img_url.startswith('//'):
                                                img_url = f"https:{img_url}"
                                            img_url = img_url.split('?')[0] + '?imwidth=1920&impolicy=resize'
                                            if img_url not in [x['url'] for x in images]:
                                                images.append({
                                                    'url': img_url,
                                                    'title': color_name,
                                                    'alt': color_name,
                                                    'category': 'colors'
                                                })

                except Exception as color_err:
                    logging.error(f"Error extracting color variant: {str(color_err)}")
                    continue

            # Remove duplicates while preserving order
            seen = set()
            unique_images = []
            for img in images:
                if img['url'] not in seen:
                    seen.add(img['url'])
                    unique_images.append(img)

            return unique_images

        except Exception as e:
            logging.error(f"Error extracting color images: {str(e)}")
            return []

    def get_cars_by_brand(self, brand_name, brand_url):
        try:
            soup = self.fetch_page(brand_url)
            if not soup:
                return []

            cars = []
            car_containers = soup.find_all('li', class_='gsc_col-xs-12 gsc_col-sm-6 gsc_col-md-12 gsc_col-lg-12')
            
            for container in car_containers:
                try:
                    # Initialize car_data at the start
                    car_data = {
                        'brand': brand_name,
                        'name': '',
                        'price': 'N/A',
                        'fuel_type': 'N/A',
                        'mileage': 'N/A',
                        'engine': 'N/A',
                        'power': 'N/A',
                        'transmission': 'N/A',
                        'safety_rating': 'N/A',
                        'url': '',
                        'image_counts': {cat: 0 for cat in self.image_categories},
                        'specs': {},
                        'variants': [],
                        'price_range': ''
                    }

                    # Get URL first - we need this for images and specs
                    url_element = container.find('a', href=True)
                    if url_element:
                        url = url_element['href']
                        if not url.startswith('http'):
                            url = self.base_url + url
                        car_data['url'] = url
                    else:
                        logging.error("Could not find URL for car")
                        continue

                    name_element = container.find('h3')
                    if not name_element:
                        continue
                    name = name_element.text.strip()
                    car_data['name'] = name
                    
                    logging.info(f"Processing car {name} at URL: {url}")

                    # Extract price
                    price_div = container.find('div', class_='price')
                    if price_div:
                        price = price_div.text.strip()
                        price = price.split('*')[0] if '*' in price else price
                        price = price.replace('Rs.', '').strip()
                        car_data['price'] = price

                    # Fetch car specifications
                    specs = self.get_car_specs(url)
                    if specs:
                        car_data['specs'] = specs
                        car_data['fuel_type'] = specs.get('Fuel Type', 'N/A')
                        car_data['mileage'] = specs.get('ARAI Mileage', 'N/A')
                        car_data['engine'] = specs.get('Engine Displacement', 'N/A')
                        car_data['power'] = specs.get('Max Power', 'N/A')
                        car_data['transmission'] = specs.get('Transmission Type', 'N/A')
                        car_data['safety_rating'] = specs.get('Global NCAP Safety Rating', 'N/A')

                    # Get images from all sources
                    additional_images = self.get_car_images(url)
                    image_stats = {cat: 0 for cat in self.image_categories}
                    
                    if additional_images:
                        for img_data in additional_images:
                            try:
                                category = self.get_image_category(img_data)
                                result = self.download_image(img_data, brand_name, name)
                                if result:
                                    image_stats[category] += 1
                            except Exception as img_err:
                                logging.error(f"Error downloading image: {str(img_err)}")
                                continue
                                
                    car_data['image_counts'] = image_stats

                    # Get variant information
                    variant_info = self.get_car_variants(url)
                    if variant_info:
                        car_data['price_range'] = variant_info['price']
                        car_data['variants'] = variant_info['variants']

                    cars.append(car_data)
                    logging.info(f"Successfully processed {name} with {sum(image_stats.values())} images downloaded")
                    
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

    def download_image(self, img_data_or_url, brand_name, model_name):
        """Download image and save to appropriate category folder"""
        try:
            # Handle both string URLs and image data objects
            if isinstance(img_data_or_url, str):
                img_url = img_data_or_url
                img_data = {
                    'url': img_url,
                    'title': model_name,
                    'category': 'exterior'
                }
            else:
                img_data = img_data_or_url
                img_url = img_data['url']  # Use direct access since we know it exists

            if not img_url or img_url in self.downloaded_urls:
                return None

            # Clean names for directory structure  
            clean_model = "".join(c for c in model_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
            clean_title = "".join(c for c in img_data.get('title', 'image') if c.isalnum() or c in (' ', '-', '_')).rstrip()
            
            # Determine category
            category = img_data.get('category') or self.get_image_category(img_data)
            
            # Create directory structure
            category_dir = os.path.join(self.image_dir, brand_name, clean_model, category)
            os.makedirs(category_dir, exist_ok=True)

            # Generate unique filename
            filename = os.path.join(category_dir, f"{clean_title}.jpg")
            counter = 1
            while os.path.exists(filename):
                filename = os.path.join(category_dir, f"{clean_title}_{counter}.jpg")
                counter += 1

            # Download image
            response = requests.get(img_url, headers=self.headers, stream=True, timeout=10)
            response.raise_for_status()
            
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            self.downloaded_urls.add(img_url)
            logging.info(f"Downloaded image to {filename}")
            
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

    def get_color_variant_images(self, car_url):
        """Get images for each color variant"""
        try:
            colors_url = f"{car_url}/colors"
            soup = self.fetch_page(colors_url)
            if not soup:
                return []

            images = []
            color_section = soup.find('section', {'data-track-component': 'colorGallery'})
            if color_section:
                # Get color dots with URLs
                color_dots = color_section.select('div.gscr_lSGallery li[data-color]')
                for dot in color_dots:
                    try:
                        # Get color info
                        color_control = dot.find('div', class_='gs_control')
                        if not color_control:
                            continue
                            
                        color_name = color_control.get('title', '')
                        color_icon = color_item.find('i', class_='coloredIcon')
                        is_dual_tone = 'linear-gradient' in color_icon.get('style', '') if color_icon else False
                        
                        # Find large image for this color
                        color_index = color_item.get('data-color', '').replace('color', '')
                        color_gallery = soup.find('ul', {'data-carousel': 'ColorGallery'})
                        if color_gallery:
                            large_image = color_gallery.select_one(f'li:nth-of-type({int(color_index)+1}) img')
                            if large_image:
                                img_url = (large_image.get('data-lazy-src') or 
                                         large_image.get('data-src') or 
                                         large_image.get('src'))
                                if img_url and not img_url.endswith('spacer3x2.png'):
                                    if img_url.startswith('//'):
                                        img_url = f"https:{img_url}"
                                    img_url = img_url.split('?')[0]
                                    img_url = f"{img_url}?imwidth=1920&impolicy=resize"
                                    
                                    images.append({
                                        'url': img_url,
                                        'title': f"{'Dual Tone' if is_dual_tone else 'Color'} - {color_name}",
                                        'alt': color_name,
                                        'category': 'colors'
                                    })

                        # Get additional angle shots for this color
                        angle_shots = soup.select(f'div[data-color="{color_index}"] img')
                        for angle in angle_shots:
                            img_url = (angle.get('data-lazy-src') or 
                                     angle.get('data-src') or 
                                     angle.get('src'))
                            if img_url and not img_url.endswith('spacer3x2.png'):
                                if img_url.startswith('//'):
                                    img_url = f"https:{img_url}"
                                img_url = img_url.split('?')[0]
                                img_url = f"{img_url}?imwidth=1920&impolicy=resize"
                                
                                images.append({
                                    'url': img_url,
                                    'title': f"{'Dual Tone' if is_dual_tone else 'Color'} - {color_name} - {angle.get('title', 'Angle View')}",
                                    'alt': f"{color_name} - {angle.get('alt', 'Angle View')}",
                                    'category': 'colors'
                                })
                    except Exception as color_err:
                        logging.error(f"Error extracting color variant: {str(color_err)}")
                        continue

            return images

        except Exception as e:
            logging.error(f"Error getting color variants: {str(e)}")
            return []

    def scrape_all_cars(self):
        all_cars_data = []
        
        for brand, url in self.brand_urls.items():
            logging.info(f"Processing brand: {brand}")
            cars = self.get_cars_by_brand(brand, url)
            all_cars_data.extend(cars)
            time.sleep(2)  # Respect rate limiting
            
        return pd.DataFrame(all_cars_data)

    def save_data(self, df, filename='cars_data.csv'):
        try:
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
