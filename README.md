# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This code project is based on youtube tutorial, url https://www.youtube.com/watch?v=w7ejDZ8SWv8&t=1730

## Installing programming environment
Download and install node js

After that run command to install npm (node package manager)
npm install -g npm

## Available Scripts

In the project directory, you can run:

### How to run json-server
Install with 
npm install json-server (or globally npm install -g json-server)

Run json-server with
json-server --watch db.json -p 5000

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

Then you can use production build as local server by installing
'npm install -g serve'
and running
'serve -s build -p 8000'

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Hyödyllisiä Visual Studio Code Extensioneita 
- ES7 React/Redux/GraphQL/React-Native snippets

### Firebase realtime database
First time install firebase
npm install --save firebase
npm install -g firebase-tools

Create .env.local file and add these two variables (without [ ] characters)

REACT_APP_FIREBASE_API_KEY="[ApiKeyHere]"
REACT_APP_FIREBASE_PROJECT_ID="[ProjectIdHere]"

### Firebase login
firebase login (once at the start of the project)

### Firebase continuous integration deployment
firebase deploy

list firebase projects
firebase projects:list

change target project 
firebase use [projectID]

### Firebase authentication
https://www.youtube.com/watch?v=PKwu15ldZ7k 

### React i18next for languagization
https://www.youtube.com/watch?v=w04LXKlusCQ

https://react.i18next.com/getting-started

https://github.com/i18next/i18next-browser-languageDetector

https://github.com/i18next/i18next-http-backend

### React Fontawesome v5 icons
https://fontawesome.com/v5/docs/web/use-with/react
