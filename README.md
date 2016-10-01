# dennison product training
===========================
This repository contains everything related to the Dennison Design product training application:

- cloud cms configuration and content importer
- web site
- content models


## Setup

### Step 1: Install the Cloud CMS Command Line Client

    npm install cloudcms-cli -g
    cloudcms init


### Step 2: Connect to the Cloud CMS project

From the root of the Dennison Github project (this project), run:

    cloudcms connect

and connect to the Dennison project to which you would like to deploy configuration and content.

After connecting you should have a <code>gitana.json</code> file available.

### Step 3: Install/update the configuration (content model, workflow definitions, etc) and content to the Cloud CMS project

To import the latest data set from Google Docs -

     sh import-from-google-docs.sh
     
To blow away existing content and recreate -

    sh redeploy-content.sh
    
To update project properties (paths, modules) -

    sh configure-project.sh

### Step 4: Start a local cloudcms server to test the web site

cd website
npm install
node app


## Deployment

Set up AWS EB:

    http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html

Make sure that EB picks up the following credentials:
    
    Access Key ID: AKIAI3PD32VXXIN4QLFA
    Secret Access Key: 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
    Region: us-east-1
    
I installed this way:

    curl -s https://s3.amazonaws.com/elasticbeanstalk-cli-resources/install-ebcli.py | python

Once installed, go into the website driectory.

To tear down the existing environment:

    eb terminate
    
And then wait for the termination to complete.
    
To set up a new environment:

    eb create
    
Make sure to answer any prompts thusly:

    - environment name = moen-dev
    - dns cname prefix = moen-dev

    
Ideally, one you've created, you can run "eb deploy" to upload new application versions.
This has not been working for me very well.  

As such, I've had to first terminate the environment and then recreate it which takes longer.
It has to rebuild the scaling groups, start up new EC2 instances and more.
But at least it works.

Other details in case:

    - application = moen
    - region = us-east-1
    - platform = 64bit Amazon Linux 2015.03 v2.0.1 running Node.js
    
    
# Load Testing and Validation

Basic load testing and site validation is done using the "siege" command line tool.
On Mac, you can install this using HomeBrew:

    brew install siege
    
Then verify it is installed:

    siege -C
    
To run load testing, open two terminals.

- In terminal window #1,

    cd website
    export PORT=4000
    export NODE_ENV=production
    node app
    
- In terminal window #2,

    cd website
    sh run.sh
    # beacon
