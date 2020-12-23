# File Management API

A Node.js webservice which exposes four endpoint i.e register, login, upload, and delete for registering the new user, 
registered user can login, upload and delete file as well using upload and delete endpoint.

## Different Endpoint that this service supports
> 1. localhost:${port}/user/register
> 2. localhost:${port}/user/login
> 3. localhost:${port}/upload
> 4. localhost:${port}/delete

## Instructions to install on local machine
> 1. Clone the project: git clone https://github.com/humblefool96/FileSystem.git
> 2. Run npm install to install all dependent packages
> 3. Run node server.js

## parameters expected by API Endpoints
> 1. register expects a name, username and a password which it stores in user collection,
     in mongodb(encrypted password is stored) also username must be unique
> 2. login expects a username and a password, given a correct credential it will send a response of 200 with JWT(json web token)
> 3. upload exoects a username and a file which it stores the file in AWS S3 using aws-sdk, and the file url generated is stored in files collection,
     along with username also assigning new file name by generating unique identifier using uuid,
     so that two file with same name but with different content can be uploaded with ease.   
> 4. delete endpoint expects a username and filename to delete and it searches the files collection if for that user the given filename exist,
     it deletes that and send 200 as response.
