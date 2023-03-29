# Whipple

**This project is under development!**

Whipple is a project that provides introspection into FHIR data. It allows you to explore and analyze FHIR data in a user-friendly way, giving you insight into the structure and content of the data.

## Getting started

Clone the project into a local directory using `git clone`.

### Docker

Make sure you have [Docker](https://www.docker.com/) installed and running and execute: 

```shell
docker-compose up
```

in the root directory to spin up all docker containers. The interface should be available at [http://localhost:3000](http://localhost:3000)

### Build

**backend**:

Change into the [server directory](./webapp/server) and and create a virtual environment. Acitvate the venv and install the dependenices from the `requirements.txt`.

Change into the `src` directory and dtart the [fast-api](https://fastapi.tiangolo.com/) backend:
```shell
uvicorn app.main:main --host 0.0.0.0 --port 8000 --reload
```

**frontend**:

Change into the [client](./webapp/client) directory.

Install the dependencies:
```shell
npm install
```

Start the [React](https://react.dev/) frontend:

```shell
npm run start
```

### Contributing

Contributions of all kinds are very much welcome.
