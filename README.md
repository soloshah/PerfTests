# Perf tests

## Setup

1. clone the repo `git clone <ssh>.git` (ssh) or `git clone <https>.git` (If you are using https your personal clone link is foun on the project page)
2. fetch the latest tags `git fetch --tags`
3. checkout the latest tag e.g. `git checkout 0.0.x`
4. import the maven project into your favourite IDE
5. update the project and force update snapshots/releases
6. Install the Cucumber JVM plugin for eclipse Help > Install New Software > Click Add  
set Name - Cucumber JVM  
set Location - http://cucumber.github.com/cucumber-eclipse/update-site  
Complete the installation for the Cucumber Eclipse plugin

or Enable Cucumber for Java plugin for Intelij
File > settings > plugins > Cucumber for Java (you may need to install this)
7. In the project folder structure open any feature file from src > test > resources > features
8. run the features

## Running via Maven

Running the tests via maven allow run time arguments to passed in easily and enable more advanced report to be created when test have been run.

1. View run configurations
2. Select Maven Build >> New
3. Set Base directory `${workspace_loc:/PerformanceTests_Workspace}`
4. Set Command `./jmeter -n -t /home/osboxes/Downloads/PerfTest/PerformanceTests/src/test/jmeter/CreateNewComplaint.jmx  -l /home/osboxes/Downloads/CEMSPerfTest/PerformanceTests/src/test/report/HTMLReports/$(date +%s)newcomplaint.jtl -e -o /home/osboxes/Downloads/CEMSPerfTest/PerformanceTests/src/test/report/HTMLReports/$(date +%s)Report` replacing the report folder (html and jtl) and jmx file as requires
5. Apply and Run

## Apache JMeter

The Apache JMeter™ : Performance Tesing

The Apache JMeter application is open source software, a 100% pure Java application designed to load test functional behavior and measure performance. It was originally designed for testing Web Applications but has since expanded to other test functions.

Apache JMeter may be used to test performance both on static and dynamic resources, Web dynamic applications. 
It can be used to simulate a heavy load on a server, group of servers, network or object to test its strength or to analyze overall performance under different load types

Ref: http://jmeter.apache.org/

http://jmeter.apache.org/usermanual/get-started.html


License
-------

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
