# BACKEND
## Setting up
## ``.env`` file
### mod-6-project/backend/.env
```
SECRET_KEY=123456
DATABASE_URL=sqlite:///dev.db
```

## Set your Virtual Environment
Python 3.9.6 ('.vent':Pipenv)

interpreter path   ``./mod-6-project/backend/.venv/bin/python``

## Install pipenv dependencies
```pipenv install && pipenv shell```



## Create database and seed  (when there's no dev.db)
```pipenv run i```

## Regenerate database
```pipenv run db```
### other quick commands
```
[scripts] 

pipenv run + " "

d = "rm instance/dev.db"
m = "pipenv run flask db migrate"
u = "pipenv run flask db upgrade"
i = "sh -c 'pipenv run u && flask seed && flask run'"
db = "sh -c 'pipenv run d && pipenv run u && flask seed && flask run'"
```
