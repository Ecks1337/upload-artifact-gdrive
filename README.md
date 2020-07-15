# Upload-Artifact-GDrive

This uploads an artifact from your workflow to google drive allowing you to store data once a workflow is complete.

# Usage

See [action.yml](action.yml) for a description of all valid parameters.

### Upload a File to Google Drive
```yaml
steps:
- uses: actions/checkout@v2

- run: mkdir -p path/to/artifact

- run: echo hello > path/to/artifact/world.txt

- uses: Ecks1337/upload-artifact-gdrive@master
  with:
    name:          my-artifact.txt
    path:          path/to/artifact/world.txt
    parentId:      17G4HkZu_CJmZdsl1aui40ANHrjSOhlYf
    client_secret: $SECRET
    client_id:     $CLIENT_ID
    token:         $TOKEN
    refresh_token: $REFRESH_TOKEN
```

### Uploading without a parent folder id

You can upload an artifact without specifying the id of a parent folder
```yaml
- uses: Ecks1337/upload-artifact-gdrive@master
  with:
    name:          my-artifact.txt
    path:          path/to/artifact/world.txt
    client_secret: $SECRET
    client_id:     $CLIENT_ID
    token:         $TOKEN
    refresh_token: $REFRESH_TOKEN
```
If the id of the parent folder isn't provided, the file will be uploaded into the root of the "MyDrive" folder.

### Uploading without an artifact name

You can upload an artifact without specifying a name
```yaml
- uses: Ecks1337/upload-artifact-gdrive@master
  with:
    path:          path/to/artifact/world.txt
    client_secret: $SECRET
    client_id:     $CLIENT_ID
    token:         $TOKEN
    refresh_token: $REFRESH_TOKEN
```
If the artifact name isn't provided, the name of the file will be used as the name of the artifact.

### Overwrite an existing Google Drive File
```yaml
- uses: Ecks1337/upload-artifact-gdrive@master
  with:
    replaceId:     2i7RuQwKzuZr-DNxNiooHfVMwIJLdjf-H
    path:          path/to/artifact/world.txt
    client_secret: $SECRET
    client_id:     $CLIENT_ID
    token:         $TOKEN
    refresh_token: $REFRESH_TOKEN
```

### Overwrite and move an existing Google Drive File
```yaml
- uses: Ecks1337/upload-artifact-gdrive@master
  with:
    replaceId:     2i7RuQwKzuZr-DNxNiooHfVMwIJLdjf-H
    parentId:      17G4HkZu_CJmZdsl1aui40ANHrjSOhlYf
    path:          path/to/artifact/world.txt
    client_secret: $SECRET
    client_id:     $CLIENT_ID
    token:         $TOKEN
    refresh_token: $REFRESH_TOKEN
```

### Getting the id of the uploaded file

The action returns the Google id of the artifact that has been uploaded to Google Drive

```yaml
steps:

- name: Upload artifact to google drive
  id: uniqueStepId
  uses: Ecks1337/upload-artifact-gdrive@master
  with:
    path:          path/to/artifact/world.txt
    client_secret: $SECRET
    client_id:     $CLIENT_ID
    token:         $TOKEN
    refresh_token: $REFRESH_TOKEN

- name: Get the Google file id
    run: echo "The id is ${{ steps.uniqueStepId.outputs.fileId }}"
```

### Conditional upload

To upload artifacts only when the previous step of a job failed, use [`if: failure()`](https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#job-status-check-functions):

```yaml
- uses: Ecks1337/upload-artifact-gdrive@master
  if: failure()
  with:
    path:          path/to/artifact/world.txt
    client_secret: $SECRET
    client_id:     $CLIENT_ID
    token:         $TOKEN
    refresh_token: $REFRESH_TOKEN
```
