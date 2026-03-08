# fin-learn

Lean Finnish

The application should install a copy of a dictionary file which is an INI syntax to allow grouping of words.

## Main window:

Then the main window should allow selecting a group or to work on all words.
It should also provide ability to reset all statistics and stored local statistics.
It should present statistics for how many words are already learened, how many words are in the dictionary, dictionary date.
A start button

## Spelling window:

At the top let the user select direction of translation English -> Finnish or Finnish -> English (from and to languages)
The bottom of the screen should show the keyboard
The user is given a word in From language and then there is an empty entry section to fill with the To language.
A button "Check" should verify the correct spelling by comparing to the dictionary.

If there are multiple words in the dictionary matching the same From language word accept all of them as valid result.

## Success and Failure tracking

The application should keep a local storage for each word with the number of correctly spelled times.
Every time a word is spelled correctly increase that number.
Every time it is misspelled decrease it.
Sort the words by lowest number and randomly select next word to spell from that selected group/all with lowest grade.

Words that have reached 4 successful spellings should be counted as "learned" (for statistics)

## Initial Dictionary

I am giving you a plain text file with some words: words.md

The lines are structured Finnish word = English word(s)
Some of the lines contain a "|" which should be treated as a newline.
Some of the lines may have ";" after which the Finnish Partitive flavor of the word is given - just ignore it.

I would like you to examine the words and try to provide a better grouping of them.
First step is to convert the dictionary to a Json that you could use later in the Vue application.
I suggest to have a way to mark parts of the file with the date of introduction of the words in that section.
