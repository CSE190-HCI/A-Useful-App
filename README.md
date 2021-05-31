# Installation

## Backend

Move to backend\api and create a virtual environment, for Unix-based operating system, use:

```bash
$ python3 -m venv venv
$ source venv/bin/activate
(venv) $ _
```

For Windows, use:

```bash
$ python -m venv venv
$ venv\Scripts\activate
(venv) $ _
```

You will also need to install several Python packages:

```Python
(venv) $ pip install flask python-dotenv pandas sklearn simplejson requests spotipy
```

## React configuration:

In package.json, add proxy and start-api:

```json
{
  ...
  "scripts": {
    "start": "react-scripts start",
    "start-api": "cd ../backend/api && venv/bin/flask run --no-debugger",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
  ...
  "proxy": "http://localhost:5000"
}
```

## .gitignore

Add the following to .gitignore

```
venv
__pycache__
```
