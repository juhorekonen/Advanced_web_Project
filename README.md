Name: Juho Rekonen</br>
Student ID: 441410

This is my Full Stack Project I made on the course: CT30A3204 Advanced Web Applications</br>

![kuva](https://github.com/user-attachments/assets/6e536607-dfe0-4f37-972a-0e922a8a9087)


The application Kanban lets authenticated users create columns, cards, and comments to the Kanban Board. It uses JSONWebToken to authenticate registered users during login process.

The application is built on Node.JS, Express.JS, and React. Database is handled by MongoDB.</br>

**Video to show the project running:**</br>
https://youtu.be/ZDxcWiTm0Mo

**How to run the project:**
- Clone this repository to an empty folder using VSCode or other tools
- Make sure that you are in the "Advanced_Web_Project" folder
- Run "npm install"  in the terminal to install all packages to both backend and frontend
- Run "npm run dev" in the terminal to start the application
- Open http://localhost:3000/

**User Manual**</br>
-	To begin using the application, use the buttons on the header or the links on the home page to either register a new user or log in to an already existing one
-	During registration, do note that usernames are unique *(means you cannot choose a username that already exists)*, and passwords must contain at least one number and one special character
-	After registration, the user will be redirected to the login page. Another way to get to this page is by first going to the home page, and then choosing to log in *(from link or header button)*
-	After entering the user’s credentials correctly to the login page, the user will be redirected to the Kanban Board. At this moment, an option for logging out appears to the header. In order to log out of the application, simply click Logout.
-	To create new columns, click the “**Add Column**” -button found in the Kanban Board. The user will be redirected to another page where a title for the new column must be given. After filling in the fields, click “**Add Column**”.
-	To delete a column, click the “**Delete Column**” -button found inside the column. This will delete all possible child objects *(cards, comments)* before deleting the column.
-	To update a column, click the title of the column. A text field will appear, and the user can rename the title. Click anywhere else on the UI to update the title.
-	To create new cards, click the “**Add Card**” -button found inside a column. The user will be redirected to another page where title, content, color, and estimated time of completion must be given. After filling in the fields, click “**Add Card**”.
-	To delete a card, click the “**Delete**” -button found inside the card. This will delete all possible child objects *(comments)* before deleting the card.
-	To update a card, click the title or the content of the column. In the case of the title, a text field will appear, and the user can rename the title. Click anywhere else on the UI to update the title. In the case of the content, a text area will appear, and the user can rewrite the content. Click “**Save**” to save your content. The time of creation *(createdAt)* will be updated upon updating content.
-	To move a card within a column, click the “**Up**” -button to move the card upwards, and “**Down**” -button to move the card downwards. Do note that in columns that only have one card, clicking these buttons will not move the card, since it is already at the top and at the bottom simultaneously. Also, if a card is already at the top, the user cannot move it upwards. Vice versa, if a card is already at the bottom, the user cannot move it downwards.
-	To move cards to another column, the user needs to make sure that more than one column exists. Click the “**Left**” -button to move the card to a column on the left side, and “**Right**” to move a card to a column on right side. Do note that if the card is on a column that is already on the very left side, the user cannot move it to the left. Similarly, if a card is on a column that is already on the very right side, the user cannot move it to the right. After successfully moving a card, the user must refresh the page to load the front-end.
-	To create a comment, click the “**Add Comment**” -button found inside a card. The user will be redirected to another page where content must be given. After filling in the fields, click “**Add Comment**”.
-	To update a comment, click the content of the column. A text area will appear, and the user can rewrite the content. Click “**Save**” to save your content. The time of creation *(createdAt)* will be updated upon updating content.
-	At any point in time, the user can switch languages from English to Finnish or vice versa by clicking the “**FI**”- or “**EN**” -buttons.


