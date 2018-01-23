## Project
We are planning to build a Firefox add-on that will ease the process of looking up words encountered on web pages on different online dictionaries(can be customized by the user). There are currently similar add-ons that will display an overlay when a user hovers over a word on a webpage, but they are confined to one dictionary source, which is not customizable by the user, and each add-on only supports one language. We think that adding flexibility of allowing users to define their own dictionary services and also thereby supporting any languages will be a valuable add-on for any language learners.

## How it should work
- User highlights the text, right-click to access the menu, select the predefined dictionary they want to search from.
- A overlay-layer will be temporarily appended to the DOM of the page, showing the results of the dictionary search on the highlighted text.
- This can be used for different languages, and different dictionary services, as long as they use a URL-encoded query string

## Plan/Componenets
- Add UI buttons for search on the right click menu if the add-on is active
- DOM overlay component
- Component for users to set up their dictionary services URLs.

## Anticipated challenges
- None of the members have experience in developing browser add-ons.
- Unsure of the optimal technology to use to implement our system.

## Division of work
- Product owner: Katie Lo (First hand experience in using similar add-ons for reading articles in foreign languages)
- We will decide on the division of work more in depth as we progress


## Intended audience & usefulness
Our main target are students of foreign languages who:

* Need to easily translate/look up meaning for words when browsing
* Are learning simultaneously more than one language

And specially:
* Find a need for using different dictionaries based on different languages

That necessity comes from the fact that different dictionaries are better for different languages. For example, Google Translate could be good for French, but not for Japanese. In this way, one would have to install two different extensions to better cover both cases.
