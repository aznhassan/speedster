A project not named Speedster

Project Name: TBD

Project Authors (in alphabetical order by last name): 

* Tushar Bhargava <tbhargav>
* Surbhi Madan <sm15>
* Nick McKenna <nmckenna>
* Hassan Sufi <hsufi>

Project Status: Fully functional, no known bugs, 0 checkstyle errors, has proper documentation and test suite. 

How to build the program: mvn package

How to run program from command line:

The program is launched using ./run. For assistance enter "./run --h" (help flag). 

GUI by default opens at: http://localhost:4567/notes

How to run the tests: 

* mvn package will run all of the JUnit tests.

 _________________________________________
/ Findbugs you are far too faint of heart \
\ for endeavours like these.              /
 -----------------------------------------
        \   0__0
         \  (oo)\_______
            (__)\       )e
                ||\____/|
                ||     ||



Explanation of FindBug errors: 

1.) DLS_DEAD_LOCAL_STORE: As Findbugs notes in its manual, this error often has a lot of false positives, and well, the SuggestionRanker dead stores bugs are false positives. The variables being complained about are used extensively.

2.) NP_NULL_ON_SOME_PATH: The autocorrect main actually checks for fileNames not being null or empty before the given code, and exits if it is empty. Therefore this error is redundant, and null pointer derefereference can never occur.

Project Organization: 

The project consists of the following packages: 

* fileio -- consists of the classes that handle writing note (JSON) data to file and reading it from file. Also includes generic Writable and Readable interfaces.

* speedster -- files specific to the project. Includes data models for Note, Flashcard, Styles as well as a thread class for maintaining (and recovering) a unique ID. Also includes API handler.

* autocorrect -- classes pertinent to autocorrect functionality (our project's backend has this functionality setup but we did not implement it on the front-end; version 2.0 hopefully :) 

* fileparsers -- parser for reading .txt files and removing all punctuations etc. (used in the autocorrect code to strip the corpus of excessive characters) 

* tries -- package for a generic trie

For more details about the package, classes or even functions please refer to the JavaDocs and the in-line comments! 

  ___  _____ ____  
 / _ \| ____|  _ \ 
| | | |  _| | | | |
| |_| | |___| |_| |
 \__\_\_____|____/ 
                    
