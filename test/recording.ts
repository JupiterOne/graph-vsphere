import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    redactedRequestHeaders: ['Authorization', 'vmware-api-session-id'],
    redactedResponseHeaders: ['set-cookie', 'vmware-api-session-id'],
    options: {
      matchRequestsBy: {
        url: {
          hostname: false,
        },
      },
    },
    ...input,
    mutateEntry: (entry) => {
      redact(entry);
    },
  });
}

function redact(entry): void {
  if (!entry.response.content.text) {
    return;
  }

  //let's unzip the entry so we can modify it
  mutations.unzipGzippedRecordingEntry(entry);

  const requestUrl = entry.request.url;
  if (requestUrl.match(/api\/session/)) {
    entry.response.content.text = '"REDACTED"';
    return;
  }
}
