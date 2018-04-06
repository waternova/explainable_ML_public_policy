# Explainability of Machine Learning Models

Research Project on the explainability and interpretability of machine learning models.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

* Appilication/Backend
  - Python 3.4 or greater,  Django 1.11
  - numpy, pandas, patsy, sklearn, scipy, django-cors-headers, django-filter
    + To install: `pip install -r requirements.txt`

* WebUI/Frontend
  - <a href="https://nodejs.org/en/download/">node.js</a>
  - react-router-dom, file-saver
      + To install: cd Explainability/client; npm install 

* If using virtualenv, create a new virtualenv before running `pip install -r requirements.txt`   
* If using Anaconda, run `conda create --name explainableml`


### Deploying

* Appilication/Backednd: Run 

  - `python manage.py runserver`

* WebUI/Frontend: Run 

  - `npm start` (in Explainability/client directory)

* Use different terminal instances for each

***

### Development

First, set up your python environment. If using Anaconda, run
`conda create --name explainableml django numpy pandas patsy sklearn scikit-learn`

To install all node_modules for the frontend, use
```
cd Explainability/client
npm install
cd ../..
```

Then start the python api server with `python manage.py runserver`

And (in a separate terminal) start the frontend server with
```
cd Explainability/client
npm start
```

The frontend server at `http://localhost:3000/` will automatically load in your default browser.

The frontend will automatically refresh the page when JavaScript files are changed.

You can view api documentation at `http://localhost:8000/`

#### Testing

You can run tests for python with 
`python manage.py test restapi`

And tests for React in `Explainability/client` with
`npm test`

#### Database updates

Any time you update the database tables, you must also generate a migration script with `python manage.py makemigrations` Otherwise, tests will fail.

***

### Deployment on a public server (not secure)
In `Explainability/client`, run
`npm run build`
Then at the project root run
`python manage.py collectstatic` and `python manage.py runserver 0.0.0.0:8000`

### Documents

<a href="https://drive.google.com/open?id=1mvqfzQ_mZhfX1jMKooT67kJvRwBtw27upqGH7I-9D44"> User Story Map </a> <br>
<a href="https://drive.google.com/open?id=1-lky_fUsFvXq8yCx_ntPu27eIgZT6C3BqkOzpVsHK7s"> UI Wireframe </a> <br>
<a href="https://drive.google.com/open?id=1IAgED8UqGe9xtYx7QaCvNz9XhzNlivJJkf72wv6CMRA4"> ERD and Internal Interface Overview</a><br>

### Notes

Set up using create-react-app
