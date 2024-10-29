## Project Summary

**WebServer (WS)**

* Set up event listeners for the live chat and "restart match" functions.
* Transformed the player into a proper class, encapsulating its functions and variables.
* Eliminated all global variables and restructured the code to make them unnecessary.
* Created a game class to manage all the game logic.
* Created utility/constants files to store constants used for string comparisons on the WebSocket side.

**React**

* Created a reusable button component.
* Gave the FieldHolder component its own file.
* Created two custom hooks:
    * `useCurrentUser`: Provides user info to avoid accessing `app.settings.curr_user` everywhere. This would be even more useful if we had more user variables.
    * `useSocket`:  Handles the connection between the React app and the WebSocket, including events and callbacks. This separates the connection logic from the game logic.
* Styled the chat feature.
* Created a live chat component that appears only when two players are matched and playing.
* Made minor updates to the contact form.
* Created a higher-order component (HOC) called `GameBoardTdConstructor` to generate table cells (`<td>`) used multiple times.
* Improved `GameMain.js` to avoid direct state updates and merged redundant functions.
* Created a Header component to display either the name setting component or the welcome text, improving organization.
* Streamlined `SetGameType.js` by consolidating similar functions.
* Updated the `SetName` component to handle user input differently.
* Organized `Ttt.js`.
* Added a button to restart the game.
* Implemented a redirect to the "set name" page for both users when the game ends.

**My Thoughts**

* Getting this app running was suprisingly difficult! I was using Node.js v20 and struggled for hours. Downgrading to Node.js v14 finally did the trick.
* `GameMain` could be further improved by introducing a parent component to manage the socket and user interactions. This parent would have two children: a Game component and a Chat component. I didn't implement this to stick to the 3-hour time limit.
* With more time, I would have added a waiting room for a third player and implemented more custom hooks to access app settings, which are accessed in many places.
* A scoreboard to track scores across multiple matches would also be a cool addition.
* Overall, I'm glad I got rid of most of the global variables – they make the code so much harder to follow. The code isn't perfect, but the chat and restart features add some real value and make the app more interesting.

That's all for now – hope you like it! 
