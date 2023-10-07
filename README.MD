# FitnessApp
## Overview
The app is a sport activity analyzer like the ones normally offered by the fitness trackers/ fitness watches manufacturers e.g. https://flow.polar.com.

The mentioned example has some missing features I'd like to have and I've implemented them in this app
* **Outlier removal** The data from the watch might have wrong readings, they increase unnecessary the y-range of the plot
* **Compare sessions** Plotting two sessions together allows to have detailed comparison  
## Features
* Standard user registration and login/logout
* Import and store training session data
  * Training data has to be in the format like the samples in ./in folder - this is the format the data can be exported from the actual fitness watch I have
  * Additionally to the data in **csv** format the **track id** can be optionally specified
* View the list of the logged in user training sessions statistics
  * Sorted by the date of activity in descending order
  * The type of activity (sport) can be selected
  * The activity type icon in the navigation panel shows the selected sport
  * Training sessions can be deleted and opened from this list
  * Columns change depending on which activity is selected
* Openning the training session results in the visualization of its data
    * Statistics
    * Plots
      * The outliers can be removed (one can toggle between the view with or without outliers)
      * For performance reasons the amount of plotted fulcrums is being dynamically reduced
      * The x-axis range can be changed
      * One training session can be selected from the list for comparison (and deselected)
    * List of the training sessions with the same track id and the same sport
   
## Distinctiveness
The main functionality of this app is **data visualization** which was not the case for any other project.

## Complexity
*... also contains some distinctiveness*
* Architecture - clean cut between back-end and front-end
  * Front-end is in React only - this demanded own implementation of logging and registration
  * Back-end - api in Django
* Working with larger chunks of data (training sessions)
  * Transporting it, storing it, processing it
* Dynamic plotting and performance
## Files
* Front-end `./frontend/` created with `npx create-react-app frontend`. In `/src`:
  * `App.js` assembles all the components of the one-page app and manages when they are present
  * `Client.js` contains all methods to communicate with API
  * `Home.js` Major component for the "Home view", default view for the logged in user
  * `Nav.js` Navigation panel component
  * `TrainingData.js` Major component for a single training session view
  * `TrainingMetaDataList.js` Component used through the app to show training sessions statistics list
  * `style.css` - custom style for the chart container
* Back-end `.` excluding `frontend` - no additional files

* `./in` sample files with training data to import
## How to run
Install dependencies
```
pip install -r requirements.txt
cd frontend
npm install
```
Run

Build React application and run Django server
```
npm run build
cd ..
python manage.py runserver
```
