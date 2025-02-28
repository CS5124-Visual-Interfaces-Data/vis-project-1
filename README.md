# Visual Interfaces Data Project 1

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Project%201%20Demo-blue)](https://project-1-demo-vis.netlify.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-lightgrey)](https://github.com/CS5124-Visual-Interfaces-Data/vis-project-1)

## Project Overview

This repository contains a visualization focusing on Disabled Veterans and Disabled Non-Veterans. Specifically it displays their locations in the US alongside quality of life data.

## Getting Started

To work with this project locally:

### Prerequisites

- Visual Studio Code (VSCode)
- Live Server extension installed in VSCode (or you can figure it out with nginx + docker if you're insane)

### Clone Repository

```bash
git clone https://github.com/CS5124-Visual-Interfaces-Data/vis-project-1.git
```

### Run Locally

1. Open the cloned repository in VSCode
2. Click the "Go Live" button in the bottom-right corner of the VSCode window
3. Your browser will automatically open with the running application

Alternatively, you can right-click any HTML file in the Explorer panel and select "Open with Live Server" to start the development server.

# Documentation

### Motivation

I wanted to see the differences in quality of life in areas with high disability and to look for any differences between veterans and non-veterans.

### Data

Data was taken from the following sources:

- https://www.ers.usda.gov/data-products/atlas-of-rural-and-small-town-america
- https://www.cdc.gov/dhdsp/maps/atlas/index.htm

They were compiled into one .csv with python (removed unused columns), to make loading faster.

- The python file can be found at:
  [data/desired_data_creator.py](data/desired_data_creator.py)
- The csv file can be found at:
  [data/desired_data_creator.py](data/desired_data.csv)

The original .csv files can be found in the data directory

### Visualization Components

- Click "Combined" to get a view of both data points (veterans and non-veterans) overlaid on one another.
- Hover over counties to see the exact numbers of disabled peoples, alongside quality of life statistics
- Clicking on a country opens a pop-up displaying a histogram with the aforementioned quality of life metrics
- A scatter plot sits at the bottom of the page, where each point is an individual county.

### Discovery

This visualization enables users to explore the geographical differences between disabled veterans and disabled non-veterans. The quality of life metrics can also create questions of how disability effects a county's overall quality of life.

For instance, the southwest has a large number of people with disabilities. One of these large populations is Los Angeles. Despite what one might think, inactivity in this county is way lower than in other parts of the US. Hovering over LA reveals a 19% rate, while a wandering mouse will pick up rates of 20% and 30% in areas with low amounts of people with disabilities.

## Process

### Libraries

- d3
  - Main javascript library used to make interactable svg visualizations
- topojson
  - Library used to draw map svgs and cdn for map svg data.

### Structure

<pre>
<a href="css/">[css/]</a>
├── <a href="css/fonts/">[fonts/]</a>                         # Google Fonts collection
└── <a href="css/main.css">[main.css]</a>
<a href="data/">[data/]</a>
├── <a href="data/Rural_Atlas_Update24/">[Rural_Atlas_Update24/]</a>          # Veteran data
├── <a href="data/desired_data_creator.py">[desired_data_creator.py]</a>        # Data processing script
├── <a href="data/desired_data.csv">[desired_data.csv]</a>               # Processed data output
└── <a href="data/national_health_data_2024.csv">[national_health_data_2024.csv]</a>  # Quality of life data
<a href="js/">[js/]</a>
├── <a href="js/libs/">[libs/]</a>                          # External libraries
├── <a href="js/main.js">[main.js]</a>
└── <a href="js/visualization/">[visualization/]</a>                 # Visualization-specific JS files
<a href="index.html">[index.html]</a>
<a href="README.md">[README.md]</a>
</pre>

### Demo

View the live demo at: https://project-1-demo-vis.netlify.app/

## Challenges & Future Work

### Challenges

I had a webkit issue where, when display is set to none and back to block, pattern fills will disappear. I was able to fix this by appending my fill patterns to body directly instead of the charts I was animating and toggling.

### Future Work

I did not get to implement the brush filtering for the choropleth maps. The idea was to add a brush to the bottom scatterplot and use it to choose the range of population values to display on all of the choropleth maps. This would have allowed smaller differences to be easier seen. Some large data points like in LA make smaller ones really hard to distinguish from one another.

I need to give myself more time to work on these projects so that I can accomplish more within the time limit.

## AI & Collaboration

### AI

I made use of an AI chatbot called Phind: https://www.phind.com/
It has a references feature that helped me find helpful stackoverflow articles and d3 documentation pages. It was very helpful in making the stripe pattern and in finding the webkit pattern bug.

### Collaboration

I did not interact with anyone else about this project. In the future I want to show the site to less technical friends and family to get more feedback on the visuals.

## Videos

### Overview

https://youtu.be/d6bMap8hSPs

### Demo

https://youtu.be/BrvLwLFPuDU
