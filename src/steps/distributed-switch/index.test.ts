import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-distributed-switch', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-distributed-switch',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.DISTRIBUTED_SWITCH);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
