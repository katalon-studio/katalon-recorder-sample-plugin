// Chrome Extension ID: ljdobmomdgdljniojadhoplhkpialdid
// Firefox Extension ID: {91f05833-bab1-4fb1-b9e4-187091a4d75d}

var extensionId = bowser.firefox ? '{91f05833-bab1-4fb1-b9e4-187091a4d75d}' : 'ljdobmomdgdljniojadhoplhkpialdid';

function register() {
  chrome.runtime.sendMessage(
      extensionId,
      {
          type: 'katalon_recorder_register',
          payload: {
              summary: 'Sample Katalon Recorder Plugin Format'
          }
      }
  );
}

register();

setInterval(register, 60 * 1000);

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
    if (message.type === 'katalon_recorder_export') {
        var commands = message.payload.commands;
        var content = '';
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            content += command.command + ' | ' + command.target + ' | ' + command.value + '\n';
        }
        sendResponse({
            status: true,
            payload: {
                content: content
            }
        });
    }
});
