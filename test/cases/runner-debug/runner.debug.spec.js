/*
 * Use Case
 * Runs the CLI fixture that copies dot files from fixtures directory.  Based
 * on copy-dots: https://github.com/thescientist13/copy-dots
 *
 * User Result
 * Should run cli.js runCommand and test debug output
 *
 * runCommand
 * runCommand('test/fixtures/cli', 'test/fixtures')
 *
 */
import * as chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Runner } from '../../../src/index.js';
import { fileURLToPath, URL } from 'url';

chai.use(sinonChai);
const { expect } = chai;

describe('CLI Fixture w/debug (stdOut) enabled', function() {
  const outputPath = fileURLToPath(new URL('./output', import.meta.url));
  const fixturesPath = path.join(process.cwd(), 'test/fixtures');

  describe('default options with relative path', function() {
    let runner;

    before(async function() {
      runner = new Runner(true);
    });

    it('should write to console.log', async function() {
      const testString = 'TEST';
      const consoleFake = sinon.fake();
      sinon.replace(console, 'log', consoleFake);

      await runner.runCommand(
        `${fixturesPath}/cli-write-to-stdout.js`,
        null,
        { async: true }
      );

      expect(consoleFake).to.have.been.calledOnceWithExactly(testString);
    });

    it('should write stderr to console.log', async function () {
      const testString = 'TEST ERROR';
      const consoleFake = sinon.fake();
      sinon.replace(console, 'error', consoleFake);

      await expect(
        runner.runCommand(
          path.join(process.cwd(), 'test/fixtures/cli-write-to-stderr.js'),
          null,
          { async: true }
        )
      ).to.be.rejectedWith(testString);

      expect(consoleFake).to.have.been.calledOnceWithExactly(testString);
    });

    after(function() {
      runner.teardown([
        path.join(outputPath)
      ]);
    });
  });
});