import * as core            from "@actions/core";
import * as fs              from "fs";
import * as path            from "path";
import * as mime            from "mime-types";
import { OAuth2Client }     from "google-auth-library";
import { drive_v3, google } from "googleapis";

(async function (): Promise<void> {
    try {
        const fileName: string      = core.getInput("name",          { required: false });
        const replaceId: string     = core.getInput("replaceId",     { required: false });
        const parentId: string      = core.getInput("parentId",      { required: false });
        const filePath: string      = core.getInput("path",          { required: true  });
        const client_id: string     = core.getInput("client_id",     { required: true  });
        const client_secret: string = core.getInput("client_secret", { required: true  });
        const token: string         = core.getInput("token",         { required: true  });
        const refresh_token: string = core.getInput("refresh_token", { required: true  });

        if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
            core.setFailed("The specified path does not exist or is not a path to a file");
            return;
        }

        const oAuth2Client: OAuth2Client = new google.auth.OAuth2(client_id, client_secret);
        oAuth2Client.setCredentials({ "token": token, "refresh_token": refresh_token } as any);
        const gdriveClient: drive_v3.Drive = new drive_v3.Drive({ auth: oAuth2Client });

        let file: any = {
            media: {
                mimeType: mime.lookup(filePath) as string,
                body: fs.createReadStream(filePath)
            },
            requestBody: {
                name: fileName == "" ? path.basename(filePath) : fileName
            },
            supportsAllDrives: true
        };

        let response;

        if (replaceId) {
            file.fileId = replaceId;
            if (parentId) file.addParents = [ parentId ];
            response = await gdriveClient.files.update(file);
        }
        else {
            if (parentId) file.requestBody.parents = [ parentId ];
            response = await gdriveClient.files.create(file);
        }

        core.setOutput("fileId", response.data.id);
    }
    catch (exception) {
        core.setFailed(`An exception was thrown: ${ exception }`);
    }
})();