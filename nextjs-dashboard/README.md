# stackstorm-handcrafted-haven

This is the wdd430 group project.

Kim K Brown
Carla Maetzin Ramirez Quintanar
Uyiosa Richmond Izekor

Project Requirements and Scope Summary
Purpose of the Project
Handcrafted Haven is a web application designed to provide a digital marketplace where artisans can showcase and sell handcrafted items. This platform emphasizes community engagement, support for local artisans, and sustainable consumption.
Core Functional Requirements (MVP)
•	Seller profiles with artisan information and product collections
•	Product listings including images, descriptions, and pricing
•	Product browsing with category and price filtering
•	Reviews and ratings for products
Constraints and Standards
•	Front-End: Next.js (HTML, CSS, JavaScript)
•	Back-End: Node.js with a database - Mongodb
•	Project Management: GitHub Kaban Board
•	Code Management: Git and GitHub
•	Deployment: Vercel
•	Design standards include performance, accessibility (WCAG 2.1 AA), SEO, usability, responsive design, consistent branding, and intuitive navigation
We agreed to focus on browsing products, viewing seller profiles, and displaying reviews for the MVP. Authentication and seller product creation may be expanded in later iterations.

Repository and Project Setup

•	A public GitHub repository was created for the group project
•	A GitHub Project (Kanban board) was created and linked to the repository
•	Columns were set up as: Backlog, In Progress, Review, Done
•	All group members were added as collaborators
•	A README.md file was created including the project summary, team member names, and technology stack
•	Each group member successfully cloned the repository locally
Repository URL:
https://github.com/I-RICHWEB/stackstorm-handcrafted-haven
GitHub Kaban URL:
https://github.com/users/I-RICHWEB/projects/2
Design Theme and Component Planning
Design Theme
•	Warm blues and green:
o	Primary – 9CF6F6 (Pacfic Cayan) – for headings
o	Secondary – 3587A4 (Soft Cayan) – for background
o	2B9720 (Forest Green) - Highlights for hover buttons
•	Fonts – Inter Latin & Lusitane
•	Product-focused layout with clear visual hierarchy
     Layout
•	Layout style: card grid + filters top bar – all pages
•	Nav – sidebar – all pages 
 

Core Pages Identified
Next.js App Router style:
•	Home page - /home(Home (hero + featured categories/items)
•	Product catalogue page - /products - Product catalogue + filters
•	Product detail page - /products/[id] Product detail + reviews
•	Seller profile page - /sellers/[id] Seller profile + listings + ratings or reviews 
•	/auth/login (or placeholder if auth later)
Core Components Identified
•	Navigation bar and footer
•	Product card and product grid
•	Filter bar for categories and price range
•	Review list and rating stars, Review Form (later)
•	Seller Card
 Products
•	Custom Wooden Bowels
Handcrafted wooden bowls made from locally sourced hardwood and finished with food-safe oils. Each bowl features natural wood grain patterns, making it ideal for serving snacks, salads, or as a decorative centrepiece for entertaining.

•	Handmade Jewellery 
A collection of handcrafted jewellery created using carefully selected materials and traditional techniques. Each piece is uniquely designed, offering timeless elegance and individuality for everyday wear or special occasions.
•	Handmade Christmas Dolls
Festive handmade Christmas dolls crafted with soft fabrics and detailed stitching. Designed to add warmth and charm to holiday décor, each doll is uniquely styled and perfect for seasonal displays or gifting.
•	Handmade Baby Knitwear
Soft, hand-knitted baby garments made using gentle, baby-safe yarns. Designed for comfort and warmth, each piece is carefully crafted to provide a cozy fit while showcasing traditional knitting techniques.
•	Handmade Christmas Tree Decorations
A collection of handcrafted Christmas tree decorations created using traditional Napal techniques and quality materials. Each piece is designed with festive detailing to add warmth and character to seasonal décor, making them perfect for holiday displays, gift-giving, or creating a cozy festive atmosphere.

•	Woolen Rugs (Made from Recycled Wool)
Handcrafted woollen rugs made using carefully recycled wool fibbers. Each rug is woven to be durable, warm, and environmentally friendly, featuring unique textures and colour variations that reflect sustainable craftsmanship while adding comfort and character to any living space.

•	Hand-Stitched Fabric Cushion Covers
Decorative cushion covers hand-stitched using durable fabric and detailed embroidery. Each cover is crafted to add comfort and personality to living spaces while highlighting artisan textile skills.

•	Handcrafted Fabric Lampshade Collection
A range of handcrafted lampshades made using quality fabrics and traditional techniques. Available in various sizes, shapes, and patterns, each lampshade is carefully finished to provide soft, ambient lighting while adding a distinctive handcrafted touch to home décor.

•	Handmade Ceramic Tableware Range
A collection of handcrafted ceramic tableware, including plates, bowls, and serving platters. Each item is shaped and glazed by hand, offering subtle variations in colour and texture that make every piece unique.

•	Landscape and Scenery Paintings Collection
A curated collection of original landscape and scenery paintings created by independent artists. Each artwork is hand-painted and inspired by natural environments, capturing scenes such as countryside views, coastal landscapes, and rural settings. Available in a range of sizes and styles, these paintings bring character and artistic expression to any space.	
Initial design ideas were documented and will be refined using a design tool such as Figma.
User Stories and Work Item Brainstorming
Work items on the GitHub Project Board:
1.	Initialize Next.js project structure
2.	Create global layout with navigation and footer
3.	Build Home page layout
4.	Create reusable Product Card component
5.	Build Product Catalogue page
6.	Build Detail page
7.	Add dynamic Product Detail route
8.	Create Seller Profile page
9.	Implement filtering UI (category and price range)
10.	Display product reviews and ratings
11.	Deploy the application to Vercel
These work items represent the initial MVP scope and will be expanded or refined over the next two weeks.
