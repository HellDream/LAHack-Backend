# LAHack-Backend

## API

### baseUrl:

```
localhost: http://localhost:5000/lahacks-82b71/us-central1/api
firebase: 待定
```

- Get All Records

```
Method: GET
URL: /records
Response:
[
  {
    "userId":"userId",
    "lon": 123.11,
    "lat": 45.67,
    "text": "1234"
  }
]
```

- Get One Record

```
Method: GET
URL: /records/{documentId}

Response:
{
  "userId":"userId",
  "lon": 123.11,
  "lat": 45.67,
  "text": "1234"
}

```

- Upload Record

```
Method: POST
Content-Type: multipart/form-data
URL: /uploadAudio

Request:
{
  "audio": audioFile,
  "userId":"userId",
  "lon": 123.11,
  "lat": 45.67,
}

Response:
statusCode: 201 or 500
data: none

```

- Upload User Data:
  T.B.D

## Tables

### Users

Table: users

```
metadata:
{
  "userId":"userId123",
  "firstName":"abc",
  "lastName":"cde",
  "email": "email@123.com",
  "createdTime":"createdTime"
}

### Records
Table: records
```

metadata:
{
"userId":"userId",
"lon": 123.11,
"lat": 45.67,
"audioUrl": "https://firebasestorage.googleapis.com/v0/b/lahacks-82b71.appspot.com/o/792227734297.mp3?alt=media&token=dbe57f34-7266-438c-8f72-fdbfc2ec3815",
"audioPath": "gs://lahacks-82b71.appspot.com/792227734297.mp3",
"text": "text"
}
