// Chrome Extension ID: ljdobmomdgdljniojadhoplhkpialdid
// Firefox Extension ID: {91f05833-bab1-4fb1-b9e4-187091a4d75d}

var extensionId = bowser.firefox ? '{91f05833-bab1-4fb1-b9e4-187091a4d75d}' : 'ljdobmomdgdljniojadhoplhkpialdid';

/*
Periodically send a message to Katalon Recorder with a list of capabilities. If Katalon Recorder does not receive any message for 2 minutes, it will stop communicating with the plugin.

Message structure:
{
    type: 'katalon_recorder_register',
    payload: {
        capabilities: [
            {
                id: <string: unique ID for capability>,
                summary: <string: user-friendly name, e.g script format>,
                type: <right now only 'export' is available>
            }
        ]
    }
}
*/
function register() {
    chrome.runtime.sendMessage(
        extensionId,
        {
            type: 'katalon_recorder_register',
            payload: {
                capabilities: [
                    {
                        id: 'plain-text', // unique ID for each capability
                        summary: 'Plain text', // user-friendly name
                        type: 'export' // for now only 'export' is available
                    },
                    {
                        id: 'json',
                        summary: 'JSON',
                        type: 'export'
                    }
                ]
            }
        }
    );
}

register();

setInterval(register, 60 * 1000);

/*
Message sent from Katalon Recorder for the plugin to process.

{
    type: <right now only 'katalon_recorder_export' is available>,
    payload: {
        capabilityId: <sent from plugin in katalon_recorder_register message, use this ID to differentiate between capabilites>
        commands: [
            {
                command: <command name>,
                target: <command target>,
                value: <command value>
            }
        ]
    }
}

Response structure when message.type === 'katalon_recorder_export':
{
    status: <boolean - whether the access was processed successfully>,
    payload: {
        content: <the exported script>,
        extension: <extension when user wants to download the exported script>,
        mimetype: <Katalon Recorder's code editor will use this mimetype to provide syntax highlighting>
    }
}
*/
chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
    if (message.type === 'katalon_recorder_export') {
        var payload = message.payload;
        var commands = payload.commands;
        var content = '';
        var extension = '';
        var mimetype = '';
        switch (payload.capabilityId) {
            case 'plain-text':
                for (var i = 0; i < commands.length; i++) {
                    var command = commands[i];
                    content += command.command + ' | ' + command.target + ' | ' + command.value + '\n';
                }
                extension = 'txt';
                mimetype = 'text/plain';
                break;
            case 'json':
                content = JSON.stringify(commands);
                extension = 'json';
                mimetype = 'application/ld-json';
                break;
            default:
                content = 'Invalid capability ID';
                extension = 'txt';
                mimetype = 'text/plain';
        }
        sendResponse({
            status: true,
            payload: {
                content: content,
                extension: extension,
                mimetype: mimetype
            }
        });
    }
});
